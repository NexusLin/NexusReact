
// ws 聊天部分
const WebSocket = require('ws');
const http = require('http');


// 接口部分

const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块

const { convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法

class WebSocketServer {
  constructor(server) {
    this.server = server;
    this.wss = new WebSocket.Server({ noServer: true });
    this.clients = new Set();  // 用于存储所有连接的客户端

    // 当客户端连接时触发
    this.wss.on('connection', (ws) => {
      console.log('聊天室已连接！！');

      this.clients.add(ws);  // 添加客户端到连接池

      // 向客户端发送欢迎信息
      ws.send(JSON.stringify({type:'success',data:'欢迎连接聊天室!'}));

      // 接收客户端消息
      ws.on('message', (row) => {
        let newMsg=JSON.parse(row);
        console.log('收到客户端消息:', newMsg.data);
        
        if(newMsg.type=='chatmsg'){
          // 新增
          handleChatMessage(newMsg);
        }
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

    console.log(`ws聊天已绑定到 HTTP 端口 ${this.server.address()?.port || 'unknown'}`);
  }

  // 发送消息给所有连接的客户端
  broadcast(message) {
    // let newMessage=JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
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

let wsServer=null;

function initWsChat(server) {
    console.log('初始化ws聊天室');

    if (!server) {
        throw new Error('initWsChat requires an HTTP server instance');
    }

    wsServer = new WebSocketServer(server);
    // 调用广播功能，发送信息给所有客户端
      setInterval(() => {
        wsServer.broadcast(JSON.stringify({type:'success',data:'服务器发送的聊天消息'}));
      }, 10000); // 每10秒向所有客户端发送一次消息
}

function handleChatMessage(data) {
  // Ω
   const currentTime = new Date();
   const insertSql = 'INSERT INTO sys_chat SET ?'; // 准备 SQL 插入语句
   const {chat_name, user_id, user_name, avatar, receiver_id, content, grade} 
    = convertKeysToSnakeCase(data.data);
  const postData = {
   chat_name, user_id, user_name, avatar, receiver_id, content, grade,
    // create_time: currentTime,
    // update_time: currentTime,
  };

  const sendData = convertToCamelCase(postData);
  console.log(postData,'postData');
  console.log(sendData,'sendData');
  connectionPool.query(insertSql, postData, (error) => {
    if (error) {
      console.error('Error inserting chat message:', error);
      return;
    }
    sendWmsg(JSON.stringify({type: 'chatmsg',data: sendData}));
  });
}

function handleQueryChatMsg(data) {
   const currentTime = new Date();
   const insertSql = 'INSERT INTO sys_chat SET ?'; // 准备 SQL 插入语句
   const {chat_name, user_id, user_name, avatar, receiver_id, content, grade} 
    = convertKeysToSnakeCase(data.data);
  const postData = {
   chat_name, user_id, user_name, avatar, receiver_id, content, grade,
    // create_time: currentTime,
    // update_time: currentTime,
  };

  const sendData = convertToCamelCase(postData);
  console.log(postData,'postData');
  console.log(sendData,'sendData');
  connectionPool.query(insertSql, postData, (error) => {
    if (error) {
      console.error('Error inserting chat message:', error);
      return;
    }
    sendWmsg(JSON.stringify({type: 'chatmsg',data: sendData}));
  });
}

function sendWmsg(message){
    wsServer.broadcast(message);
}

// 导出模块
module.exports = {
    WebSocketServer,
    initWsChat,
    sendWmsg,
};