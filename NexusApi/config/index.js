// 公共配置部分
// Nexusapi服务器端-Mysql--createPool高并发方式
const apiip='localhost'; // 本地 localhost
const apiport='3200'; // Node-api端口号
const apiprefix='api'; // api前缀

// 数据库信息
const author='林太白'; //作者信息

// 本地数据库信息
const dbhost='localhost'; // 数据库主机地址，如果是本地数据库则使用localhost
const dbdatabase='nexus'; // 数据库名称
const dbuser='root'; // 数据库用户名
const dbpassword='123456'; // 数据库密码


const dbsuccess='数据库连接成功😊,我是author'; //数据库连接成功语句 
const dbfailed='数据库连接失败😢:author'; //数据库连接失败语句 
const nexuswelcome='我是author，欢迎你连接我的Node后端服务器'; //连接成功Nexusapi服务器端语句
const version='V0.0.1'; //版本号

const SECRET_KEY = 'lintaibai^_^' // 自定义密钥部分

// 输出版本号
const versionhello=(title,version) =>{
  // console.log(
  //     `%c ${title} %c ${version} `,
  //     'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;',
  //     'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;',
  // );
    const style1 = '\x1b[38;2;255;255;255m\x1b[48;2;143;65;233m\x1b[1m'; // 白色文字，灰色背景，加粗
    const style2 = '\x1b[37m\x1b[48;5;40m\x1b[1m'; // 白色文字，绿色背景，加粗
    const reset = '\x1b[0m';
    console.log(
      `${style1} ${title} ${reset}${style2} ${version} ${reset}`
    );
}

// 导出模块
module.exports = {
    apiip,
    apiport,
    dbhost,
    dbuser,
    dbpassword,
    dbdatabase,
    dbsuccess,
    dbfailed,
    nexuswelcome,
    apiprefix,
    author,
    version,
    versionhello,
    SECRET_KEY
};