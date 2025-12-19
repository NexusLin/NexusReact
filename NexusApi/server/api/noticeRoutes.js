const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法

const {sendNotice} = require('../ws/websocketserver');

// 新增 POST
router.post('/', (req, res) => {
    const currentTime = new Date();  // 获取当前时间
    // const create_time=currentTime;
    // const update_time=currentTime;

    const insertSql = 'INSERT INTO sys_notice SET ?'; // 准备 SQL 插入语句
    const {notice_id,notice_title, notice_type, notice_content, status, create_by, update_by, remark} 
    = convertKeysToSnakeCase(req.body);

    // 检查是否缺少必要字段
    if (!notice_title || !notice_content) {
        res.send({
            code: 400,
            data: results,
            message: '请填写必填信息！'
        });
        return
    }
    let datasend=`
    收到一条公告信息:
    标题：${notice_title};
    内容：${notice_content};
    类型：${notice_type};
    `
    const postData = { notice_title, notice_type, notice_content, status, create_by, update_by, remark,create_time:currentTime,update_time:currentTime};
    // console.log(postData,'postData');
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
                // data: results,
                message: '添加成功！'
            });
            console.log('发送公告','notice_type',notice_type);
            sendNotice({
                type:notice_type,
                data:datasend,
            })
        }
    });
});


// 查询列表
router.get('/',(req, res) => {
    // 查询数据库列表
    let query = `SELECT * FROM sys_notice`;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM sys_notice`
     // 查询数据库并返回数据
    const { notice_title, notice_type, notice_content,page_num, page_size} = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{notice_title, notice_type,page_num, page_size});
});

// 详情接口
router.get('/:id', (req, res) => {
    // console.log(req.query,'req.query');
    const { id } = req.params;
    const values = [id];
    let query = 'SELECT * FROM sys_notice WHERE notice_id = ?';
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

    const currentTime = new Date();  // 获取当前时间
    const { notice_title, notice_type, notice_content, status, create_by, create_time, update_by,notice_id } = convertKeysToSnakeCase(req.body);

    // 确保 id 是有效的数字
    if (isNaN(notice_id)) {
        return res.status(400).send({
            code: 400,
            message: '无效的 ID！'
        });
    }

    // 构建更新的字段（不包括 id）
    const updateValues = { notice_title, notice_type, notice_content, status, create_by, create_time, update_by, update_time:currentTime };

    // 确保至少传递了要更新的字段
    if (!notice_title || !notice_content) {
        return res.status(400).send({
            code: 400,
            message: '填写信息不完善！'
        });
    }
    // 执行数据库更新
    connectionPool.query('UPDATE sys_notice SET ? WHERE notice_id = ?', [updateValues, notice_id], (error, results, fields) => {
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
            // affectedRows: results.affectedRows
        });
    });
});

// 删除数据 DELETE请求处理程序  
router.delete('/:ids', (req, res) => {
    const { ids } = req.params;
    
    // 如果ids为空，直接返回400错误
    if (!ids) {
        return res.status(400).json({ success: false, message: '没有提供有效的公告ID' });
    }
    const idArray = ids.split(',').map(id => id.trim()).filter(id => id !== '');  // 去除空格和空字符串
    console.log(idArray, 'idArray');  // 注意：生产环境中应该避免调试输出

    // 如果idArray为空，说明没有有效的ID
    if (idArray.length === 0) {
        return res.status(400).json({ success: false, message: '没有有效的公告ID' });
    }

    const sql = "DELETE FROM sys_notice WHERE notice_id IN (?)";
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