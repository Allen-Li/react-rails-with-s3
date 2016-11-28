class Email < ApplicationRecord
  has_many :images
  belongs_to :template

  serialize :tracking_pixel
end
