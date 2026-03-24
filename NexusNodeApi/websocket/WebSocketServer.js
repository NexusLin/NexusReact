
const express = require('express');
const webSocket = require("ws"); //引入ws服务器模块

const ws = new webSocket.Server({ port: 8000 }); //创建服务器,端口为8000
let clients = {};
let clientNum = 0;
ws.on("connection", (client) => {
  //连接客户端

  //给客户端编号,也就是参与聊天的用户
  client.name = ++clientNum;
  clients[client.name] = client;

  // 用户的聊天信息
  client.on("message", (msg) => {
    console.log("用户" + client.name + "说:" + msg);
    //广播数据发送输出
    broadcast(client, msg);
  });
  //报错信息
  client.on("error", (err) => {
    if (err) {
      console.log(err);
    }
  });
  // 下线
  client.on("close", () => {
    delete clients[client.name];
    console.log("用户" + client.name + "下线了~~");
  });
});

//广播方法
function broadcast(client, msg) {
  for (var key in clients) {
    clients[key].send("用户" + client.name + "说：" + msg);
  }
}
console.log('WebSocketServer.js -- 服务器端启动！')