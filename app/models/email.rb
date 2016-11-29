class Email < ApplicationRecord
  has_many :images
  belongs_to :template

  serialize :tracking_pixel

  before_save :handle_name

  private

  def handle_name
    self.name = self.name.strip
  end
end
