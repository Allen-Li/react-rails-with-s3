class Image < ApplicationRecord
  belongs_to :email, optional: true

  has_attached_file :asset
    validates_attachment_content_type :asset,
    :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"],
    :path => ":rails_root/public/uploads/images/:id_:style_:fingerprint.:extension",
    :url => "/uploads/images/:id_:style_:fingerprint.:extension"

  before_save :handle_link

  def data_with_base64
    image_data = attributes.slice('id', 'link', 'alt', 'asset_file_name', 'width')
    image_data[:asset] = "https:#{asset.url}"
    image_data
  end

  private

  def handle_link
    if link.present? && link !~ /^http/
      self.link = "https://#{link}"
    end
  end
end
