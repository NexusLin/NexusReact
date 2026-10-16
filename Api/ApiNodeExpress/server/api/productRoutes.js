const express = require('express');
const router = express.Router();

const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法
// 查询列表
router.get('/',(req, res) => {
    // console.log(req.query, 'req.query');
    // console.log(req.body,'req.body');
    // console.log(req.params,'req.params');
    // 查询数据库列表
    let querySql = `SELECT * FROM Products WHERE deleted_time IS NULL`;
    // 查询数据库总数
    let querysqltotal = `SELECT COUNT(*) AS total FROM Products`
     // 查询数据库并返回数据
    const { name, description, category_id, price, stock, sku, brand,
      weight, dimensions, color, size, status, is_active, is_featured,
      is_on_sale, image_url, additional_images, video_url, tags, promotion_price,
      rating, review_count, shipping_fee, supplier_id,page_num, page_size } = convertKeysToSnakeCase(req.query);
      listApi(querySql,querysqltotal,req,res,{ name,page_num, page_size});
});

// 新增  POST
router.post('/', (req, res) => {
  const insertSql = 'INSERT INTO Products SET ?'; // 准备 SQL 插入语句
  const { name, description, category_id, price, stock, sku, brand,
    weight, dimensions, color, size, status, is_active, is_featured,
    is_on_sale, image_url, additional_images, video_url, tags, promotion_price,
    rating, review_count, shipping_fee, supplier_id,} = convertKeysToSnakeCase(req.body);
  const postData = { name, description, category_id, price, stock, sku, brand,
    weight, dimensions, color, size, status, is_active, is_featured,
    is_on_sale, image_url, additional_images, video_url, tags, promotion_price,
    rating, review_count, shipping_fee, supplier_id,};
  addApi(insertSql,res,postData);
});

// 获取详情 3
router.get('/:id', (req, res) => {
  // console.log(req.params,'req.params');
  const { id } = req.params;
  const values = [id];
  let querySql = 'SELECT * FROM Products WHERE product_id = ?';
  getApi(querySql,values,res);
}); 

// 更新接口 PUT请求处理程序 
router.put('/', (req, res) => {
  // console.log(req,'req');
  const { name, description, category_id, price, stock, sku, brand,
    weight, dimensions, color, size, status, is_active, is_featured,
    is_on_sale, image_url, additional_images, video_url, tags, promotion_price,
    rating, review_count, shipping_fee, supplier_id,product_id} = convertKeysToSnakeCase(req.body);
  const updatevalues = {name, description, category_id, price, stock, sku, brand,
    weight, dimensions, color, size, status, is_active, is_featured,
    is_on_sale, image_url, additional_images, video_url, tags, promotion_price,
    rating, review_count, shipping_fee, supplier_id,product_id};
  let updateSql='UPDATE Products SET ? WHERE product_id = ?';
  updateApi(updateSql,[updatevalues, product_id],res);
});

// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    const delsql = "DELETE FROM Products WHERE product_id = ?";
    delApi(delsql,[id],res);
});
//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
  // console.log(req.params,'req.params');
  // console.log(req.body,'req.body');
  const id = parseInt(req.params.id);
  const newState = req.body.isActive ?req.body.isActive :0;
  const query = 'UPDATE Products SET is_active = ? WHERE product_id = ?';
  changeStatusApi(query,[newState, id],res);
});
module.exports = router;
