(function () {
  var roomId = $('#room-id').val();
  if (!roomId) return;

  var $messageArea = $('.message-area');
  var $messageForm = $('.message-form textarea');

  App.room = App.cable.subscriptions.create({channel: 'RoomChannel', room_id: roomId}, {
    received: function (data) {
      $messageArea.append(this.renderMessage(data));
      $messageForm.val('');
      scrollToBottom();
    },
    renderMessage: function (data) { return messageItemTmpl(data.username, data.content, data.userId); }
  });

  $(function () {
    scrollToBottom();
    onScrollMessageArea();
    onEnterMessageform();
  });

  function scrollToBottom () {
    $messageArea.scrollTop($messageArea[0].scrollHeight);
  }

  function onEnterMessageform () {
    $messageForm.on('keydown', function (e) {
      if (!this.value || !this.value.trim()) return;
      if (e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        $('form#new_message').submit();
      }
    });
  }

  function onScrollMessageArea () {
    $messageArea.on('scroll', function (e) {
      var firstMessageId = $('#first-message-id').val();
      var scrollPosition = $messageArea.scrollTop();
      if (scrollPosition != 0 || firstMessageId <= 1) return;
      $.ajax({
        url: '/rooms/'+ roomId + '/messages/old/' + firstMessageId,
        method: 'GET',
        statusCode: {
          200: function (response) {
            response.forEach(function (item) {
              $messageArea.prepend(messageItemTmpl(item.username, item.content, item.user_id))
            });
            $messageArea.scrollTop(response.length * 20);
            $('#first-message-id').val(response[response.length - 1].id);
          }
        }
      });
    });
  }

  function messageItemTmpl(user, message, userId) {
    if(userId === window.userId){
      return '<div class="message-item text-right"><strong class="message-user">'+ user +': </strong><span>'+ message +'</span></div>'
    }else {
      return '<div class="message-item "><strong class="message-user">'+ user +': </strong><span>'+ message +'</span></div>'
    }
  }
})();
