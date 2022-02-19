const WebSocket = require('ws');
const uuid = require("uuid");
let qs = require('qs');
const clients = []; //创建客户端列表，用于保存客户端及相关连接信息
const UserDB = require("../db/UserDB");
const fs = require("fs");


const wss = new WebSocket.Server({ port: 3030 });
wss.on('connection', function (ws, req) {
  const client_uuid = uuid.v4();
  const loginId = (qs.parse(req.url.split('?')[1])).loginId;
  UserDB.find({ userId: loginId }, (err, data) => {
    if(err) {
      console.log("找不到呀");
    } else {
      const imgPath = `http://localhost:3000/images/${data[0].userImg}`;
      const nickname = data[0].userName;
      clients.push({
        id: client_uuid,
        ws,
        nickname,
        imgPath
      });
      ws.on("message", function (message) { // 这里的msg是buffer类型的，和空字符串相加才是字符串
        console.log('收到' + '的消息：' + message);
        let msg = message + ""
        broadcastSend('user', msg, nickname, client_uuid, imgPath);
      })
    }
  })
})

// 广播所有信息
function broadcastSend(type, message, nickname, id, imgPath) {
  let currentClient = clients.find(item => item.id === id);
  clients.forEach(client => {
    if (type === 'user' || type === 'userSelf') {
      type = id === client.id ? "userSelf" : "user";
    }
    let sendMessageValue = {
      type,
      nickname,
      message,
      imgPath
    }
    sendMessageValue = JSON.stringify(sendMessageValue);
    client.ws.send(sendMessageValue)
  })
}

module.exports = wss