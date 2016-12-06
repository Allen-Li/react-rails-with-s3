Paperclip.interpolates :env_folder do |_attachment, _style|
  Rails.env
end

Paperclip.interpolates :date  do |attachment, style|
  attachment.instance.updated_at.strftime('%m-%d-%Y')
end