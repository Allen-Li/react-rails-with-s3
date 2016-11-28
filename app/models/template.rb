class Template < ApplicationRecord
  has_many :emails

  validates :name, uniqueness: { message: "%{value} has already been taken." }
end
