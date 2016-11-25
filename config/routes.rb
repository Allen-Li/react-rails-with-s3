Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :emails

  resources :templates do
    get 'download' => 'templates#download'
  end

  root to: 'emails#index'
end
