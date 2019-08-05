const express = require('express')
const app = express()
app.use(express.static(__dirname))
app.listen(3000)

const Sever = require('ws').Server
const ws = new Sever({
    port: 9999
})
// 建立连接
ws.on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log('消息内容：', msg)
        // 向客户端发消息
        socket.send(`接收到你的消息了,你说：“${msg}”`)
    })
})