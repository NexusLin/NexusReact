module.exports = {
    environment: 'production',
    server: {
        ip: 'xxxxxx',
        port: 3200,
        prefix: 'api',
        version: 'V0.0.1',
        author: '林太白'
    },
    database: {
        host: 'xxxx',
        database: 'xxxx',
        user: 'xxxx',
        password: 'xxxxx'
    },
    security: {
        secretKey: 'xxxxxx'
    },
    messages: {
        dbSuccess: '数据库连接成功😊,我是林太白',
        dbFailed: '数据库连接失败😢:林太白',
        nexusWelcome: '热烈欢迎你访问Node后端服务器😊,我是林太白'
    }
};
