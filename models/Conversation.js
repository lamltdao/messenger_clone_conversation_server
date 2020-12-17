const mongoose = require('mongoose');
const {messageSchema} = require('./Message')
const conversationSchema = new mongoose.Schema({
    messages: [messageSchema],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Conversation', conversationSchema)