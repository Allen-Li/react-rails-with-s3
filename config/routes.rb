Rails.application.routes.draw do
  resources :emails do
    get 'preview' => 'emails#preview'
    get 'download' => 'emails#download'
  end

  resources :templates do
    get 'preview' => 'templates#preview'
    get 'download' => 'templates#download'
  end

  root to: 'emails#index'
end
