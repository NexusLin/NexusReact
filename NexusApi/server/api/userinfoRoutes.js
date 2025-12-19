const express = require('express');
const router = express.Router();

const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const { addCondition, addDateRangeCondition, addPagination, convertKeysToSnakeCase, convertToCamelCase } = require('../../hooks/methods.js'); // 引入封装方法


// 引入信息提示
const { message } = require('../../utils/resmsg.js');

//获取用户信息时，要使用 req.auth.username 获取用户名
router.get('/', (req, res) => {
    // console.log(req,'req');
    // console.log(res,'res');
    // console.log(req.auth.username,'req.auth.username');
    
    if (!req.auth || !req.auth.username) {
        return res.status(401).send({
            code: 401,
            msg: '未认证用户或缺少用户名！',
        });
    }
    // console.log(req.auth.username, '请求人员');
    const values = [req.auth.username];
    let query = 'SELECT * FROM sys_user WHERE username = ?';
    // console.log('查询语句', query);

    connectionPool.query(query, [req.auth.username], (err, results) => {
        // console.log(results,'results 用户信息');
        if (err) {
            // console.log(err, 'err--userinfo');
            // console.error('Error querying database:', err);
            return res.status(500).send({
                code: 500,
                msg: '数据库查询错误！',
            });
        }
        if (results.length === 0) {
            return res.status(404).send({
                code: 404,
                msg: '用户不存在！',
            });
        }

        let queryuserid = results[0].user_id;
       
        // 查询角色
        let userroles = ["common"]; //普通角色
        let permissions = []; //无权限
        let permissionsMax= ["*:*:*"]; //最高权限
        let role_id=null;

        let msg = '欢迎你的访问！';
        let msgtype = 'success'; //'warning';


        // 根据用户ID查询角色ID
        const roleQuery = `
          SELECT role_id
          FROM sys_user_role
          WHERE user_id = ?
        `;
        connectionPool.query(roleQuery, [queryuserid], (err, roleResults) => {
            // console.log(roleResults[0].role_id,'roleResults');

            console.log(roleResults,'roleResults');

            role_id = roleResults[0]?.role_id || '2';
            // console.log(role_id,'role_id')

            // 根据角色ID查询菜单ID
            const menuQuery = `
              SELECT menu_id
              FROM sys_role_menu
              WHERE role_id IN (?)
            `;

            connectionPool.query(menuQuery, [role_id], (err, menuResults) => {
                // console.log(menuResults, 'menuResults');
                const menuIds = menuResults.map(result => result.menu_id);
                // console.log(menuIds, 'menuIds');

                // 第三步：根据菜单ID查询权限标识
                const permsQuery = `
                  SELECT perms
                  FROM sys_menu
                  WHERE menu_id IN (?)
                `;
                connectionPool.query(permsQuery, [menuIds], (err, permsResults) => {
                  // console.log(permsResults, 'permsResults');

                  // console.log(permissions, 'permissions');
                   //根据角色ID查询菜单ID
                    let queryrole = `
                        SELECT role_key
                        FROM sys_role
                        WHERE role_id = ?
                    `;
                    connectionPool.query(queryrole, [role_id], (err, roleresult) => {
                        // console.log(roleresult,'roleresult');
                        if (roleresult.length === 0) {
                            msg = '用户角色不完整,请尽快完善！';
                            msgtype = 'warning';
                        } else {
                            userroles = [];
                            userroles.push(roleresult[0].role_key);
                        }
                    })

                    console.log(userroles,'userroles');
                    console.log(permissions,'permissions');

                    res.send({
                        code: 200,
                        data: results[0] ? convertToCamelCase(results[0]) : [], // 返回用户信息
                        msg: msg,
                        msgtype,
                        roles: userroles,
                        permissions:permsResults.map(result => result.perms).filter(perm => perm !== ''),
                        isDefaultModifyPwd: false,
                        isPasswordExpired: false,
                    });
                  })
                })
            })

         


        // 查询用户角色
        // SQL 查询，获取用户角色的 role_key




        // let queryrole = `
        //   SELECT r.role_key
        //   FROM sys_user_role ur
        //   JOIN sys_role r ON ur.role_id = r.role_id
        //   WHERE ur.user_id = ?
        // `;
        // let msg = '欢迎你的访问！';
        // let msgtype = 'success'; //'warning';
        // let queryroleuserid = results[0].user_id;


        // connectionPool.query(queryrole, [queryroleuserid], (err, roleresult) => {
        //     // console.log(roleresult,'roleresult');
        //     if (roleresult.length === 0) {
        //         msg = '用户角色不完整,请尽快完善！';
        //         msgtype = 'warning';
        //     } else {
        //         userroles = [];
        //         userroles.push(roleresult[0].role_key);
        //     }


        //     res.send({
        //         code: 200,
        //         data: results[0] ? convertToCamelCase(results[0]) : [], // 返回用户信息
        //         msg: msg,
        //         msgtype,
        //         roles: userroles,
        //         permissions,
        //         isDefaultModifyPwd: false,
        //         isPasswordExpired: false,
        //     });
        // })


        



    });
})

module.exports = router;