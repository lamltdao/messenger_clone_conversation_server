const express = require('express')
const router = express.Router()
const ConversationController = require('../controllers/ConversationController')
const checkUserJwt = require('../middlewares/checkUserJwt')

router.post('/',checkUserJwt, ConversationController.createNewConversation)
router.get('/', checkUserJwt, ConversationController.getAllConversations)
router.get('/:conversationId', checkUserJwt, ConversationController.getConversationById)
router.delete('/:conversationId', checkUserJwt, ConversationController.deleteConversation)

module.exports = router