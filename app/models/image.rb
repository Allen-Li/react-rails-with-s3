class Image < ApplicationRecord
  belongs_to :email, optional: true

  has_attached_file :asset
    validates_attachment_content_type :asset,
    :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"],
    :path => ":rails_root/public/uploads/images/:id_:style_:fingerprint.:extension",
    :url => "/uploads/images/:id_:style_:fingerprint.:extension"

  def data_with_base64
    image_data = attributes.slice('id', 'link', 'alt', 'asset_file_name', 'width')
    image_data[:asset] = "https:#{asset.url}"
    image_data
  end

  def image_el
    "<tr>
      <td width=\"100%\">
        #{ link ? a_img_tag_el : img_tag_el }
      </td>
    </tr>"
  end

  private


  def img_tag_el
    "<img style=\"display: block;\" border=\"0\" src=\"https://#{asset.url}\" alt=\"#{alt}\" width=\"100%\" style=\"max-width:100%\"/>"
  end

  def a_img_tag_el
    "<a href=\"#{link_for_a_tag}\" target=\"_blank\"> #{img_tag_el} </a>"
  end

  def link_for_a_tag
    link.present? && link !~ /^http/ ? "https://#{link}" : link
  end
end
