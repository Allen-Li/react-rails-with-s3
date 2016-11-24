class Template < ApplicationRecord
  has_many :emails

  validates :name, uniqueness: true
end
