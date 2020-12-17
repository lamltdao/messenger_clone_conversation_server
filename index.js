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

// other folders
const SocketController = require('./controllers/SocketController')

// setup options
app.use(express.static(path.join(__dirname,'..','client','build')))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

// Connect DB
mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => console.log('Connected to MongoDB'))

// Routers


// Socket
io.on('connection', SocketController.handleSocket)

// Listen on port
http.listen(process.env.PORT, () => {
    console.log('App is listening on port ' + process.env.PORT);
})