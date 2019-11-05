# frozen_string_literal: true
class FriendshipChannel < ApplicationCable::Channel
  def subscribed
    stream_from "friendship_#{params[:friendship_id]}"
  end
end
