const MessageModel = require('../models/Message').model
const UserModel = require('../models/User').model
const ConversationModel = require('../models/Conversation')


module.exports = {
    createNewConversation: async (req, res) => {
        try {
            const {messages, users} = req.body
            const {userId}= req.payload
            users.push(userId)
            const name = ''
            const conversation = new ConversationModel({messages, users, name})
            try {
                await conversation.save()
            }
            catch {
                return res.status(400).json('Bad Input')
            }
            return res.status(201).json(conversation)
        }
        catch(err) {
            console.log(err);
            return res.status(500).json('Internal error')
        }
    },
    getAllConversations: async (req, res) => {
        try {
            const {messageLimit} = req.query
            const {userId} = req.payload
            
            // get conversations
            const conversations = await ConversationModel.find({
                users: {"$in": [userId]}
            })
            .populate('users', '_id name email')
            .populate({
                path: 'messages',
                populate: {
                    path: 'user',
                    select: '_id name email'
                }
            }) 
            .exec()
            // get a limited number of messages only    
            conversations.map(conversation => {
                const length = conversation.messages.length
                if(length >= messageLimit) {
                    const limitedMessages = conversation.messages.filter((element, index) => {
                        return index >= length - messageLimit
                    })
                    conversation.messages = limitedMessages               
                }
            })
        
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
            const {conversationId} = req.params
            const conversation = await ConversationModel.findById(conversationId)
            await conversation.remove()
            return res.status(204).json("Successfully delete conversation")
        }
        catch {
            return res.status(500).json('Internal error')
        }
    },
    getConversationById: async (req,res) => {
        try {
            const {conversationId} = req.params
            const conversation = await ConversationModel.findById(conversationId)
            return res.status(200).json(conversation)
        }
        catch {
            return res.status(500).json('Internal error')
        }
    }
}