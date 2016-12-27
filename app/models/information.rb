class Information
  DEFAULT_KEY = "#{Rails.env}/information.md"
  class << self
    def fetch_data
      s3_object.get.body.read
    end

    def put_data data
      s3_object.put(data)
    end

    def s3_bucket
      s3 = Aws::S3::Resource.new
      s3.bucket(ENV['S3_BUCKET_NAME'])
    end

    def s3_object
      s3_bucket.object(ENV['INFORMATION_KEY'] || DEFAULT_KEY)
    end
  end
end