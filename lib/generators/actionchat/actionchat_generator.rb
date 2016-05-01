class ActionchatGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('../templates', __FILE__)
  def copy_javascript_file
    copy_file "assets/javascripts/channels/room.coffee", "app/assets/javascripts/channels/room.coffee"
  end
  def copy_channel_file
    copy_file "channels/room_channel.rb", "app/channels/room_channel.rb"
  end
end
