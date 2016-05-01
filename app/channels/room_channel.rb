# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_channel_#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(message)

    unless message["room"].include?("group")
      uid = message["room"].to_i
      unless current_user.friends.include?(User.find(uid))
        current_user.friends << User.find(uid)
      end
      unless User.find(uid).friends.include?(User.find(uid))
        User.find(uid).friends << current_user
      end
    end

    Message.create!(room: message["room"], author: current_user.id, content: message["content"]) unless message["room"].include?("nil")
  end
end
