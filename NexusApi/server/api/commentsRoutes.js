const express = require('express');
const router = express.Router();

const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法

// 评论模块
// 新增  POST
router.post('/', (req, res) => {
  const insertSql = 'INSERT INTO comments SET ?'; // 准备 SQL 插入语句
  const {parent_id,article_id,content,author,create_time,update_time,user_id,avatar} = convertKeysToSnakeCase(req.body);
  const postData = {parent_id:parent_id||'0',article_id,content,author,create_time,update_time,user_id,avatar};
  addApi(insertSql,res,postData);
});

// 查询列表
router.get('/',(req, res) => {
    // 查询数据库列表
    let query = `SELECT * FROM comments`;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM comments`
     // 查询数据库并返回数据
    const { parent_id,article_id,content,author,create_time,update_time,user_id,avatar,page_num, page_size } = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{parent_id,article_id,content,author,create_time,update_time,user_id,avatar,page_num, page_size});
});

// 获取详情 3
router.get('/:id', (req, res) => {
    // console.log(req.query,'req.query');
    const { id } = req.params;
    const values = [id];
    let querySql = 'SELECT * FROM sys_user WHERE id = ?';
    getApi(querySql,values,res);
}); 

// 更新接口 PUT请求处理程序 
router.put('/', (req, res) => {
  // console.log(req,'req');
  const { name, age,avatar,username,phone,sex,user_height,user_weight,address,id} = convertKeysToSnakeCase(req.body);
  const updatevalues = {name, age,avatar,username,phone,sex,user_height,user_weight,address};
  let updateSql='UPDATE sys_user SET ? WHERE id = ?';
  updateApi(updateSql,[updatevalues, id],res);
});


// 用户禁用和使用,用于更改用户状态
router.put('/status/:id', (req, res) => {
    console.log(req.params,'req.params');
    console.log(req.body,'req.body');
    const userId = parseInt(req.params.id);
    const newState = req.body.state;
     const query = 'UPDATE sys_user SET state = ? WHERE id = ?';
    connectionPool.query(query, [newState, userId], (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        } else {
             res.json({
                code: 200,
                data: results,
            });
            // res.json({ message: 'User status updated successfully', userId, newState });
        }
    });
});

// 删除用户数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    // console.log(id,'id');
    const values = [id];
    const sql = "DELETE FROM sys_user WHERE id = ?";
    connectionPool.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({
            code: 200,
            data: results,
            message:'用户状态更改成功！',
        });
    });
});

module.exports = router;
