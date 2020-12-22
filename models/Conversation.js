const mongoose = require('mongoose');
const {messageSchema} = require('./Message')
const conversationSchema = new mongoose.Schema({
    messages: [messageSchema],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }],
    name: {
        type: String
    }
})

module.exports = mongoose.model('Conversation', conversationSchema)