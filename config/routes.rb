Rails.application.routes.draw do
  resources :emails

  resources :templates do
    get 'preview' => 'templates#preview'
    get 'download' => 'templates#download'
  end

  root to: 'emails#index'
end
