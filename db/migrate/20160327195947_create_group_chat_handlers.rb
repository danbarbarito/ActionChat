class CreateGroupChatHandlers < ActiveRecord::Migration[5.0]
  def change
    create_table :group_chat_handlers do |t|
      t.belongs_to :user, index: true
      t.belongs_to :group_chat, index: true

      t.timestamps
    end
  end
end
