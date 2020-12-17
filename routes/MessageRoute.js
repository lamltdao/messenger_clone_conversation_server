const express = require('express')
const router = express.Router()
const MessageController = require('../controllers/MessageController')
const checkUserJwt = require('../middlewares/checkUserJwt')

router.post('/conversation',checkUserJwt, MessageController.createNewConversation)
router.get('/conversation', checkUserJwt, MessageController.getAllConversation)
router.delete('/conversation', checkUserJwt, MessageController.deleteConversation)
