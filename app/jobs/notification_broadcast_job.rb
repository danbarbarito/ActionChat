class NotificationBroadcastJob < ApplicationJob
  queue_as :default

  def perform(notification)
    # Broadcast to recipient
    ActionCable.server.broadcast "#{notification.room}", notification_type: notification.notification_type, room: "room_channel_#{message.author}", author: message.author, author_obj: User.find(message.author)
  end

  private
  def render_message(message, message_class)
    ApplicationController.renderer.render(partial: 'messages/message_component', locals: {message_class: message_class, message: message })
  end

end
