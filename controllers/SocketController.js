const MessageModel = require('../models/Message').model
const UserModel = require('../models/User').model
const ConversationModel = require('../models/Conversation')

let handleSocket = (socket) => {
    const {userId} = socket.handshake.query
    socket.join(userId)

    // // Get the last 10 messages from the database.
    // MessageModel.find().sort({createdAt: -1}).limit(10).exec((err, messages) => {
    //   if (err) return console.error(err);

    //   // Send those messages to the user.
    //   socket.emit('init', messages);
    // });

    // Listen to connected users for a new message.
    socket.on('send-message', async ({conversationId, messageBody}) => {
      // Create a message with the message and id of the user.
      const newMessage = new MessageModel({
        messageBody,
        user: userId,
      })

      // Save the message to the database.
      const conversation = await ConversationModel.findById(conversationId, (err, conversation) => {
          if(err) return console.error(err)
          conversation.messages.push(newMessage)
          conversation.save((err) => {
            if (err) return console.error(err);
          })
      })

      // Notify all other users, including the sender, about the new message.
      let allRecipientIds = conversation.users
      allRecipientIds.forEach(recipientId => {
        socket.broadcast.emit('push-message', {conversationId, userId ,messageBody});
      })
    });
}

module.exports = {
    handleSocket
}