
const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法

// 旧版本st
// router.get('/', (req, res) => {

//     console.log(req.query, 'req.query');
  
//     const { dict_name, dict_type,dict_label, status,pageNum, pageSize,beginTime,endTime} = req.query;

//     let query = `SELECT * FROM sys_role`;

//     // 构建查询条件
//     const params = [];

//     query = addCondition(query, params, 'dict_name', dict_name); // 字典名称
//     query = addCondition(query, params, 'dict_type', dict_type);  // 字典类型
//     query = addCondition(query, params, 'dict_label', dict_label); // 字典标签
//     query = addCondition(query, params, 'status', status);  // 状态

//     query = addDateRangeCondition(query, params, beginTime, endTime); //查询时间
//     query = addPagination(query, params, pageNum, pageSize);  //分页条件

    
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




// 获取详情 
// router.get('/:id', (req, res) => {
//     // console.log(req.query,'req.query');
//     console.log(req,'req');
//     const { id } = req.params;
//     const values = [id];
//     let query = 'SELECT * FROM  sys_role WHERE role_id = ?';
//     connectionPool.query(query, values, (err, results) => {
//         // console.log(err,'err');
//         if (err) {
//             console.error('Error querying database:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         }
//         res.json({
//             code: 200,
//             data: results ? results[0] : {},
//         });
//     });
// }); 
// // 新增接口 dictData
// router.post('/', (req, res) => {
//   const { role_name, role_key, role_sort, status, create_by, create_time, remark } = req.body;
//   const newdictData = {
//    role_name, role_key, role_sort, status, create_by, create_time: new Date(), remark
//   };
//   console.log(newdictData,'newdictData');
//   connectionPool.query('INSERT INTO sys_role SET ?', newdictData, (error, results, fields) => {
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

// // 更新接口
// router.put('/', (req, res) => {
//     console.log(req,'req');
//   const { dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, update_by, remark,dict_code} = req.body;
//   const updateddictData = {
//     dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, update_by, remark
//   };
  
//   connectionPool.query('UPDATE sys_role SET ? WHERE dict_code = ?', [updateddictData, dict_code], (error, results, fields) => {
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

// // 删除用户数据 DELETE请求处理程序  
// router.delete('/:id', (req, res) => {
//     // const {id} = req.body; // 从请求体中获取数据
//     const id = req.params.id;
//     const values = [id];
//     const sql = "DELETE FROM sys_role WHERE role_id = ?";
//     connectionPool.query(sql, values, (err, results) => {
//         // console.log(err,'err');
//         // console.log(results,'results');
//         if (err) {
//             console.error('Error querying database:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         }
//         res.json({
//             code: 200,
//             data: results,
//             message:'用户删除成功！',
//         });
//     });
// });

//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
    console.log(req.params,'req.params');
    console.log(req.body,'req.body');
    const dict_code = parseInt(req.params.id);
    const status = req.body.state;

    const query = 'UPDATE sys_role SET status = ? WHERE dict_code = ?';
    connectionPool.query(query, [status, dict_code], (error, results, fields) => {
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
// 旧版本end

// 新版本st

// 查询接口
router.get('/',(req, res) => {
    // 查询数据库列表
    let query = `SELECT * FROM sys_role`;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM sys_role`
     // 查询数据库并返回数据

    const { role_name, role_Key,dict_label, status,pageNum, pageSize,beginTime,endTime,page_num, page_size} = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{role_name, role_Key,status,dict_label, pageNum, pageSize,beginTime,endTime,page_num, page_size});
});
// 新增  POST
router.post('/', (req, res) => {
    const insertSql = 'INSERT INTO sys_role SET ?';
    const { role_name, role_key, role_sort, status, create_by, create_time, remark} = convertKeysToSnakeCase(req.body);
    const postData = {role_name, role_key, role_sort, status, create_by, create_time, remark};
    addApi(insertSql,res,postData);
});
// 获取详情 3
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const values = [id];
    let querySql = 'SELECT * FROM sys_role WHERE role_id = ?';
    getApi(querySql,values,res);
});

// 更新接口 
router.put('/', (req, res) => {
    // console.log(req,'req');
    const {role_name, role_key, role_sort, status, create_by, create_time, remark,role_id} = convertKeysToSnakeCase(req.body);
    const updatevalues = {role_name, role_key, role_sort, status, create_by, create_time, remark,role_id};
    let updateSql='UPDATE sys_role SET ? WHERE role_id = ?';
    updateApi(updateSql,[updatevalues, role_id],res);
});
// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    const delsql = "DELETE FROM sys_role WHERE role_id = ?";
    delApi(delsql,[id],res);
});
// 新版本end
module.exports = router;













































 

// // 查询数据
// function getAllRoles() {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM sys_role', (error, results) => {
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
//         pool.query('UPDATE sys_role SET ? WHERE role_id = ?', [roleData, roleId], (error, results) => {
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
//         pool.query('DELETE FROM sys_role WHERE role_id = ?', roleId, (error, results) => {
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
