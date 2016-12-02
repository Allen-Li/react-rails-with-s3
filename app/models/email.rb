class Email < ApplicationRecord
  has_many :images, dependent: :destroy
  belongs_to :template

  accepts_nested_attributes_for :images, allow_destroy: true

  serialize :tracking_pixels

  before_save :handle_name
  after_save :destroy_invalid_data

  def nested_email_data
    email_data = attributes
    email_data[:images_attributes] = images.order(:position).map(&:data_with_base64)
    email_data
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
end
