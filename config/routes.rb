Rails.application.routes.draw do
  root to: 'rooms#show'

  devise_for :users
  post '/users/remove_friend/:id', to: 'rooms#remove_friend'
  post '/users/remove_from_group_chat/:id', to: 'rooms#remove_from_group_chat'
  post '/users/remove_notifications/:id', to: 'rooms#remove_notifications'
  post '/users/create_group_chat/:person1/:person2', to: 'rooms#create_group_chat'
  post '/users/add_to_group_chat/:gc/:id', to: 'rooms#add_to_group_chat'
  get '/inbox', to: 'rooms#inbox'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # Serve websocket cable requests in-process
  mount ActionCable.server => '/cable'
end
