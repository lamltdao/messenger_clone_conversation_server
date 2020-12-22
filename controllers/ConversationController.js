const MessageModel = require('../models/Message').model
const UserModel = require('../models/User').model
const ConversationModel = require('../models/Conversation')


module.exports = {
    createNewConversation: async (req, res) => {
        try {
            const {messages, recipientIds} = req.body
            const {userId}= req.payload
            const users = [...recipientIds, userId]
            
            const name = recipientIds.length == 1 ? recipientIds[0] : recipientIds.join(', ')
            const conversation = new ConversationModel({messages, users, name})
            await conversation.save()
            return res.status(201).json(conversation)
        }
        catch(err) {
            return res.status(500).json('Cannot create conversation')
        }
    },
    getAllConversation: async (req, res) => {
        try {
            const {userId} = req.payload
            const conversations = await ConversationModel.find({
                users: {"$in": [userId]}
            }).populate('users').exec()
            if(conversations == null) {
                return res.status(404).json('Cannot find conversations')
            }
            return res.status(200).json(conversations)
        }
        catch(err) {
            console.log(err);
            return res.status(500).json('Internal error')
        }
    },
    deleteConversation: async (req,res) => {
        try {
            const {userId} = req.payload
            const {conversationId} = req.params
            const conversation = await ConversationModel.findById(conversationId)
            await conversation.remove()
            return res.status(204).json("Successfully delete conversation")
        }
        catch {
            return res.status(500).json('Cannot delete conversation')
        }
    }
}