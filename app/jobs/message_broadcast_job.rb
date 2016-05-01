class MessageBroadcastJob < ApplicationJob
  queue_as :default

  def perform(message)

    unless message.room.include?("group")
      # Broadcast to author
      ActionCable.server.broadcast "room_channel_#{message.author}", content: render_message(message, "to"), room: "room_channel_#{message.room}", author: message.author
      # Broadcast to recipient
      ActionCable.server.broadcast "room_channel_#{message.room}", content: render_message(message, "from"), room: "room_channel_#{message.author}", author: message.author, author_obj: User.find(message.author)
      Notification.create!(user: User.find(message["room"].to_i), author_id: message["author"], author_name: User.find(message["author"]).email) unless message["room"].include?("nil") || message["room"].include?("group_")
    else
      unless message.author == -1
        # Broadcast to author
        ActionCable.server.broadcast "room_channel_#{message.author}", content: render_message(message, "to"), room: "room_channel_#{message.room}", author: message.author
        # Broadcast to recipients
        ActionCable.server.broadcast "room_channel_#{message.room}", content: render_message(message, "from"), room: "room_channel_#{message.room}", author: message.author, author_obj: User.find(message.author)
      else
        if message.content == "create"
          group_chat = GroupChat.find(message.room.remove("group_").to_i)
          group_chat.users.each do |u|
            ActionCable.server.broadcast "room_channel_#{u.id}", content: render_message(message, "system"), room: "room_channel_group_#{group_chat.id}", author: "system", gc_obj: {id: group_chat.id, users: group_chat.users}, author_obj: User.find(u.id)
          end
        end
        if message.content == "add"
          group_chat = GroupChat.find(message.room.remove("group_").to_i)
          group_chat.users.each do |u|
            ActionCable.server.broadcast "room_channel_#{u.id}", content: render_message(message, "system"), room: "room_channel_group_#{group_chat.id}", author: "system", gc_obj: {id: group_chat.id, users: group_chat.users}, author_obj: User.find(u.id)
          end
        end
      end
    end

  end

  private
  def render_message(message, message_class)
    ApplicationController.renderer.render(partial: 'messages/message_component', locals: {message_class: message_class, message: message })
  end

end
