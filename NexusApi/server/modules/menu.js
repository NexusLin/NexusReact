
const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法


// 旧版本st
 // 查询所有菜单
// app.get('/menus', (req, res) => {
//   const query = 'SELECT * FROM sys_menu';
//   connection.query(query, (error, results, fields) => {
//     if (error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.json(results);
//     }
//   });
// });

// {
//   "menu_id": "菜单ID，自增长的大整数类型",
//   "menu_name": "菜单名称，最大长度为50的字符串",
//   "parent_id": "父菜单ID，大整数类型，默认为0",
//   "order_num": "显示顺序，整数类型，默认为0",
//   "path": "路由地址，最大长度为200的字符串，默认为空字符串",
//   "component": "组件路径，最大长度为255的字符串，默认为NULL",
//   "query": "路由参数，最大长度为255的字符串，默认为NULL",
//   "is_frame": "是否为外链，整数类型，0表示是外链，1表示不是外链，默认为1",
//   "is_cache": "是否缓存，整数类型，0表示缓存，1表示不缓存，默认为0",
//   "menu_type": "菜单类型，字符类型，包括M（目录）、C（菜单）、F（按钮）",
//   "visible": "菜单状态，字符类型，0表示显示，1表示隐藏，默认为0",
//   "status": "菜单状态，字符类型，0表示正常，1表示停用，默认为0",
//   "perms": "权限标识，最大长度为100的字符串，默认为NULL",
//   "icon": "菜单图标，最大长度为100的字符串，默认为#",
//   "create_by": "创建者，最大长度为64的字符串，默认为空字符串",
//   "create_time": "创建时间，日期时间类型，默认为NULL",
//   "update_by": "更新者，最大长度为64的字符串，默认为空字符串",
//   "update_time": "更新时间，日期时间类型，默认为NULL",
//   "remark": "备注，最大长度为500的字符串，默认为空字符串"
// }


 
// router.get('/', (req, res) => {

//     console.log(req.query, 'req.query');
  
//     const { menu_name, parent_id,order_num, path,component, is_frame,beginTime,endTime,menu_type,visible,status,perms,icon,create_by,create_time,update_by,update_time,remark} = req.query;

//     let query = `SELECT * FROM sys_menu`;

//     // // 构建查询条件
//     const params = [];

//     // query = addCondition(query, params, 'dict_name', dict_name); // 字典名称
//     // query = addCondition(query, params, 'dict_type', dict_type);  // 字典类型
//     // query = addCondition(query, params, 'dict_label', dict_label); // 字典标签
//     // query = addCondition(query, params, 'status', status);  // 状态

//     // query = addDateRangeCondition(query, params, beginTime, endTime); //查询时间
//     // query = addPagination(query, params, pageNum, pageSize);  //分页条件

    
//     console.log(query,'query');
//     connectionPool.query(query,params,(error, results, fields) => {
//          if (error) {
//           res.send({
//               code: 500,
//               message:'查询失败！',
//           });
//           res.status(500).json({ error: error.message });
//         } else {
//           res.send({
//               code: 200,
//               data: results,
//               message:'查询成功！',
//           });
//         }
//     });
// });

// INSERT INTO `sys_menu` VALUES (1039, '操作查询', 500, 1, '#', '', '', 1, 0, 'F', '0', '0', 'monitor:operlog:query', '#', 'admin', '2024-05-28 13:43:38', '', NULL, '');

// // 新增接口  
// router.post('/', (req, res) => {
//   const { 
//     menu_name, parent_id,order_num, path,component, is_frame,menu_type,visible,status,perms,icon,create_by,create_time,update_by,
//      remark 
//  } = req.body;

// //  {
// //   menu_name: '1111',
// //   parent_id: '1',
// //   order_num: '11',
// //   path: '111',
// //   component: '111',
// //   is_frame: '1',
// //   beginTime: undefined,
// //   endTime: undefined,
// //   menu_type: 'F',
// //   visible: undefined,
// //   status: '1',
// //   perms: undefined,
// //   icon: '1',
// //   create_by: undefined,
// //   create_time: undefined,
// //   update_by: undefined,
// //   update_time: 2024-06-07T06:09:46.778Z,
// //   remark: undefined
// // }  


//   const newdictData = {
//      menu_name, parent_id,order_num, path,component, is_frame,menu_type,visible,status,perms,icon,create_by,create_time,update_by,
//      update_time: new Date(),remark
//   };
 
//   console.log(newdictData,'newdictData');
//   connectionPool.query('INSERT INTO sys_menu SET ?', newdictData, (error, results, fields) => {
//     if (error) {
//         res.send({
//             code: 500,
//             data: results,
//             message:'添加失败！'
//         });
//         return;
//     } else {
//         res.send({
//             code: 200,
//             data: results,
//             message:'添加成功！'
//         });
//     }
//   });
// });


// // 更新菜单
// app.put('/menus/:id', (req, res) => {
//   const menuId = req.params.id;
//   const updatedMenu = req.body;
//   const query = 'UPDATE sys_menu SET ? WHERE menu_id = ?';
//   connection.query(query, [updatedMenu, menuId], (error, results, fields) => {
//     if (error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.json({ message: 'Menu updated successfully' });
//     }
//   });
// });


// 更新接口
// router.put('/', (req, res) => {
//     console.log(req,'req');
//   const { dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, update_by, remark,menu_id} = req.body;
//   const updateddictData = {
//     dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, update_by, remark
//   };
  
//   connectionPool.query('UPDATE sys_menu SET ? WHERE menu_id = ?', [updateddictData, menu_id], (error, results, fields) => {
//     if (error) {
//         res.send({
//             code: 500,
//             data: results,
//             message:'修改失败！'
//         });
//         return;
//     } else {
//         res.send({
//             code: 200,
//             data: results,
//             message:'修改成功！'
//         });
//     }
//   });
// });
 
//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
    console.log(req.params,'req.params');
    console.log(req.body,'req.body');
    const menu_id = parseInt(req.params.id);
    const status = req.body.state;

    const query = 'UPDATE sys_menu SET status = ? WHERE menu_id = ?';
    connectionPool.query(query, [status, menu_id], (error, results, fields) => {
        if (error) {
            console.log(err,'err');
            console.log(results,'results');
            res.status(500).json({ error: 'Internal server error' });
            return;
        } else {
             res.json({
                code: 200,
                data: results,
            });
        }
    });
});

// 旧版end


// 新版start

// menu_name, parent_id,order_num, path,component, is_frame,beginTime,endTime,menu_type,visible,status,perms,icon,create_by,create_time,update_by,update_time,remark
// console.log(req.query, 'req.query');
// console.log(req.body,'req.body');
// console.log(req.params,'req.params');


// 查询列表
router.get('/',(req, res) => {
    let query = `SELECT * FROM sys_menu`;
    let sqltotal = `SELECT COUNT(*) AS total FROM sys_menu`
    const { menu_name } = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{menu_name});
});

// menu_name, 
// parent_id,order_num, 
// path,component, 
// is_frame,menu_type,visible,
// status,
// perms,
// icon,
// create_by,
// create_time,
// update_by,
// remark 

// 新增 POST
router.post('/', (req, res) => {
    const insertSql = 'INSERT INTO sys_menu SET ?';
    const { menu_name, parent_id,order_num, path,component, is_frame,menu_type,visible,status,perms,icon,create_by,create_time,update_by,remark} = convertKeysToSnakeCase(req.body);
    const postData = {menu_name, parent_id,order_num, path,component, is_frame,menu_type,visible,status,perms,icon,create_by,create_time,update_by,remark,update_time:new Date()};
    addApi(insertSql,res,postData);
});
// 更新
router.put('/', (req, res) => {
    const { menu_name, parent_id,order_num, path,component, is_frame,menu_type,visible,status,perms,icon,create_by,create_time,update_by,remark,menu_id} = convertKeysToSnakeCase(req.body);
    const updatevalues = {menu_name, parent_id,order_num, path,component, is_frame,menu_type,visible,status,perms,icon,create_by,create_time,update_by,remark,update_time:new Date()};
    let updateSql='UPDATE sys_menu SET ? WHERE menu_id = ?';
    updateApi(updateSql,[updatevalues, menu_id],res);
});

// 获取详情 
router.get('/:menu_id', (req, res) => {
    // console.log(req.query,'req.query');
    const { menu_id } = req.params;
    const values = [menu_id];
    let querySql = 'SELECT * FROM sys_menu WHERE menu_id = ?';
    getApi(querySql,values,res);
});

// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    const delsql = "DELETE FROM sys_menu WHERE menu_id = ?";
    delApi(delsql,[id],res);
});
//新版end
module.exports = router;




// // 查询数据
// function getAllRoles() {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM sys_menu', (error, results) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// }


// // 更新数据
// function updateRole(roleId, roleData) {
//     return new Promise((resolve, reject) => {
//         pool.query('UPDATE sys_menu SET ? WHERE menu_id = ?', [roleData, roleId], (error, results) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// }

// // 删除数据
// function deleteRole(roleId) {
//     return new Promise((resolve, reject) => {
//         pool.query('DELETE FROM sys_menu WHERE menu_id = ?', roleId, (error, results) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// }

// // 示例用法
// async function exampleUsage() {
//     try {
//         // 查询数据
//         const roles = await getAllRoles();
//         console.log('All Roles:', roles);
//         // 插入数据
//         const newRole = { role_name: '新角色', role_key: 'new_role', role_sort: 3, status: '0', create_by: 'admin', create_time: new Date(), remark: '这是一个新角色' };
//         const insertResult = await addRole(newRole);
//         console.log('Inserted Role:', insertResult);

//         // 更新数据
//         const updatedRoleData = { role_name: '修改后的角色名称', update_by: 'admin', update_time: new Date() };
//         const updateResult = await updateRole(3, updatedRoleData); // 假设要更新ID为3的角色
//         console.log('Updated Role:', updateResult);

//         // 删除数据
//         const deleteResult = await deleteRole(3); // 假设要删除ID为3的角色
//         console.log('Deleted Role:', deleteResult);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// // 执行示例用法
// exampleUsage();
