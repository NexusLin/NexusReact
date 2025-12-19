const express = require('express');
const router = express.Router();

const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase, convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法


// 查询列表
router.get('/',(req, res) => {
    let query = `SELECT * FROM applications`;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM applications`
     // 查询数据库并返回数据
    const { activity_id,user_id,status,page_num, page_size} = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{activity_id,user_id,status,page_num, page_size});
});

//查询当前用户的申请记录
router.get('/listuserapplication',(req, res) => {
    // 查询数据库列表---主要是活动列表
    // activities a  applications u sys_user 用户表
     let query = `
         SELECT
            a.status AS status,
            a.id AS appli_id,
            a.user_id as appli_user_id,
            a.activity_id,
            u.name AS user_name, 
            u.avatar AS user_avatar, 
            act.title AS activity_title
        FROM applications a
        JOIN sys_user u ON a.user_id = u.user_id
        JOIN activities act ON a.activity_id = act.id
        WHERE a.user_id = ?;
    `;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM applications`
     // 查询数据库并返回数据
    const {user_id} = convertKeysToSnakeCase(req.query);

    // 这里传入参数
    connectionPool.query(query,[user_id], (err, results) => {
        if (err) {
            // console.log(err,'err');
            res.send({
                code: 500,
                // data: results,
                message: '查询失败！'
            });
        } else {
            console.log()
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
  const insertSql = 'INSERT INTO applications SET ?'; // 准备 SQL 插入语句
  const { user_id, activity_id, status} = convertKeysToSnakeCase(req.body);
  const postData = {user_id, activity_id, status:status||'pending'};
  addApi(insertSql,res,postData);
});


// 获取详情 3
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const values = [id];
    let querySql = 'SELECT * FROM applications WHERE id = ?';
    getApi(querySql,values,res);
}); 

// 更新接口 
router.put('/', (req, res) => {
  // console.log(req,'req');
  const { user_id, activity_id, status,id} = convertKeysToSnakeCase(req.body);
  const updatevalues = {user_id, activity_id, status,id};
  let updateSql='UPDATE applications SET ? WHERE id = ?';
  updateApi(updateSql,[updatevalues, id],res);
});

// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    const delsql = "DELETE FROM applications WHERE id = ?";
    delApi(delsql,[id],res);
});

//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newState = req.body.status;
    const query = 'UPDATE applications SET status = ? WHERE id = ?';
    changeStatusApi(query,[newState, id],res);
});
module.exports = router;