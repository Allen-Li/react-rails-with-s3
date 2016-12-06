require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module NdeAdminTool
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.browserify_rails.commandline_options = '-t babelify'

    config.paperclip_defaults = {
      storage: :s3,
      url: ':s3_host_alias',
      s3_region: ENV['AWS_REGION'],
      s3_host_alias: ENV['S3_HOST_ALIAS'],
      s3_credentials: {
        bucket: ENV['S3_BUCKET_NAME'],
        access_key_id: ENV['AWS_ACCESS_KEY_ID'],
        secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
      }
    }
  end
end
