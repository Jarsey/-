const express = require('express')
const app = express()
// const server = app.listen(3000)

// app.use(express.static(__dirname))
// const server = require('http').Server(app)
const server = require('http').createServer(app)
// var io = require('socket.io')(server)
const io = require('socket.io').listen(server)

io.on('connection', function (socket) {
    console.log('socket', socket)
    socket.send('你很烦')
    socket.on('message', function (msg) {
        console.log('msg', msg)
        socket.send('收到发来的消息', msg.data)
    })
})
server.listen(3000)