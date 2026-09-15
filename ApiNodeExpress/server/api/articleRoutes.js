const express = require('express');
const router = express.Router();

const connectionPool = require('../../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase} = require('../../hooks/methods.js'); // 引入封装方法
const {listApi,getApi,addApi,updateApi,delApi,changeStatusApi} = require('../../hooks/apiMethods.js'); // 引入封装方法

// 文章接口部分
// 分页查询
// router.get('/', (req, res) => {
//     // console.log(req.query, 'req.query');
//     // console.log(req.body,'req.body');
//     // console.log(req.params,'req.params');
//     const { title,type, page_num, page_size } = convertKeysToSnakeCase(req.query);
//     let query = `SELECT * FROM articles`;
//     // 构建查询条件
//     const params = [];
//     query = addCondition(query, params, 'title', title); // 标题
//     query = addCondition(query, params, 'articletype', type);  // 类型
//     query = addPagination(query, params, page_num, page_size);  //分页条件

//     // console.log('文章查询条件', query, params);
//     // 查询数据库并返回数据
//     connectionPool.query(query,params, (err, results) => {
//         // console.log(err,'err');
//         // console.log(results,'results');
//         if (err) {
//             console.error('Error querying database:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         } else {
//             if(results.length>0){
//                    let sqltotal = `SELECT COUNT(*) AS total FROM articles;`
//                     // 查询数据库并返回数据
//                     connectionPool.query(sqltotal, (errtotal, rows) => {
//                         let total = rows[0]['total'];
//                         if (errtotal) {
//                             res.send({
//                                 code: 401,
//                                 // data: results,
//                                 message: '查询失败！'
//                             });
//                             return;
//                         } else {
//                             console.log('查询成功');
//                             res.send({
//                                 total: total,
//                                 code: 200,
//                                 data:convertToCamelCase(results),
//                                 message: '查询成功！',
//                             });
//                         }
//                     });
//             }else{
//                  res.send({
//                     total: 0,
//                     code: 200,
//                     data: [],
//                     message:'查询成功！',
//                 });
//             }
//         }
//     });
// });



//封装好的
// 查询列表
router.get('/',(req, res) => {
    // console.log(req.query, 'req.query');
    // console.log(req.body,'req.body');
    // console.log(req.params,'req.params');
    // 查询数据库列表
    let query = `SELECT * FROM articles`;
    // 查询数据库总数
    let sqltotal = `SELECT COUNT(*) AS total FROM articles`
     // 查询数据库并返回数据
    const { title,type,status, page_num, page_size } = convertKeysToSnakeCase(req.query);
    listApi(query,sqltotal,req,res,{title,type,status, page_num, page_size});
});


// 新增  POST
router.post('/', (req, res) => {
  const insertSql = 'INSERT INTO articles SET ?'; // 准备 SQL 插入语句
  const { title,author,type,content,thumburl} = convertKeysToSnakeCase(req.body);
  const postData = {title,author,type,status:1,content,thumburl};
  addApi(insertSql,res,postData);
});


// 获取详情 3
router.get('/:id', (req, res) => {
    console.log(req.query,'req.query');
    const { id } = req.params;
    const values = [id];
    let querySql = 'SELECT * FROM articles WHERE article_id = ?';
    getApi(querySql,values,res);
}); 

// 更新接口 
router.put('/', (req, res) => {
  // console.log(req.body,'req.body -----文章');
  const { title, content,type,article_id,thumburl} = convertKeysToSnakeCase(req.body);
  const updatevalues = {title, content,type,thumburl};
  let updateSql='UPDATE articles SET ? WHERE article_id = ?';
  updateApi(updateSql,[updatevalues, article_id],res);
});

// 删除数据 DELETE请求处理程序  
router.delete('/:id', (req, res) => {
    // const {id} = req.body; // 从请求体中获取数据
    const id = req.params.id;
    const delsql = "DELETE FROM articles WHERE article_id = ?";
    delApi(delsql,[id],res);
});


//  禁用和使用,用于更改状态
router.put('/status/:id', (req, res) => {
    // console.log(req.params,'req.params');
    // console.log(req.body,'req.body');
    const id = parseInt(req.params.id);
    const newState = req.body.status;
    const query = 'UPDATE articles SET status = ? WHERE article_id = ?';
    changeStatusApi(query,[newState, id],res);
});

// 在实际项目中，这里应该是更新数据库中用户的状态逻辑
// const user = users.find(user => user.id === userId);
// if (!user) {
//     return res.status(404).json({ message: 'User not found' });
// }
// user.state = newState;
// res.json({ message: 'User status updated successfully', user });
// 更新数据库中用户的状态
// const query = 'UPDATE user SET state = ? WHERE id = ?';
module.exports = router;