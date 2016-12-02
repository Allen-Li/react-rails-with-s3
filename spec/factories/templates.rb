FactoryGirl.define do
  factory :template do
    name { Faker::Name.name }
    html '<html><head>{{tracking_pixels}}</head><body>{{content}}</body></html>'
  end
end
