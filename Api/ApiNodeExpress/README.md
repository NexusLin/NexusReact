

# 🚀 ApiNodeExpress

### 📖 介绍
ApiNodeExpress 是一个基于 Node.js (Express) 的全后台 API 服务项目，提供接口请求与数据库交互功能。

也是最适合新手学习和实践的全栈项目，通过该项目，你可以学习到如何使用 Node.js 和 Express 框架搭建一个完整的 API 服务，并了解如何与 MySQL 数据库进行交互。

项目处于 Level-1，适合新手入门，学习如何搭建一个简单的后台服务。

---

### 🛠️ 技术栈
- **运行环境**: Node.js
- **后台框架**: Express
- **数据库**: MySQL
- **通信协议**: HTTP / WebSocket

---

### 💾 导入数据库

在导入数据库前，请确保本地已安装并配置好 MySQL 环境。

```bash
# 检查 mysql 数据库版本
mysql -V
```

#### 全量引入方式
1. 新建数据库 `nexus`
   ```bash
   CREATE DATABASE nexus DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```
2. 启动数据库，并导入 `sql` 文件夹下的全量 SQL 数据库文件：
   ```bash
   # 示例命令，请根据实际sql文件名调整
   mysql -u root -p nexus < sql/nexus.sql
   ```

#### 部分引入方式
按需引入对应模块的数据库表。

---

### 🏃 项目启动

**1. 启动并登录数据库**
```bash
# Windows 下启动 MySQL 服务
net start mysql

# 登录数据库（回车后输入密码）
mysql -u root -p
```

**2. 安装依赖与启动项目**
进入项目根目录，运行以下命令：
```bash
# 安装项目依赖
npm install

# 启动项目
node app
```

> 💡 **提示**：建议使用 `nodemon` 进行开发环境启动，以实现热更新：
```bash
# 全局安装 nodemon
npm install nodemon -g 

# 启动项目
nodemon app
```

---

### 🌐 接口信息

| 协议类型 | 端口号 | 说明         |
| :------- | :----- | :----------- |
| HTTP API | `3200` | 后台 RESTful 接口 |
| WebSocket| `3200` | WS 实时通信端口   |

---

### 🧮 SQL 操作记录

默认登陆密码：`123456`，可以自行修改。

更多表结构及字段说明，请参考 `sql` 文件夹下的 SQL 文件。

---

### 📌 状态码说明

| 状态码 | 含义                  | 说明                     |
| :----- | :-------------------- | :----------------------- |
| `200`  | OK                    | 请求成功                 |
| `401`  | Unauthorized          | 未经授权，需登录或Token失效 |
| `404`  | Not Found             | 请求的资源不存在           |
| `500`  | Internal Server Error | 服务器内部错误，操作失败   |

更多状态码说明，请参考 [HTTP 状态码文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

---

### 📁 项目目录结构

```text
ApiNodeExpress/
├── sql/            # 数据库 SQL 文件 - 和公共sql一致
├── routes/         # 路由与接口模块
├── config/         # 数据库及项目配置
├── app.js          # 项目入口文件
├── package.json    # 依赖管理文件
└── README.md       # 项目说明文档
```

---

### 🤝 参与贡献

1. 林太白