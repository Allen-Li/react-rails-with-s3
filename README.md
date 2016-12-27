## 项目介绍
向模板html文件中插入js、css、html 或 图片，根据特定生成新的html文件

## 安装运行

```sh
bundle install

rails db:create

rails db:migrate

npm install

rails s
```
## 不使用s3
如果不使用s3保存文件，图片都是保存在本地，有些功能可能有问题

1. 修改 /config/application.rb、/app/models/image.rb 等相关的代码,
```ruby
  # /config/application.rb
  config.paperclip_defaults

  # /app/models/image.rb
  # upload image to local
  has_attached_file :asset
    validates_attachment_content_type :asset,
    :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"],
    :path => ":rails_root/public/uploads/images/:id_:style_:fingerprint.:extension",
    :url => "/uploads/images/:id_:style_:fingerprint.:extension"
```
2. 配置 s3 相关信息

```ruby
  # /config/application.yml
  S3_HOST_ALIAS:
  S3_BUCKET_NAME: 
  AWS_ACCESS_KEY_ID: 
  AWS_SECRET_ACCESS_KEY: 
  AWS_REGION: 
```

## Information 是从s3读取数据, s3文件路径:
```ruby
  /:bucket_folder/:env_folder/information.md
```
