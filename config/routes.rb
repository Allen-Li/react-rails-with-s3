Rails.application.routes.draw do
  resources :emails do
    member do
      get 'preview'
      get 'download'
      put 'publish'
    end

    collection { get 'information' }
  end

  resources :templates do
    member do
      get 'preview'
      get 'download'
    end

    collection { post 'upload' }
  end

  root to: 'emails#index'
end
