// 公共配置部分
const {
    apiip,
    apiport,
    dbhost,
    dbuser,
    dbpassword,
    dbdatabase,
    dbsuccess,
    nexuswelcome,
    dbfailed
} = require("./index");

// 创建数据库连接池 createPool（高并发方式
// 导入 mysql 数据库
const mysql2 = require('mysql2');
// 创建数据库连接池
const connectionPool = mysql2.createPool({
    host: dbhost, // 数据库主机地址，如果是本地数据库则使用localhost
    user: dbuser, // 数据库用户名
    password:dbpassword, // 数据库密码
    database: dbdatabase, // 要连接的数据库名
    multipleStatements: true, //  允许执行多条语句
    // connectionLimit:15,
});
// 监测数据库连接状态
connectionPool.getConnection((err, connection) => {
    if (err) {
        console.error(dbfailed, err);
    } else {
        console.log(`错误日志 %c${dbsuccess}`, 'color: skyblue; font-size: 30px;') 
    }
});

module.exports = connectionPool;




// // 创建数据库链接（非高并发的方式）
// const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host: 'localhost', // 数据库主机地址，如果是本地数据库则使用localhost
//     user: 'root', // 数据库用户名
//     password: 'xxxxx', // 数据库密码
//     database: 'nexus', // 要连接的数据库名
// });
// module.exports = connection;