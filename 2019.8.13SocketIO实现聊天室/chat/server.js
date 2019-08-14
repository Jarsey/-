const express = require('express')
const app = express()
app.use(express.static(__dirname))


const server = require('http').Server(app)
const io = require('socket.io')(server)
io.on('connection', socket => {
    console.log('服务端连接成功')
})


server.listen(3000)