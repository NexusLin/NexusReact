const express = require('express');
const router = express.Router();
const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法

  // // 开始时间
    // if (beginTime !== undefined && beginTime !== '' && beginTime !== null) {
    //     query += params.length ? ' AND' : ' WHERE';
    //     query += ` create_time >= '${beginTime}'`;
    //     params.push(beginTime);
    // }
    
    //   // 结束时间
    // if (endTime !== undefined && endTime !== '' && endTime !== null) {
    //     query += params.length ? ' AND' : ' WHERE';
    //     query += ` create_time <= '${endTime}'`;
    //     params.push(endTime);
    // }

    // WHERE beginTime >= '2024-01-01 00:00:00' AND endTime <= '2024-12-31 23:59:59'
    // if (pageNum !== undefined && pageSize !== '' && pageSize !== null) {
    //     query += ' LIMIT ?, ?';
    //     let offset = (pageNum - 1) * pageSize;
    //     params.push(offset);

    //     params.push(parseInt(pageSize));
    // }



// 字典值type接口
// 查询接口
router.get('/', (req, res) => {

    console.log(req.query, 'req.query');
  
    const { dict_name, dict_type, status,page_num, page_size,begin_time,end_time} = convertKeysToSnakeCase(req.query);

    let query = `SELECT * FROM sys_dict_type`;

    // 构建查询条件
    const params = [];
    query = addCondition(query, params, 'dict_name', dict_name); // 字典名称
    query = addCondition(query, params, 'dict_type', dict_type);  // 字典类型
    query = addCondition(query, params, 'status', status);  // 状态
    // query = addCondition(query, params, 'dict_label', dict_label); // 字典标签
    query = addDateRangeCondition(query, params, begin_time, end_time); //查询时间
    query = addPagination(query, params, page_num, page_size);  //分页条件

  
    console.log(query,'query');

    connectionPool.query(query,params,(error, results, fields) => {
         if (error) {
          res.send({
              code: 500,
              message:'查询失败！',
          });
          res.status(500).json({ error: error.message });
        } else {
            if(results.length>0){
                   let sqltotal = `SELECT COUNT(*) AS total FROM sys_dict_type;`
                    // 查询数据库并返回数据
                    connectionPool.query(sqltotal, (errtotal, rows) => {
                        let total = rows[0]['total'];
                        if (errtotal) {
                            console.error('Error querying database:', err);
                            res.status(500).json({ error: 'Internal server error' });
                            return;
                        } else {
                            res.send({
                                total: total,
                                code: 200,
                                data: convertToCamelCase(results),
                                message:'查询成功！',
                            });
                        }
                    });
            }else{
                 res.send({
                    total: 0,
                    code: 200,
                    data: [],
                    message:'查询成功！',
                });
            }
        }
    });
});

// 查询接口
router.get('/optionselect', (req, res) => {

    console.log(req.query, 'req.query');
  
    const { dict_name, dict_type, status,begin_time,end_time} = convertKeysToSnakeCase(req.query);

    let query = `SELECT * FROM sys_dict_type`;

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


// 获取详情 
router.get('/:id', (req, res) => {
    // console.log(req.query,'req.query');
    console.log(req,'req');
    const { id } = req.params;
    const values = [id];
    let query = 'SELECT * FROM  sys_dict_type WHERE dict_id = ?';
    connectionPool.query(query, values, (err, results) => {
       // console.log(err,'err');
        console.log(results,'results');
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.send({
            code: 200,
            data: results ? convertToCamelCase(results[0]) : [],
        });
    });
}); 


// 新增  POST dictType
router.post('/', (req, res) => {
  const insertSql = 'INSERT INTO sys_dict_type SET ?'; // 准备 SQL 插入语句
  const {dict_name, dict_type, status, create_by, create_time, update_by, update_time, remark} = convertKeysToSnakeCase(req.body);
  const postData = {dict_name, dict_type, status, create_by, create_time, update_by, update_time, remark};
  addApi(insertSql,res,postData);
});

// 更新接口 
router.put('/', (req, res) => {
  // console.log(req,'req');
  const { dict_name, dict_type, status, update_by, update_time, remark ,dict_id} = convertKeysToSnakeCase(req.body);
  const updatevalues = {dict_name, dict_type, status, update_by, update_time, remark};
  let updateSql='UPDATE sys_dict_type SET ? WHERE dict_id = ?';
  updateApi(updateSql,[updatevalues, dict_id],res);
});


// 删除用户数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    const values = [id];
    const sql = "DELETE FROM sys_dict_type WHERE dict_id = ?";
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
    const dict_id = parseInt(req.params.id);
    const status = req.body.state;

    const query = 'UPDATE sys_dict_type SET status = ? WHERE dict_id = ?';
    connectionPool.query(query, [status, dict_id], (error, results, fields) => {
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