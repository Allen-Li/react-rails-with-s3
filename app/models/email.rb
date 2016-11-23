class Email < ApplicationRecord
  has_many :images
  belongs_to :template
end
