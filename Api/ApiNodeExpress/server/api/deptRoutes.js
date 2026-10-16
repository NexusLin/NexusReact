
const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法
 
// 数据库表
const tableName = 'sys_dept';

// 查询列表
router.get('/',(req, res) => {
    let query = `SELECT * FROM ${tableName}`;
    let sqltotal = `SELECT COUNT(*) AS total FROM ${tableName}`
    const { dept_name } = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{dept_name});
});
// 新增 POST
router.post('/', (req, res) => {
    const insertSql = `INSERT INTO ${tableName} SET ?`;
    const { dept_name,email,order_num,leader,parent_id,phone,status} = convertKeysToSnakeCase(req.body);
    const postData = {dept_name,email,order_num,leader,parent_id,phone,status,update_time:new Date()};
    addApi(insertSql,res,postData);
});
// 获取详情 
router.get('/:dept_id', (req, res) => {
    // console.log(req.query,'req.query');
    const { dept_id } = req.params;
    const values = [dept_id];
    let querySql = `SELECT * FROM ${tableName} WHERE dept_id = ?`;
    getApi(querySql,values,res);
});
// 更新
router.put('/', (req, res) => {
    const {dept_name,email,order_num,leader,parent_id,phone,status,dept_id} = convertKeysToSnakeCase(req.body);
    const updatevalues = {dept_name,email,order_num,leader,parent_id,phone,status,dept_id,update_time:new Date()};
    let updateSql=`UPDATE ${tableName} SET ? WHERE dept_id = ?`;
    updateApi(updateSql,[updatevalues, dept_id],res);
});

// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    const delsql = `DELETE FROM ${tableName} WHERE dept_id = ?`;
    delApi(delsql,[id],res);
});

//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newState = req.body.status;
    const query = `UPDATE ${tableName} SET status = ? WHERE id = ?`;
    changeStatusApi(query,[newState, id],res);
});
module.exports = router;