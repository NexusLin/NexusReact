const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法


// 查询列表
router.get('/',(req, res) => {
    // 查询数据库列表
    let query = `SELECT * FROM sys_dict_data`;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM sys_dict_data`
     // 查询数据库并返回数据
    const { dict_name, dict_type,dict_label, status,begin_time,end_time, page_num, page_size } = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{dict_name,dict_type, status,dict_label,begin_time,end_time,page_num, page_size});
});

// 查询所有接口
router.get('/optionselect', (req, res) => {

    // console.log(req.query, 'req.query');
  
    const { dict_name, dict_type, status,begin_time,end_time} = convertKeysToSnakeCase(req.query);

    let query = `SELECT * FROM sys_dict_data`;

    // 构建查询条件
    const params = [];

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

// 新增  POST
router.post('/', (req, res) => {
  const insertSql = 'INSERT INTO sys_dict_data SET ?'; // 准备 SQL 插入语句
  const { dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, update_by, remark} = convertKeysToSnakeCase(req.body);
  const postData = {dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_by, update_by, remark};
  addApi(insertSql,res,postData);
});


// 更新接口 
router.put('/', (req, res) => {
  // console.log(req,'req');
  const { dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, update_by, remark,dict_code} = convertKeysToSnakeCase(req.body);
  const updatevalues = {dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, update_by, remark};
  let updateSql='UPDATE sys_dict_data SET ? WHERE dict_code = ?';
  updateApi(updateSql,[updatevalues, dict_code],res);
});

// 获取详情 
router.get('/:id', (req, res) => {
    // console.log(req.query,'req.query');
    console.log(req,'req');
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
            data: convertToCamelCase(results[0])|| {},
        });
    });
}); 



// 删除用户数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    const values = [id];
    const sql = "DELETE FROM sys_dict_data WHERE dict_code = ?";
    connectionPool.query(sql, values, (err, results) => {
        // console.log(err,'err');
        // console.log(results,'results');
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({
            code: 200,
            // data: results,
            message:'用户删除成功！',
        });
    });
});

//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
    console.log(req.params,'req.params');
    console.log(req.body,'req.body');
    const dict_code = parseInt(req.params.id);
    const status = req.body.state;

    const query = 'UPDATE sys_dict_data SET status = ? WHERE dict_code = ?';
    connectionPool.query(query, [status, dict_code], (error, results, fields) => {
        if (error) {
            console.log(err,'err');
            console.log(results,'results');
            res.status(500).json({ error: 'Internal server error' });
            return;
        } else {
             res.json({
                code: 200,
                data: results,
            });
        }
    });
});


module.exports = router;