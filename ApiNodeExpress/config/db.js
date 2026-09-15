// 公共配置部分
const config = require("./index");
const { database, messages } = config;

const {
    host: dbhost,
    user: dbuser,
    password: dbpassword,
    database: dbdatabase
} = database;

// 创建数据库连接池 createPool（高并发方式
// 导入 mysql 数据库
const mysql2 = require('mysql2');
// 创建数据库连接池
const connectionPool = mysql2.createPool({
    host: dbhost,
    user: dbuser,
    password: dbpassword,
    database: dbdatabase,
    multipleStatements: true,
});

// 监测数据库连接状态
connectionPool.getConnection((err, connection) => {
    if (err) {
        console.error(messages.dbFailed, err);
    } else {
        console.log(`错误日志 %c${messages.dbSuccess}`, 'color: skyblue; font-size: 30px;');
        connection.release();
    }
});

module.exports = connectionPool;

// 创建数据库链接（非高并发的方式）
// const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host: 'localhost', // 数据库主机地址，如果是本地数据库则使用localhost
//     user: 'xxx', // 数据库用户名
//     password: 'xxxxx', // 数据库密码
//     database: 'xxxx', // 要连接的数据库名
// });
// module.exports = connection;