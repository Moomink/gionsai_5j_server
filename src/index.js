const express = require('express');
const http = require('http');


const socketIo = require('socket.io');

const app = express();
const server = http.Server(app);

const PORT = 3000;

const ipList = {};

const io = socketIo(server);
// ルーティングの設定。'/' にリクエストがあった場合 src/index.html を返す
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 3000番ポートでHTTPサーバーを起動
server.listen(PORT,"0.0.0.0", () => {
    console.log(`listening on port ${PORT}`);
});




io.on('connection', socket => {
    socket.on("sendMessage",(ip,message,) =>{
        io.to(ipList[ip].emit("message",message));
        console.log("Message [%s] send to %s.",message,ip);
    })

    socket.on("RequestIPList",messasge =>{
        console.log("Request received.");
        io.to(socket.id).emit("receiveIP",JSON.stringify(ipList));
    });
    ipList[socket.handshake.address] = socket.id
    console.log("IP:%s added. now:%s",socket.handshake.address,ipList)
});