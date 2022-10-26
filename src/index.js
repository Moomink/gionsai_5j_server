const express = require('express');
const http = require('http');


const socketIo = require('socket.io');

const app = express();
const server = http.Server(app);

const PORT = 18526;

const ipList = {};

const io = socketIo(server);
// ルーティングの設定。'/' にリクエストがあった場合 src/index.html を返す
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 3000番ポートでHTTPサーバーを起動
server.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on port ${PORT}`);
});




io.on('connection', socket => {

  socket.on("sendImage", (id, image) => {
    io.emit("image", image);
    console.log("image [%s] send to %s.", image, id);
  })
  socket.on("sendTemplate", (id, body) => {
    io.emit("template", body);
    console.log("template [%s] send to %s.", body, id);
  })

  socket.on("sendMessage", (id, message) => {
    io.emit("message", message);
    console.log("Message [%s] send to %s.", message, id);
  })

  socket.on("RequestIPList", messasge => {
    console.log("Request received.");
    io.to(socket.id).emit("receiveIP", JSON.stringify(ipList));
  });
  ipList[socket.handshake.address] = socket.id
  console.log("IP:%s added. now:%s", socket.handshake.address, ipList)
});
