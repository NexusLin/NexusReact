

const express = require("express"); //引入express api模块

const cors = require("cors"); // 导入 cors跨域
const bodyParser = require("body-parser"); //引入解析POST请求数据模块


//身份认证部分包
const jwt = require("jsonwebtoken"); //导入jsonwebtoken生成 jwt 字符串的包
const expressJWT = require("express-jwt"); //导入将客户端发送过来的 JWT 字符串，解析还原成 JSON 对象的包


const fileURLToPath = require("url"); // 将文件 URL 转换为本地文件系统路径
const path = require('path'); // 将文件 URL 转换为本地文件系统路径


const { dirname, join } = require("path");
const fs = require("fs"); //文件处理模块

// 公共配置部分
// 参数： apiprefix接口前缀，apiip接口ip，apiport接口端口，数据库连接欢迎语
const { apiip,apiport,nexuswelcome,apiprefix,author,version,versionhello,SECRET_KEY} = require("./config/index");


// 密码安全长度
const {PASSWORD_SECURITY_LENGTH} = require("./config/websetting");


versionhello('版本号nexus',version);// 输出版本号
console.log(`%c${nexuswelcome}`, 'color: #9180ff; font-size: 20px;')

 
// 引入数据库连接池模块
const connectionPool = require('./config/db');

// 引入用户路由模块
const userRoutes = require(`./server/api/userRoutes`);

// 引入动态路由数据模块
const routerRoutes = require(`./server/modules/auth`);

// 引入token数据模块
const userinfoRoutes = require(`./server/api/userinfoRoutes`);


// 引入字典值模块
const dictTypeRoutes = require(`./server/api/dictTypeRoutes`);


// 引入字典数据模块
const dictDataRoutes = require(`./server/api/dictDataRoutes`);


// 引入角色数据模块
const roleRoutes = require(`./server/api/roleRoutes`);

// 引入菜单数据模块
const menuRoutes = require(`./server/modules/menu`);





// 引入文章模块
const articleRoutes = require(`./server/api/articleRoutes`);

//引入层级路由
const deptRoutes = require('./server/api/deptRoutes');


// 引入开放接口数据模块
const openRoutes = require(`./server/api/openRoutes`);


// 用户反馈部分
const feedbackRoutes = require(`./server/api/feedbackRoutes`);

//引入帮助中心路由
const helpRoutes = require(`./server/api/helpRoutes`);


//引入通知公告路由
const noticeRoutes = require('./server/api/noticeRoutes');


//引入活动信息路由
const activitiesRoutes = require('./server/api/activitiesRoutes');


//引入申请信息路由
const applicationsRoutes = require('./server/api/applicationsRoutes');


//引入评论文章模块
const commentsRoutes = require('./server/api/commentsRoutes');

//引入商品模块
const productsRoutes = require('./server/api/productRoutes');

//引入购物车模块
const cartitemsRoutes = require('./server/api/cartitemsRoutes');

//引入聊天信息路由
const chatRoutes = require('./server/api/chatRoutes');

//引入上传路由
const uploadRoutes = require('./server/api/uploadRoutes');



//引入ws部分
const {initWs} = require('./server/ws/websocketserver');


//引入ws部分
const {initWsChat} = require('./server/ws/websocketchat');


const app = express();

// app.options('*', cors()); // 这将在所有路由上启用 CORS 的预检请求处理

app.use(cors());
app.use(bodyParser.json()); //配置解析，用于解析json和urlencoded格式的数据
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // 中间件，用于解析 POST 请求体中的 JSON 数据

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


// 定义token认证授权中间件
const authorize = (req, res, next) => {
    // 在这里进行授权逻辑判断
    // 如果需要授权，可以执行相关操作
    // 如果不需要授权，可以调用next()继续执行下一个中间件或路由处理程序
    next();
};

// 定义token认证授权中间件
const unauthorize = (req, res, next) => {
    // 在这里进行授权逻辑判断
    // 如果需要授权，可以执行相关操作
    // 如果不需要授权，可以调用next()继续执行下一个中间件或路由处理程序
    next();
};

// 使用用户路由
app.use(`/${apiprefix}/system/users`, userRoutes);

// 使用文章接口
app.use(`/${apiprefix}/articles`, articleRoutes);


// 使用字典值类型接口
app.use(`/${apiprefix}/system/dictType`, dictTypeRoutes);


// 使用字典数据接口
app.use(`/${apiprefix}/system/dictData`, dictDataRoutes);


// 使用字典数据接口
app.use(`/${apiprefix}/system/roles`, roleRoutes);


// 使用菜单数据接口
app.use(`/${apiprefix}/system/menus`, menuRoutes);

// 使用动态路由接口
app.use(`/${apiprefix}/getRouters`, routerRoutes);

// 层级管理路由
app.use(`/${apiprefix}/system/depts`, deptRoutes);


// 使用开放数据接口
app.use(`/${apiprefix}/open`, openRoutes);


// 用户反馈接口
app.use(`/${apiprefix}/feedback`, feedbackRoutes);
app.use(`/${apiprefix}/feedbacks`, feedbackRoutes);

// 帮助中心路由
app.use(`/${apiprefix}/help`, helpRoutes);
app.use(`/${apiprefix}/helps`, helpRoutes);

// 公告中心路由
app.use(`/${apiprefix}/system/notices`, noticeRoutes);


//活动信息路由
app.use(`/${apiprefix}/activities`, activitiesRoutes);


//申请信息路由
app.use(`/${apiprefix}/applications`, applicationsRoutes);


// 评论模块
app.use(`/${apiprefix}/system/comments`, commentsRoutes);


// 商品模块
app.use(`/${apiprefix}/products`, productsRoutes);

// 购物车模块
app.use(`/${apiprefix}/cartitems`, cartitemsRoutes);


// 上传路由
app.use(uploadRoutes);


// 聊天
app.use(`/${apiprefix}/system/chat`, chatRoutes);


// token认证
// 使用中间件expressjwt解析token  // 使用何种加密算法解析
app.use(
    expressJWT.expressjwt({
        secret: SECRET_KEY, // 设置密钥
        algorithms: ["HS256"]
    }).unless({
        // path: [/^\/api\//],
        path: [
            '/',
            `/${apiprefix}/login`,
            `/${apiprefix}/register`,
            `/${apiprefix}/resetPwd`,
            `/${apiprefix}/upload/image`,
            `/${apiprefix}/upload/file`,
            `/${apiprefix}/upload/video`,
            `/${apiprefix}/uploadImage:id`,
            `/${apiprefix}/uploadImage`,
            `/${apiprefix}/uploads`,
            '/src/assets/images', // 静态资源路径不需要认证
            '/src/assets/images/*', // 允许访问任何位于 `/src/assets/images/` 目录下的静态文件
            '/uploads',        // 排除/uploads路径
            '/uploads/*'      // 排除/uploads目录下所有文件
        ],
        // 3 排除post以外的，因为请求路径其实是get
        custom: (req) => {
            // 排除接口
            if (req.originalUrl.startsWith('/api/open')) { 
                console.log(req.originalUrl,'req.originalUrl----开放接口');
                return true 
            } // open开放接口

            if (req.method !== 'POST' && req.originalUrl.includes('/upload')) { return true } //上传文件接口
            return false;
        }
    })
);


// 加密密码
const bcrypt = require('bcrypt');

// 用户登录接口
app.post(`/${apiprefix}/login`, (req, res) => {
    const { username, password } = req.body;
    // if (req.body.username == 'admin' && req.body.password == '123456') {}
    let sql = 'SELECT * FROM sys_user WHERE username = ?';
    console.log(sql, '查询语句');
    // 查询数据库中是否存在匹配的用户名
    connectionPool.query(sql, [username], (error, results) => {
        console.log(results, 'results');
        if (error) throw error;
        // 检查查询结果是否为空
        if (results.length === 0) {
            res.send({
                code: 401,
                msg: '用户名不存在',
            })
            return
        }
        console.log(results[0].password, 'results-password');
        console.log('password', password);

        const isValidPassword = bcrypt.compare(password, results[0].password);

        // const user = results[0];
        if (isValidPassword) {
            var tokenStr = jwt.sign(
                { 
                    username: req.body.username,
                    userId:results[0].user_id,
                }, 
                SECRET_KEY, 
                { expiresIn: '24h'}
            );
            console.log('登录成功');
            res.send({
                code: 200,
                msg: '登录成功',
                token: tokenStr,
            })
        } else {
            console.log('登录失败');
            res.send({
                code: 500,
                msg: '用户名或密码错误！',
            })
        }

    });
});






// 用户注册接口
app.post(`/${apiprefix}/register`, (req, res) => {

    console.log(req.body, 'req');
    const { username, password } = req.body;

    let sql = 'SELECT * FROM sys_user WHERE username = ?';
    // 查询数据库中是否存在匹配的用户名
    connectionPool.query(sql, [username], (error, results) => {
        console.log(results,'查询结果！');

        if (error) throw error;
        // 检查查询结果是否为空
        if (results.length !== 0) {
            res.json({
                code: 401,
                data: results,
                message: '用户名已经存在！'
            });
        } else {
            const name = username;

            // 加密密码
            const hashed_pwd = bcrypt.hash(password, PASSWORD_SECURITY_LENGTH);

            const values = [name, username, hashed_pwd];

            // 准备 SQL 插入语句
            const insertSql = `INSERT INTO sys_user (name,username, password,state) VALUES (?,?,?,0)`;
            connectionPool.query(insertSql, values, (err, results) => {
                console.log(results, 'results-插入结果！');
                if (err) {
                    console.error('Error querying database:', err);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
                res.json({
                    code: 200,
                    data: results,
                    message: '用户注册成功，欢迎你去登陆！'
                });
            });
        }
    });
});


app.use(`/${apiprefix}/getInfo`, userinfoRoutes); // 获取用户信息



// 错误中间件❌ 
// 接口错误的封装---拦截部分
app.use((err, req, res, next) => {
    // 如果错误是由token解析失败导致的
    if (err.name === 'UnauthorizedError') {
        return res.send({
            code: 401,
            msg: '登录过期，请重新登录！'
        })
    }
    console.log('其他原因导致的错误!', err);
    // 如果是其他位置原因导致的错误
    res.send({
        code: 500,
        message: '服务器错误！'
    })
    next()
})


app.listen(apiport,apiip,() => {
    console.log(`Server is running on http://${apiip}:${apiport}`);
});


// 开始链接接口
app.get('/', (req, res) => {
    res.send('Welcome to the NexusApi database,Perseverance will eventually lead to success!@Copyright'+author);
});

app.post('/', function(req, res) {
    res.send('你已进入监管，不允许随意入侵！')
})

app.put('/', function(req, res) {
    res.send('你已进入监管，不允许随意入侵！')
})

app.delete('/', function(req, res) {
   res.send('你已进入监管，不允许随意入侵！')
})



//ws部分  初始化ws日志
initWs();



//ws部分 初始化ws聊天信息
initWsChat();








