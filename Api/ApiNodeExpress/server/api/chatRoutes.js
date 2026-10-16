// 聊天模块
const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const { addCondition, addDateRangeCondition, addPagination, convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法


const {sendWmsg} = require('../ws/websocketchat');



// 新增 POST
router.post('/', (req, res) => {
    const currentTime = new Date();  // 获取当前时间

    const insertSql = 'INSERT INTO sys_chat SET ?'; // 准备 SQL 插入语句
    const {chat_name, user_id, user_name, avatar, receiver_id, content, grade}  = convertKeysToSnakeCase(req.body);

    if (! content) {
        res.send({
            code: 400,
            message: '请填写必填信息！'
        });
        return
    }
    const postData = { chat_name, user_id:user_id||0, user_name, avatar, receiver_id, content, grade};
    
    connectionPool.query(insertSql, postData, (error, results, fields) => {
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

            sendWmsg(JSON.stringify({
                type:"chatmsg",
                data:postData,
            }))

        }
    });
});

// 分页查询
router.get('/', (req, res) => {
   const { chat_name, user_id, user_name, avatar, receiver_id, content, grade,page_num, page_size} = convertKeysToSnakeCase(req.query);
    let query = `SELECT * FROM sys_chat`;
    // 构建查询条件
    const params = [];
    query = addCondition(query, params, 'content', content);
    query = addCondition(query, params, 'user_id', user_id);
    query = addPagination(query, params, page_num, page_size); //分页条件
    

    // console.log(query,'query查询');
    // 查询数据库并返回数据
    connectionPool.query(query, params, (error, results) => {
        if (error) {
            res.send({
                code: 500,
                data: results,
                message: '查询失败！'
            });
            return;
        } else {
            let sqltotal = `SELECT COUNT(*) AS total FROM sys_chat;`
            // 查询数据库并返回数据
            connectionPool.query(sqltotal, (errtotal, rows) => {
                let total = rows[0]['total'];
                if (errtotal) {
                    res.send({
                        code: 401,
                        // data: results,
                        message: '查询失败！'
                    });
                    return;
                } else {
                    console.log('查询成功');
                    let data=convertToCamelCase(results);
                    let newdata={
                        ...convertToCamelCase(results),
                    }
                    res.send({
                        total: total,
                        code: 200,
                        data:convertToCamelCase(results),
                        message: '查询成功！',
                    });
                }
            });
        }
    });
});



// 详情接口
router.get('/:id', (req, res) => {
    // console.log(req.params,'聊天详情');
    const { id } = req.params;
    const values = [id];
    let query = 'SELECT * FROM sys_chat WHERE chat_id = ?';
    connectionPool.query(query, values, (err, results) => {
        if (err) {
            // console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({
            code: 200,
            data: results ? convertToCamelCase(results[0]): {},
        });
    });
});


// 更新接口 
router.put('/', (req, res) => {
    console.log(req.params,'req.params---聊天更新');
    console.log(req.body,'req.body---聊天更新');
    const currentTime = new Date();  // 获取当前时间
    const { chat_name, user_id, user_name, avatar, receiver_id, content, grade ,chat_id} = convertKeysToSnakeCase(req.body);
    let id=chat_id;
    // 确保 id 是有效的数字
    if (isNaN(id)) {
        return res.status(400).send({
            code: 400,
            message: '无效的 ID！'
        });
    }

    // 构建更新的字段（不包括 id）
    const updateValues = {  chat_name, user_id, user_name, avatar, receiver_id, content, grade, update_time:currentTime};

    // 确保至少传递了要更新的字段
    if (!id || !content) {
        return res.status(400).send({
            code: 400,
            message: '填写信息不完善！'
        });
    }
    // 执行数据库更新
    connectionPool.query('UPDATE sys_chat SET ? WHERE chat_id = ?', [updateValues, id], (error, results, fields) => {
        if (error) {
            console.error('聊天error', error);
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
            // affectedRows: results.affectedRows
        });
    });
});

// 删除数据 DELETE请求处理程序  
router.delete('/:ids', (req, res) => {
    const { ids } = req.params;
    
    // 删除失败，数据存在关联！
    
    // 如果ids为空，直接返回400错误
    if (!ids) {
        return res.status(400).json({ success: false, message: '没有提供有效的公告ID' });
    }

    const idArray = ids.split(',').map(id => id.trim()).filter(id => id !== '');  // 去除空格和空字符串

    // 如果idArray为空，说明没有有效的ID
    if (idArray.length === 0) {
        return res.status(400).json({ success: false, message: '没有有效的公告ID' });
    }

    const sql = "DELETE FROM sys_chat WHERE chat_id IN (?)";
    connectionPool.query(sql, [idArray], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }

        // 如果没有影响的行数，返回失败消息
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '未找到对应的公告或删除失败' });
        }

        // 返回成功消息，包含删除的行数
        res.json({
            code:200,
            success: true,
            message: `${results.affectedRows}个数据已删除`,
        });
    });
});


module.exports = router;