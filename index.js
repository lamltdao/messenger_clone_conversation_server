if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// node lib
const express = require('express')
const app = express()
const http = require('http').Server(app)
const mongoose = require('mongoose')
const path = require('path')
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const cors = require('cors')
// other folders
const SocketController = require('./controllers/SocketController')
const ConversationRoute = require('./routes/ConversationRoute')
// setup options
app.use(express.static(path.join(__dirname,'..','client','build')))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.use(bodyParser.json())
app.use(cors())
// Connect DB
mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => console.log('Connected to MongoDB'))

// Routers
app.use('/conversation', ConversationRoute)

// Socket
io.on('connection', SocketController.handleSocket)

// Listen on port
http.listen(process.env.PORT, () => {
    console.log('Message server is listening on port ' + process.env.PORT);
})