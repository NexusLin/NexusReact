const express = require('express');
const router = express.Router();

const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法

// 查询列表
router.get('/',(req, res) => {
    // 查询数据库列表
    let query = `SELECT * FROM activities`;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM activities`
     // 查询数据库并返回数据
    const { title,create_time,activity_type,page_num, page_size } = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{title,activity_type,page_num, page_size});
});

// 查询列表
router.get('/listuser',(req, res) => {
    // 查询数据库列表---主要是活动列表
    // activities a     applications u
    
    // 查询activities活动表中的所有同类型活动，查询类型参数为activity_type
    // 并查询出applications申请表中activity_id为activity_typestatus的信息以及status为approved的信息
    // 并查询出user表中id为applications申请表中user_id的用户name.age以及其他信息
    
    let querySql =`SELECT
            act.activity_type,
            act.id AS activity_id,
            act.title,
            act.description,
            act.location AS activity_location,
            act.start_time AS activity_start_time,
            act.end_time AS activity_end_time,
            act.create_time AS createTime,
            act.update_time AS updateTime,
            COUNT(u2.user_id) AS approve_user_count,
            -- 用户列表（过滤全 NULL 条目）
            COALESCE(
                JSON_ARRAYAGG(
                    CASE 
                        -- 当关键字段存在时才生成用户对象
                        WHEN app.user_id IS NOT NULL THEN 
                            JSON_OBJECT(
                                'userId', app.user_id,
                                'status', app.status,
                                'activityId', app.activity_id,
                                'applicant_user_id', app.id,
                                'appliedTime', app.applied_time,
                                'name', u2.name,
                                'avatar', u2.avatar,
                                'sex', u2.sex,
                                'age', u2.age
                            )
                        ELSE 
                            NULL  -- JSON_ARRAYAGG 忽略 NULL
                    END
                ),
                JSON_ARRAY()  -- 兜底空数组
            ) AS userList,
            -- 用户列表长度计数（直接统计有效用户数）
            COUNT(app.user_id) AS userCount
        FROM
            activities act
        LEFT JOIN (
            -- 子查询：仅选择有效的申请记录（用户存在）
            SELECT 
                app.* 
            FROM 
                applications app
            INNER JOIN sys_user u  -- 使用 INNER JOIN 确保用户存在且 user_id 非空
                ON app.user_id = u.user_id
        ) AS app ON act.id = app.activity_id
        LEFT JOIN sys_user u2 
            ON app.user_id = u2.user_id
        WHERE
            act.activity_type = ?  -- 按活动类型过滤
        GROUP BY
            act.id;`
        // `SELECT
        // act.id AS activity_id,
        // act.title AS title,
        // act.description AS description,
        // act.location AS activity_location,
        // act.start_time AS activity_start_time,
        // act.end_time AS activity_end_time,
        // act.create_time AS createTime,
        // act.update_time AS updateTime,
        // act.activity_type AS activity_type,
        //     JSON_ARRAYAGG(
        //         JSON_OBJECT(
        //             'userId', app.user_id,
        //             'status', app.status,
        //             'activityId', app.activity_id,
        //             'applicant_user_id', app.id,
        //             'appliedTime', app.applied_time,
        //             'userEmail', u2.id,
        //             'name',u2.name,
        //             'avatar',u2.avatar,
        //             'sex',u2.sex,
        //             'age',u2.age
        //         )
        //     ) AS userList
        // FROM
        //     activities act
        // JOIN
        //     applications app ON act.id = app.activity_id
        // JOIN
        //     user u2 ON app.user_id = u2.id
        // WHERE
        //     app.status = 'approved' AND app.activity_type = ?
        // GROUP BY
        //     act.id;`;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM activities`

    // console.log(querySql,'querySql');
     // 查询数据库并返回数据
    const { title,create_time,activity_type,page_num, page_size } = convertKeysToSnakeCase(req.query);

    // console.log(activity_type,'activity_type');
   // 查询数据库并返回数据
    connectionPool.query(querySql, [activity_type], (err, results) => {
        
        // console.log(results,'results');
        if (err) {
            // console.log(err,'err-----listuser');
            console.log(`错误日志 %c${err}`, 'color: skyblue; font-size: 30px;') 

            res.send({
                code: 500,
                // data: results,
                message: '查询失败！'
            });
            return;
        } else {
            if (results.length > 0) {
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
                        res.send({
                            total: total,
                            code: 200,
                            data: convertToCamelCase(results),
                            message: '查询成功！',
                        });
                    }
                });
            } else {
                res.send({
                    total: 0,
                    code: 200,
                    data: [],
                    message: '查询成功！',
                });
            }
        }
    });
});

// 新增  POST
router.post('/', (req, res) => {
  const insertSql = 'INSERT INTO activities SET ?'; // 准备 SQL 插入语句
  const { title, description,activity_type} = convertKeysToSnakeCase(req.body);
  const postData = {title, description,activity_type};
  addApi(insertSql,res,postData);
});


// 获取详情 3
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const values = [id];
    let querySql = 'SELECT * FROM activities WHERE id = ?';
    getApi(querySql,values,res);
}); 

// 更新接口 
router.put('/', (req, res) => {
  // console.log(req,'req');
  const { title, description,activity_type,id} = convertKeysToSnakeCase(req.body);
  const updatevalues = {title, description,activity_type};
  let updateSql='UPDATE activities SET ? WHERE id = ?';
  updateApi(updateSql,[updatevalues, id],res);
});

// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    const delsql = "DELETE FROM activities WHERE id = ?";
    delApi(delsql,[id],res);
});


//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newState = req.body.status;
    const query = 'UPDATE activities SET status = ? WHERE id = ?';
    changeStatusApi(query,[newState, id],res);
});
module.exports = router;