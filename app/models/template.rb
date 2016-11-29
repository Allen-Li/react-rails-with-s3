class Template < ApplicationRecord
  has_many :emails

  validates :name, uniqueness: { message: "%{value} has already been taken." }
  validates :name, :html, presence: true

  before_save :handle_name

  private

  def handle_name
    self.name = self.name.strip.gsub(/.html$/, '')
  end
end
