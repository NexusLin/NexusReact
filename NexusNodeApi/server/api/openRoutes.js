
const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块

const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法

// 字典类型数据data接口
// 查询接口
// /dictData?dict_type=nexus_articletype
router.get('/dictDataAll', (req, res) => {
    const { dict_name, dict_type,dict_label, status,begin_time,end_time} = convertKeysToSnakeCase(req.query);
    let query = `SELECT * FROM sys_dict_data`;


    // 构建查询条件
    const params = [];
    query = addCondition(query, params, 'dict_name', dict_name); // 字典名称
    query = addCondition(query, params, 'dict_type', dict_type);  // 字典类型
    query = addCondition(query, params, 'dict_label', dict_label); // 字典标签
    query = addCondition(query, params, 'status', status);  // 状态

    query = addDateRangeCondition(query,params,begin_time,end_time); //查询时间
    
    console.log(query,'query');
    connectionPool.query(query,params,(error, results, fields) => {
         if (error) {
          res.send({
              code: 500,
              message:'查询失败！',
          });
          res.status(500).json({ error: error.message });
        } else {
          res.send({
              code: 200,
              data: convertToCamelCase(results),
              message:'查询成功！',
          });
        }
    });
});


// 查询首页数据
router.get('/sysData', (req, res) => {
    // console.log(req, 'req-----查询');
    console.log('sysdataRoutes-----查询');
    // SELECT activity_type, COUNT(*) AS activity_count FROM activities GROUP BY activity_type
    // sql查询语句，
    // 根据activity_type对activities表中的同类型数据进行分类
    // 得到activity_type以及activity_type_total,
    // 然后根据activity_type去sys_dict_data表中找到dict_type参数为activitytype且值和activity_type一样的值
    // 对应数据的dict_label返回为activity_type_name


    let query = `SELECT 
        COUNT(*) AS total_users,
        COUNT(CASE WHEN sex = 1 THEN 1 END) AS male_users,
        COUNT(CASE WHEN sex = 2 THEN 1 END) AS female_users,
        COUNT(CASE WHEN sex IS NULL THEN 1 END) AS unknown_gender_users,
        (SELECT COUNT(*) FROM sys_article) AS total_articles,
        (SELECT COUNT(*) FROM sys_chat) AS total_chats,
        (SELECT COUNT(*) FROM applications) AS total_applications
    FROM sys_user;`;

    let queryactivity = `SELECT 
        a.activity_type,
        COUNT(*) AS activity_type_total,
        d.dict_label AS activity_type_name
    FROM 
        activities a
    JOIN 
        sys_dict_data d ON a.activity_type = d.dict_value AND d.dict_type = 'activitytype'
    GROUP BY 
        a.activity_type, d.dict_label;`;


    connectionPool.query(query,(error, results, fields) => {
         if (error) {
            console.log(error,'error---------------------')
          res.send({
              code: 500,
              message:'查询失败！',
          });
        } else {
          res.send({
              code: 200,
              data: results?convertToCamelCase(results[0]):null,
              message:'查询成功！',
          });
        }
    });
});

// 获取详情 
router.get('/:id', (req, res) => {
    // console.log(req.query,'req.query');
    //  console.log('我请求22');
    // console.log(req,'req');
    const { id } = req.params;
    const values = [id];
    let query = 'SELECT * FROM  sys_dict_data WHERE dict_code = ?';
    connectionPool.query(query, values, (err, results) => {
        // console.log(err,'err');
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

module.exports = router;