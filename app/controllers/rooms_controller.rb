class RoomsController < ApplicationController
  before_action :authenticate_user!, except: [:show]

  def show
    @messages = Message.all
    @friends = current_user.friends if user_signed_in?
    @group_chats = GroupChat.all.map {|gc| {id: gc.id, users: gc.users} }
  end

  def inbox
    @messages = Message.all
    @friends = current_user.friends if user_signed_in?
    @group_chats = GroupChat.all.map {|gc| {id: gc.id, users: gc.users} }
  end

  def is_online
    is_online = (User.find(params[:id]).last_seen > 15.minutes.ago) && (User.find(params[:id]).online)
    if is_online
      head :ok
    else
      head 404
    end
  end

  def remove_friend
    Friendship.where("user_id = ? AND friend_id = ?", current_user.id, params[:id].to_i).destroy_all
    Friendship.where("friend_id = ? AND user_id = ?", current_user.id, params[:id].to_i).destroy_all

    head :ok
  end

  def remove_notifications
    current_user.notifications.where(author_id: params[:id]).destroy_all

    head :ok
  end

  def remove_from_group_chat
    current_user.group_chats = current_user.group_chats.reject { |gp| gp.id == params[:id].to_i }
    head :ok
  end

  def create_group_chat
    person1 = User.find(params[:person1])
    person2 = User.find(params[:person2])
    gc = GroupChat.create(users: [current_user, person1, person2])
    Message.create(content: "create", author: -1, room: "group_#{gc.id}")
    head :ok
  end

  def add_to_group_chat
    gc = GroupChat.find(params[:gc])
    user = User.find(params[:id])
    gc.users << user
    Message.create(content: "add", author: -1, room: "group_#{gc.id}")
    head :ok
  end

end
