const express = require('express');
const router = express.Router();

const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法

// 新增用户 POST 请求处理程序 
// router.post('/', (req, res) => {
//     console.log(req.body);
//     const { username,password,avatar} = req.body; // 从请求体中获取数据
//     const values = [username,password,avatar];
//     // 准备 SQL 插入语句

//     const insertSql =`INSERT INTO user () VALUES (?, ?, ?)`;

//     connectionPool.query(insertSql, values, (err, results) => {
//         console.log(err,'err');
//         console.log(results,'results');
//          if (err) {
//             res.send({
//                 code: 500,
//                 data: results,
//                 message:'添加失败！'
//             });
//             return;
//         } else {
//             res.send({
//                 code: 200,
//                 // data: results,
//                 message:'添加成功！'
//             });
//         }
//     });
// });



// // 获取用户列表
// router.get('/', (req, res) => {
   
//     const { name, age, sex, pageNum, pageSize } = req.query;

//     let query = `SELECT * FROM sys_user`;

//     // 构建查询条件
//     const params = [];

//     query = addCondition(query, params, 'name', name); 
//     query = addCondition(query, params, 'age', age); 
//     query = addPagination(query, params, pageNum, pageSize);  //分页条件
//     console.log(query,'query');

//     // 查询数据库并返回数据
//     connectionPool.query(query,params, (err, results) => {
//         // console.log(err,'err');
//         // console.log(results,'results');
//         if (err) {
//             console.error('Error querying database:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         } else {

//             if(results.length>0){
//                      let sqltotal = `SELECT COUNT(*) AS total FROM sys_user;`
//                     // 查询数据库并返回数据
//                     connectionPool.query(sqltotal, (errtotal, rows) => {
//                         let total = rows[0]['total'];
//                         if (errtotal) {
//                             console.error('Error querying database:', err);
//                             res.status(500).json({ error: 'Internal server error' });
//                             return;
//                         } else {
//                             res.send({
//                                 total: total,
//                                 code: 200,
//                                 data: results,
//                                 message:'查询成功！',
//                             });
//                         }
//                     });
//             }else{
//                  res.send({
//                     total: 0,
//                     code: 200,
//                     data: [],
//                     message:'查询成功！',
//                 });
//             }
//         }
//     });
// });



// // 获取用户列表
// router.get('/', (req, res) => {
//     // console.log(req,'req');
//     console.log(req.query, 'req.query');
//     // console.log(req.body,'req.body');
//     // console.log(req.params,'req.params');
//     // const values =[name, age,sex,pageNum,pageSize];
//     const {  } = req.query;

//     let query = `SELECT * FROM sys_user`;

//     // 构建查询条件
//     const params = [];

//     // 姓名 
//     if (name !== undefined && name !== '' && name !== null) {
//         query += ' WHERE name = ?';
//         params.push(name);
//     }
//     // 年龄
//     if (age !== undefined && age !== '' && age !== null) {
//         query += params.length ? ' AND' : ' WHERE';
//         query += ' age = ?';
//         params.push(age);
//     }

//     if (pageNum !== undefined && pageSize !== '' && pageSize !== null) {
//         query += ' LIMIT ?, ?';
//         let offset = (pageNum - 1) * pageSize;
//         params.push(offset);

//         params.push(parseInt(pageSize));
//     }
    
    
//     console.log('查询条件', query, params);
//     // 查询数据库并返回数据
//     connectionPool.query(query, params, (err, results) => {
//         // console.log(err,'err');
//         // console.log(results,'results');

//         if (err) {
//             console.error('Error querying database:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         } else {
//             let sqltotal = `SELECT COUNT(*) AS total FROM sys_user;`
//             // 查询数据库并返回数据
//             connectionPool.query(sqltotal, (errtotal, rows) => {
//                 let total = rows[0]['total'];
//                 if (err) {
//                     console.error('Error querying database:', err);
//                     res.status(500).json({ error: 'Internal server error' });
//                     return;
//                 } else {
//                     res.json({
//                         total: total,
//                         code: 200,
//                         data: results,
//                     });
//                 }
//             });
//         }
//     });
// });

// 查询列表
router.get('/',(req, res) => {
    // console.log(req.query, 'req.query');
    // console.log(req.body,'req.body');
    // console.log(req.params,'req.params');
    // 查询数据库列表
    let querySql = `SELECT * FROM sys_user`;
    // 查询数据库总数
    let querysqltotal = `SELECT COUNT(*) AS total FROM sys_user`
     // 查询数据库并返回数据
    const { name, age, sex, user_height,user_weight,phone,page_num, page_size } = convertKeysToSnakeCase(req.query);
    listApi(querySql,querysqltotal,req,res,{ name, age, sex, user_height,user_weight,phone,page_num, page_size});
});


// 获取详情 3
router.get('/:id', (req, res) => {
    console.log(req.params,'req.params');
    const { id } = req.params;
    const values = [id];
    let querySql = 'SELECT * FROM sys_user WHERE user_id = ?';
    getApi(querySql,values,res);
}); 


// 新增  POST
router.post('/', (req, res) => {
  const insertSql = 'INSERT INTO sys_user SET ?'; // 准备 SQL 插入语句
  const { name,phone,username, password, avatar,age,sex,disease} = convertKeysToSnakeCase(req.body);
  const postData = { name,phone,username, password, avatar,age,sex,disease};
  addApi(insertSql,res,postData);
});

//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
    // console.log(req.params,'req.params');
    // console.log(req.body,'req.body');
    const id = parseInt(req.params.id);
    const newState = req.body.status;
    const query = 'UPDATE sys_user SET status = ? WHERE user_id = ?';
    changeStatusApi(query,[newState, id],res);
});
// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    const delsql = "DELETE FROM sys_user WHERE user_id = ?";
    delApi(delsql,[id],res);
});
// 更新接口 PUT请求处理程序 
router.put('/', (req, res) => {
  // console.log(req,'req');
  const { name, age,avatar,username,phone,sex,user_height,user_weight,address,disease,user_id} = convertKeysToSnakeCase(req.body);
  console.log(convertKeysToSnakeCase(req.body),'convertKeysToSnakeCase(req.body)');
  const updatevalues = {name, age,avatar,username,phone,sex,user_height,user_weight,address,disease};
  let updateSql='UPDATE sys_user SET ? WHERE user_id = ?';
  // console.log(updateSql,'updateSql------------------')
  updateApi(updateSql,[updatevalues, user_id],res);
});
//     // 在实际项目中，这里应该是更新数据库中用户的状态逻辑
//     // const user = users.find(user => user.id === userId);
//     // if (!user) {
//     //     return res.status(404).json({ message: 'User not found' });
//     // }
//     // user.state = newState;
//     // res.json({ message: 'User status updated successfully', user });

//     // 更新数据库中用户的状态
//     // const query = 'UPDATE user SET state = ? WHERE id = ?';
//      const query = 'UPDATE sys_user SET state = ? WHERE user_id = ?';
//     connectionPool.query(query, [newState, userId], (error, results, fields) => {
//         if (error) {
//             console.error('Error querying database:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         } else {
//              res.json({
//                 code: 200,
//                 data: results,
//             });
//             // res.json({ message: 'User status updated successfully', userId, newState });
//         }
//     });
// });

// 删除用户数据 DELETE请求处理程序  
// router.delete('/:id', (req, res) => {
//     // const {id} = req.body; // 从请求体中获取数据
//     const id = req.params.id;
//     // console.log(id,'id');
//     const values = [id];
//     const sql = "DELETE FROM sys_user WHERE user_id = ?";
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
//             message:'用户状态更改成功！',
//         });
//     });
// });

module.exports = router;
