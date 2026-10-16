
// ws 服务器--通告发布
const WebSocket = require('ws');
const http = require('http');

class WebSocketServer {
  constructor(server) {
    this.server = server;
    this.wss = new WebSocket.Server({ noServer: true });

    this.clients = new Set();  // 用于存储所有连接的客户端

    this.wss.on('connection', (ws) => {
      console.log('客户端已连接！！');

      this.clients.add(ws);  // 添加客户端到连接池

      // 向客户端发送欢迎信息
      ws.send(JSON.stringify({type:'success',data:'欢迎连接 WebSocket'}));

      // 接收客户端消息
      ws.on('message', (message) => {
        console.log('收到客户端消息: ', message);
      });

      // 客户端关闭连接时触发
      ws.on('close', () => {
        console.log('客户端已断开连接');
        this.clients.delete(ws);  // 移除已断开的客户端
      });
    });

    this.server.on('upgrade', (request, socket, head) => {
      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.wss.emit('connection', ws, request);
      });
    });

    console.log(`WebSocket 服务器已绑定到 HTTP 端口 ${this.server.address()?.port || 'unknown'}`);
  }

  // 发送消息给所有连接的客户端
  broadcast(message) {
    let newMessage=JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(newMessage);
      }
    });
  }

  // 发送消息给特定的客户端
  sendToClient(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }
}

     
// 假设你有一个客户端对象（ws），你可以发送消息给该客户端
// 注意：这个客户端连接必须已经在 `wsServer` 中创建连接
// setTimeout(() => {
//   if (wsServer.clients.size > 0) {
//     // 获取第一个客户端
//     const firstClient = Array.from(wsServer.clients)[0];
//     wsServer.sendToClient(firstClient, '向特定客户端发送的消息');
//   }
// }, 10000);


// 公共配置部分
const config = require("../../config");
const { database } = config;

const {
    host: dbhost,
    user: dbuser,
    password: dbpassword,
    database: dbdatabase
} = database;


let wsServer=null;

function initWs(server) {
    console.log('===ws初始化==');

    if (!server) {
        throw new Error('initWs requires an HTTP server instance');
    }

    wsServer = new WebSocketServer(server);

    // 调用广播功能，发送信息给所有客户端
      setInterval(() => {
        wsServer.broadcast({type:'success',data:'连接状态保持中...'});
      }, 10000); // 每10秒向所有客户端发送一次消息
}

function sendNotice(message){
    wsServer.broadcast(message);
}

// 导出模块
module.exports = {
    WebSocketServer,
    initWs,
    sendNotice
};