Rails.application.routes.draw do
  resources :emails do
    member do
      get 'preview'
      get 'download'
      put 'publish'
    end
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
