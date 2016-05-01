class GroupChat < ApplicationRecord
  has_many :group_chat_handlers
  has_many :users, through: :group_chat_handlers
end
