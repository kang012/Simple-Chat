class FriendshipsController < ApplicationController
  def index
    @friendships = current_user.friendships
  end

  def create
  end

  def show
    @friendship = Friendship.find(params[:id])
    @messages = @friendship.friend_messages
    @message = FriendMessage.new
  end
end