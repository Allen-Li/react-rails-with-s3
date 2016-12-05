class Template < ApplicationRecord
  has_many :emails

  validates :name, uniqueness: { message: "%{value} has already been taken." }
  validates :name, :html, presence: true

  before_save :handle_name

  def width
    width_px = name[/\d+px/]
    name[/\d+px/] ? name[/\d+px/][/\d+/].to_i : 'responsive'
  end

  def is_responsive?
    name.include?('responsive')
  end

  private

  def handle_name
    self.name = self.name.strip.gsub(/.html$/, '')
  end
end
