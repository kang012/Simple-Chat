class FriendMessagesController < ApplicationController
  def create
    friendship_id = params[:friendship_id]
    message = FriendMessage.new(friend_message_params.merge(friendship_id: friendship_id, user_id: current_user.id))

    if message.save
      RoomUser.update_last_read_message!(friendship_id, current_user.id, message.id)
      ActionCable.server.broadcast("friendship_#{friendship_id}", content: message.content, username: current_user.username, userId: current_user.id)
      # ActionCable.server.broadcast('unread_message', friendship_id: friendship_id)
      head :ok
    else
      render json: message.errors.messages, status: :unprocessable_enity
    end
  end

  def destroy
  end

  def old
    room = Room.find(params[:room_id])
    messages = room.messages.where('id < ?', params[:first_message_id]).limit(40).order(id: :desc)
    render json: messages, each_serializer: MessageSerializer, status: :ok
  end

  private

  def friend_message_params
    params.require(:friend_message).permit(:content)
  end
end