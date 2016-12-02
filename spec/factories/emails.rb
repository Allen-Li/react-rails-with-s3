FactoryGirl.define do
  factory :email do
    name { Faker::Name.name }
    path 'https://www.email_path.com'
    html '<p> Html in Email </p>'
    js_links ['https://test1.js', 'https//test2.js']
    css_links ['https://test1.css', 'https//test2.css']
    tracking_pixels ['https://test_pixel1', 'https://test_pixel2']
    template
  end
end
