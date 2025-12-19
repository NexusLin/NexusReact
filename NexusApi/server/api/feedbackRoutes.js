const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法



// 新增 POST
router.post('/', (req, res) => {
    const insertSql = 'INSERT INTO feedbacks SET ?'; // 准备 SQL 插入语句
    const { name, phone, username, describe, email, userId } = req.body;

    // 检查是否缺少必要字段
    if (!describe || !userId) {
        res.send({
            code: 400,
            data: results,
            message: '请填写必填信息！'
        });
        return
    }

    const postData = { name, phone, username, describe, email, userId };
    connectionPool.query(insertSql, postData, (error, results, fields) => {
        console.log(results, 'results');
        if (error) {
            res.send({
                code: 500,
                data: results,
                message: '添加失败！'
            });
            return;
        } else {
            res.send({
                code: 200,
                data: results,
                message: '反馈成功,请耐心等待管理员回复！'
            });
        }
    });
});


// 查询列表
router.get('/',(req, res) => {
    // 查询数据库列表
    let query = `SELECT * FROM feedbacks`;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM feedbacks`
     // 查询数据库并返回数据
    const { userId, describe, name,phone,page_num, page_size} = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{userId, describe, name,phone,page_num, page_size});
});


// // 分页查询
// router.get('/', (req, res) => {
//     const { describe, name,phone,feedinformation,userId, pageNum, pageSize } = req.query;
//     let query = `SELECT * FROM feedbacks`;
//     // 构建查询条件
//     const params = [];
//     query = addCondition(query, params, '', userId); 
//     query = addCondition(query, params, '', describe);
//     query = addCondition(query, params, '', name);
//     query = addCondition(query, params, '', phone);


//     query = addPagination(query, params, pageNum, pageSize); //分页条件
    
//     console.log('查询条件', query, params);
//     // 查询数据库并返回数据
//     connectionPool.query(query, params, (error, results) => {
//         if (error) {
//             res.send({
//                 code: 500,
//                 data: results,
//                 message: '查询失败！'
//             });
//             return;
//         } else {
//             let sqltotal = `SELECT COUNT(*) AS total FROM feedbacks;`
//             // 查询数据库并返回数据
//             connectionPool.query(sqltotal, (errtotal, rows) => {
//                 let total = rows[0]['total'];
//                 if (errtotal) {
//                      res.send({
//                         code: 401,
//                         data: results,
//                         message: '查询失败！'
//                     });
//                     return;
//                 } else {
//                     res.send({
//                         total: total,
//                         code: 200,
//                         data: results,
//                         message: '查询成功！',
//                     });
//                 }
//             });
//         }
//     });
// });

 // 更新接口 
router.put('/', (req, res) => {
    const { name, phone, username, describe, userId, email,feedinformation, id } = req.body;

    // 确保 id 是有效的数字
    if (isNaN(id)) {
        return res.status(400).send({
            code: 400,
            message: '无效的 ID！'
        });
    }

    // 构建更新的字段（不包括 id）
    const updateValues = { name, phone, username, describe, userId, email,feedinformation };

    // 确保至少传递了要更新的字段
    if (!name || !phone ||!feedinformation ) {
        return res.status(400).send({
            code: 400,
            message: '缺少信息！'
        });
    }

    // 执行数据库更新
    connectionPool.query('UPDATE feedbacks SET ? WHERE id = ?', [updateValues, id], (error, results, fields) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).send({
                code: 500,
                message: '修改失败！',
                error: error.message || error
            });
        }

        // 如果没有记录被更新
        if (results.affectedRows === 0) {
            return res.status(404).send({
                code: 404,
                message: '没有找到对应的记录！'
            });
        }

        // 成功
        res.send({
            code: 200,
            message: '修改成功！',
            affectedRows: results.affectedRows
        });
    });
});



// 获取详情 3
router.get('/:id', (req, res) => {
    // console.log(req.query,'req.query');
    const { id } = req.params;
    const values = [id];
    let query = 'SELECT * FROM feedbacks WHERE id = ?';
    connectionPool.query(query, values, (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({
            code: 200,
            data: results ? results[0] : {},
        });
    });
});


// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const values = [id];
    const sql = "DELETE FROM feedbacks WHERE id = ?";
    connectionPool.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({
            code: 200,
            data: results,
            message: '删除成功！',
        });
    });
});



// //  禁用和使用,用于更改状态
// router.put('/status/:id', (req, res) => {
//     console.log(req.params, 'req.params');
//     console.log(req.body, 'req.body');
//     const userId = parseInt(req.params.id);
//     const newState = req.body.state;

//     // 在实际项目中，这里应该是更新数据库中用户的状态逻辑
//     // const user = users.find(user => user.id === userId);
//     // if (!user) {
//     //     return res.status(404).json({ message: 'User not found' });
//     // }
//     // user.state = newState;
//     // res.json({ message: 'User status updated successfully', user });

//     // 更新数据库中用户的状态
//     // const query = 'UPDATE user SET state = ? WHERE id = ?';
//     const query = 'UPDATE user SET state = ? WHERE id = ?';
//     connectionPool.query(query, [newState, userId], (error, results, fields) => {
//         if (error) {
//             console.error('Error querying database:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         } else {
//             res.json({
//                 code: 200,
//                 data: results,
//             });
//             // res.json({ message: 'User status updated successfully', userId, newState });
//         }
//     });
// });





module.exports = router;