const MessageModel = require('../models/Message').model
const UserModel = require('../models/User').model
const ConversationModel = require('../models/Conversation')


module.exports = {
    createNewConversation: async (req, res) => {
        try {
            const {messages, users} = req.body
            const conversation = new ConversationModel({messages, users})
            await conversation.save()
            return res.status(201).json({conversationId: conversation._id})
        }
        catch {
            return res.status(400).json('Cannot save conversation')
        }
    },
    getAllConversation: async (req, res) => {
        try {
            const {userId} = req.payload
            const conversationIds = await ConversationModel.find({
                users: {"$in": [userId]}
            }, '_id')
            return res.status(200).json({conversationIds})
        }
        catch {
            if(conversations == null) {
                return res.status(404).json('Cannot find conversations')
            }
            return res.status(500).json('Internal error')
        }
    },
    deleteConversation: async (req,res) => {
        
    }
}