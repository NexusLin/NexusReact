// ==================== 当前环境 ====================
// 本地开发使用 'local'，线上部署改为 'production'
const activeEnv = 'local';

// ==================== 本地开发配置 ====================
// 当前 activeEnv 为 'local' 时，直接修改这里即可
const config = activeEnv === 'production'
    ? require('./production')
    : require('./local');

// 兼容旧代码
config.apiip = config.server.ip;
config.apiport = config.server.port;
config.apiprefix = config.server.prefix;
config.dbhost = config.database.host;
config.dbuser = config.database.user;
config.dbpassword = config.database.password;
config.dbdatabase = config.database.database;
config.dbsuccess = config.messages.dbSuccess;
config.dbfailed = config.messages.dbFailed;
config.nexuswelcome = config.messages.nexusWelcome;
config.author = config.server.author;
config.version = config.server.version;

module.exports = config;
