class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :lastseenable
  # Friends
  has_many :friendships
  has_many :friends, through: :friendships

  # Group Chats
  has_many :group_chat_handlers
  has_many :group_chats, through: :group_chat_handlers

  #Notifications
  has_many :notifications
end
