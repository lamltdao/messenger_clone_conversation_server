const MessageModel = require('../models/Message').model
const UserModel = require('../models/User').model
const ConversationModel = require('../models/Conversation')
const mongoose = require('mongoose')
let handleChatSocket = async (socket) => {
  try {
    const {userId} = socket.handshake.query
    // Use userId as name of room
    socket.join(JSON.stringify(userId))
    
    

    // Handle new messages
    socket.on('send-message', async ({conversationId, user, messageBody}) => {
      // Create a message with the message and id of the user.
      const newMessage = new MessageModel({
        messageBody,
        user: user._id,
      })

      // Save the message to the database.
      const conversation = await ConversationModel.findById(conversationId, (err, conversation) => {
          if(err) return console.log(err)
          conversation.messages.push(newMessage)
          conversation.save((err) => {
            if (err) return console.log(err);
          })
      })
      const recipients = conversation.users.filter(recipient => recipient._id !== user._id )
        .map(recipient => {
          // Notify all other users, excluding the sender, about the new message.
          socket.to(JSON.stringify(recipient._id)).emit('push-message', {conversationId, user , messageBody})
        })
    })
  }
  catch(err) {
  }
}

let handleVideoCallSocket = async (socket) => {
  try {
    const {userId} = socket.handshake.query
    // Handle video call
    socket.on('calling', ({conversationId, userId}) => {
      socket.to(JSON.stringify(conversationId)).emit('notify-call', {conversationId, userId})
    })

    socket.on('join-call', ({conversationId, userId, peerId}) => {
      const room = JSON.stringify(conversationId)
      socket.join(room)
      // notify existing connected users that a new user is connected
      socket.to(room).emit('user-connected', {userId, peerId})
    })
    // notify others if a user is disconnected
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', userId)
    })

  }
  catch(err) {
  }
}

module.exports = {
    handleChatSocket,
    handleVideoCallSocket
}