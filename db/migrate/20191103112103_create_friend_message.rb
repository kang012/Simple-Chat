class CreateFriendMessage < ActiveRecord::Migration[5.0]
  def change
    create_table :friend_messages do |t|
      t.integer :user_id
      t.integer :friendship_id
      t.text :content

      t.timestamps
    end

    add_index :friend_messages, [:user_id, :friendship_id]
  end
end
