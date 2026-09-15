const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法

// 新增 POST
router.post('/', (req, res) => {
    const insertSql = 'INSERT INTO helps SET ?'; // 准备 SQL 插入语句
    const { title,content} = req.body;

    // 检查是否缺少必要字段
    if (!title || !content) {
        res.send({
            code: 400,
            data: results,
            message: '请填写必填信息！'
        });
        return
    }

    const postData = { title,content };
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
                message: '添加成功！'
            });
        }
    });
});

// 查询列表
router.get('/',(req, res) => {
    // 查询数据库列表
    let query = `SELECT * FROM helps`;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM helps`
     // 查询数据库并返回数据
    const { title,content,page_num,page_size} = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{title,content,page_num,page_size});
});


 // 更新接口 
router.put('/', (req, res) => {
    const { title,content, id } = req.body;

    // 确保 id 是有效的数字
    if (isNaN(id)) {
        return res.status(400).send({
            code: 400,
            message: '无效的 ID！'
        });
    }

    // 构建更新的字段（不包括 id）
    const updateValues = { title,content, };

    // 确保至少传递了要更新的字段
    if (!title || !content ) {
        return res.status(400).send({
            code: 400,
            message: '缺少信息！'
        });
    }

    // 执行数据库更新
    connectionPool.query('UPDATE helps SET ? WHERE id = ?', [updateValues, id], (error, results, fields) => {
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
    let query = 'SELECT * FROM helps WHERE id = ?';
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
    const sql = "DELETE FROM helps WHERE id = ?";
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
module.exports = router;