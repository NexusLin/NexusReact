const express = require('express');
const router = express.Router();

const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法
// 查询列表
router.get('/',(req, res) => {
    let querySql = `SELECT * FROM CartItems `;   // 查询数据库列表
    let querysqltotal = `SELECT COUNT(*) AS total FROM CartItems`;  // 查询数据库总数
     // 查询数据库并返回数据
    const { user_id, product_id, quantity, price, is_active,page_num, page_size } = convertKeysToSnakeCase(req.query);
    listApi(querySql,querysqltotal,req,res,{ user_id, product_id, quantity, price, is_active,page_num, page_size});
});

// 新增  POST
router.post('/', (req, res) => {
  const insertSql = 'INSERT INTO CartItems SET ?'; // 准备 SQL 插入语句
  const {quantity, price, is_active} = convertKeysToSnakeCase(req.body);
  const postData = {quantity, price};
  addApi(insertSql,res,postData);
});

// 获取详情 3
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const values = [id];
  let querySql = 'SELECT * FROM CartItems WHERE cartitem_id = ?';
  getApi(querySql,values,res);
}); 

// 更新接口 PUT请求处理程序 
router.put('/', (req, res) => {
  const { user_id, product_id, quantity, price, is_active,cartitem_id} = convertKeysToSnakeCase(req.body);
  const updatevalues = {user_id, product_id, quantity, price, is_active};
  let updateSql='UPDATE CartItems SET ? WHERE cartitem_id = ?';
  updateApi(updateSql,[updatevalues, cartitem_id],res);
});

// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const delsql = "DELETE FROM CartItems WHERE cartitem_id = ?";
    delApi(delsql,[id],res);
});
//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const newState = req.body.isActive ?req.body.isActive :0;
  const query = 'UPDATE CartItems SET is_active = ? WHERE cartitem_id = ?';
  changeStatusApi(query,[newState, id],res);
});
module.exports = router;
