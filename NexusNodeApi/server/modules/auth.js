// 使用token来获取路由部分

const express = require('express');
const router = express.Router();

const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const { addCondition, addDateRangeCondition, addPagination, convertKeysToSnakeCase, convertToCamelCase } = require('../../hooks/methods.js'); // 引入封装方法

// 引入菜单封装方法
const {buildMenuTree} = require('../../hooks/buildMenuTree'); 

// 引入信息提示
const { message } = require('../../utils/resmsg.js'); 

// 引入密钥
const { SECRET_KEY} = require("../../config/index");

const jwt = require("jsonwebtoken"); //导入jsonwebtoken生成 jwt 字符串的包

// Token拿取用户的信息
const authenticateToken = (req, res, next) => {
  // 获取 Authorization 头部
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 获取 Bearer 后的 token
  if (!token) {
    return res.status(401).json({ message: 'Token信息缺失' });
  }
  // 验证 JWT Token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '无效Token' });
    }
    req.user = user; // 将用户信息存入请求对象
    next(); // 继续处理请求
  });
};


//获取用户信息时，要使用 req.auth.username 获取用户名
router.get('/', authenticateToken,(req, res) => {
    // console.log(req,'req');
    // console.log(res,'res');
    // console.log(req.auth.username,'req.auth.username');
    // console.log('req,=============================');
    console.log(req.user,'req.auth');
    if(req.user.userId){
        // 根据用户ID查询角色ID
        const roleQuery = `
          SELECT role_id
          FROM sys_user_role
          WHERE user_id = ?
        `;
        connectionPool.query(roleQuery, [req.user.userId], (err, roleResults) => {
          if(roleResults.length>0){
            console.log(roleResults[0].role_id,'roleResults');  
            // 根据角色ID查询菜单ID
            const menuQuery = `
              SELECT menu_id
              FROM sys_role_menu
              WHERE role_id IN (?)
            `;
             connectionPool.query(menuQuery, [roleResults[0].role_id], (err, menuResults) => {
                console.log(menuResults.length, 'menuResults');
                const menuALL = `
                  SELECT *
                  FROM sys_menu
                `;
                connectionPool.query(menuALL, (err, menuAllResults) => {
                    console.log(menuAllResults, 'menuAllResults');
                    const result = menuResults.map(itemA => {
                      return menuAllResults.find(itemB => itemB.menu_id === itemA.menu_id);
                    });
                    console.log(result.length,'result ===menuAllResults ');
                    res.send({
                        code: 200,
                        data:buildMenuTree(result), // 返回菜单信息
                        result:result,
                        msg: '查询成功!',
                    });
                })   
             })
          }
        })
    }
})

module.exports = router;