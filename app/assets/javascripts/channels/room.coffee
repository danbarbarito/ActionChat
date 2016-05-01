@CreateMySubscription = (user) ->
  App.room = App.cable.subscriptions.create { channel: "RoomChannel", room: "" + user.id },
    connected: ->
      # Called when the subscription is ready for use on the server

    disconnected: ->
      # Called when the subscription has been terminated by the server

    received: (data) ->

      if data["author"] == "system"
        if $("." + data["room"]).length == 0
          SubscribeToGroupChat(data["author_obj"], data["gc_obj"])
          CreateGroupChat(data["gc_obj"])
          $("." + data["room"]).show()
      if data["author"] != user.id
        # Create chat window if not already friends with author
        if $(".room_channel_" + data["author"]).length == 0 and data["author_obj"].id != user.id
          CreateIndividualMessage(data["author_obj"])
          $("." + data["room"]).show()

      setTimeout ( ->
        # Called when there's incoming data on the websocket for this channel
        $('.' + data['room'] + '#messageList').append data['content']
        # If you sent the message, show it
        if data["author"] ==  user.id
          $("." + data["room"]).show()
        $("#messageList." + data["room"]).scrollTop(99999)
        $("input." + data["room"]).prop("disabled", false)

        # Create a notification
        CreateNotification(data["author_obj"])
      ), 1000

    speak: (room, content) ->
      @perform('speak', room: room, content: content)

@SubscribeToGroupChat = (user, gc) ->
  App.room = App.cable.subscriptions.create { channel: "RoomChannel", room: "group_" + gc.id },
    connected: ->
      # Called when the subscription is ready for use on the server

    disconnected: ->
      # Called when the subscription has been terminated by the server

    received: (data) ->
      # If you sent the message, show it
      if data["author"] ==  user.id
        $("." + data["room"]).show()

      # Dont show message if its coming from you. It's already shown from the other channel
      unless data["author"] == user.id
        $('.' + data['room'] + '#messageList').append data['content']

      $("#messageList." + data["room"]).scrollTop(99999)
      $("input." + data["room"]).prop("disabled", false)

    speak: (room, content) ->
      @perform('speak', room: room, content: content)
