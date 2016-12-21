class Email < ApplicationRecord
  validates :name, uniqueness: { message: "%{value} has already been taken." }

  has_many :images, dependent: :destroy
  belongs_to :template

  accepts_nested_attributes_for :images, allow_destroy: true

  serialize :tracking_pixels

  before_save :handle_name
  after_save :destroy_invalid_data
  after_save :update_nde
  after_destroy :destroy_nde_on_aws, if: :path

  def nested_email_data
    email_data = attributes
    email_data[:images_attributes] = images.order(:position).map(&:data_with_base64)
    email_data
  end

  def publish
    path = "#{Rails.root}/tmp/nde/#{name}"
    File.open(path, 'w+') {|f| f.write(nde) }
    obj = s3_bucket.object("#{Rails.env}/nde/#{name}.html")
    obj.upload_file(path, acl:'public-read')
    update_attributes(path: obj.public_url)
  ensure
    File.delete(path)
  end

  private

  def handle_name
    self.name = self.name.strip
  end

  def destroy_invalid_data
    if email_type == 'client_html'
      images.destroy_all
    else
      update_column(:html, '')
    end
  end

  def min_image_width
    images.order(:width).first.width
  end

  def update_nde
    nde_value = template.is_responsive? || email_type == 'client_html' ? template.html : improved_template_html
    nde_value = nde_value.gsub("{{tracking_pixels}}", tracking_pixels_el)
      .gsub("{{moat_tags}}", moat_tags_el)
      .gsub("{{content}}", content_el)
    nde_value = add_css(nde_value)
    update_column(:nde, nde_value)
  end

  def improved_template_html
    template_html = template.html
    template.html.scan(/width="\d*"/).each do |str|
      if str[/\d+/].to_i > 600
        template_html.gsub!(str, "width=\"#{min_image_width}\"")
      end
    end
    template.html.scan(/max-width:\d*px/).each do |str|
      if str[/\d+/].to_i > 600
        template_html.gsub!(str, "max-width:#{min_image_width}px")
      end
    end
    template_html
  end

  def add_css nde_value
    value = Nokogiri::HTML(nde_value)
    value.at('head').children.last.add_next_sibling(css_el)
    value.to_html
  end

  def content_el
    email_type == 'client_html' ? html_content_el : image_table_el
  end

  def tracking_pixels_el
    tracking_pixels.map do |pixel|
      "<a><img src=\"#{pixel}\" width=\"1\" height=\"1\" border=\"0\" style=\"display:none;\"></a>"
    end.join(' ')
  end

  def parse_html
    Nokogiri::HTML(html)
  end

  def html_content_el
    body_content = parse_html.at('body')
    body_content ?  body_content.children.to_html : ''
  end

  def css_el
    parse_html.search('style').to_html
  end

  def moat_tags_el
    if moat_tags.include?('script')
      moat_tags
    else
      "<script src=\"#{moat_tags}\"  type=\"text/javascript\"></script> \n"
    end
  end

  def image_table_el
    images_el = images.order(:position).map { |image| image.image_el }.join('')

    "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" style=\"max-width:#{min_image_width}px\">
      #{images_el}
    </table>"
  end

  def destroy_nde_on_aws
    key = URI.parse(path).path[1..-1]
    s3_bucket.object(key).delete
  end

  def s3_bucket
    s3 = Aws::S3::Resource.new
    s3.bucket(ENV['S3_BUCKET_NAME'])
  end
end
