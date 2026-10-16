
const express = require('express');
const router = express.Router();
// 引入数据库连接池模块
const connectionPool = require('../../config/db');
// 引入公共封装方法
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); 
// 引入接口封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); 


// 数据库表
const tableName = 'files_manage';

// 查询列表
router.get('/',(req, res) => {
    let query = `SELECT * FROM ${tableName}`;
    let sqltotal =`SELECT COUNT(*) AS total FROM ${tableName}`;
    const {file_name,page_num,page_size,created_at} = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{file_name,page_num, page_size});
});
// 新增POST
router.post('/', (req, res) => {
  const insertSql = `INSERT INTO ${tableName} SET ?`; // 准备 SQL 插入语句
  const {file_name, file_path, file_size, file_type, file_uid, created_by} = convertKeysToSnakeCase(req.body);
  const postData = {file_name, file_path, file_size, file_type, file_uid, created_by};
  addApi(insertSql,res,postData);
});

 












// 获取详情 3
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const values = [id];
  let querySql = 'SELECT * FROM files_manage WHERE cartitem_id = ?';
  getApi(querySql,values,res);
}); 

// 更新接口 PUT请求处理程序 
router.put('/', (req, res) => {
  const { user_id, product_id, quantity, price, is_active,cartitem_id} = convertKeysToSnakeCase(req.body);
  const updatevalues = {user_id, product_id, quantity, price, is_active};
  let updateSql='UPDATE files_manage SET ? WHERE cartitem_id = ?';
  updateApi(updateSql,[updatevalues, cartitem_id],res);
});

// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const delsql = "DELETE FROM files_manage WHERE cartitem_id = ?";
    delApi(delsql,[id],res);
});
//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const newState = req.body.isActive ?req.body.isActive :0;
  const query = 'UPDATE files_manage SET is_active = ? WHERE cartitem_id = ?';
  changeStatusApi(query,[newState, id],res);
});
module.exports = router;
