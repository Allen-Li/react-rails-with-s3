module EmailsHelper
  def get_information
    path = "#{Rails.root}/config/information.md"
    File.exist?(path) ? File.read(path) : 'There is no information to display.'
  end
end
