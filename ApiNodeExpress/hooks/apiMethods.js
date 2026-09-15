const connectionPool=require('../config/db'); // 引入数据库连接池模块
const {addCondition,addDateRangeCondition,addPagination,convertKeysToSnakeCase,convertToCamelCase}=require('./methods.js'); // 引入封装方法

// 查询接口
function listApi(queryData,sqltotalData,req,res,querySearch) {

    // 查询条件
    let querySearchData=querySearch;

    // 查询Sql
    let querySql=queryData;

    // 查询总条数
    let querySqltotal=sqltotalData;

    // console.log(querySqltotal,'分页条件---1');
    // console.log(query,sqltotal,querySearch,'查询');
    // console.log(querySearchData,'querySearchData');

    // 构建查询条件
    let params=[];
    let paramstotal=[];

    Object.keys(querySearchData).forEach(key => {
        // console.log(key, querySearchData[key]);  // 输出：key 和对应的值
        if(key!='page_num'&&key!='page_size') {
            querySql=addCondition(querySql,params,key,querySearchData[key]);
            querySqltotal=addCondition(querySqltotal,paramstotal,key,querySearchData[key]);
        }
    });

    if(querySearchData['page_num']&&querySearchData['page_size']) {
        // 确保 page_num 和 page_size 是有效的数字
        const pageNum=parseInt(querySearchData['page_num']);
        const pageSize=parseInt(querySearchData['page_size']);
        if(!isNaN(pageNum)&&pageNum>0&&!isNaN(pageSize)&&pageSize>0) {
            querySql=addPagination(querySql,params,pageNum,pageSize); // 分页条件
        }
    }
    // console.log(querySql,'查询条件---querySql1');
    // console.log(querySqltotal,'分页条件---2');


    // 查询数据库并返回数据
    connectionPool.query(querySql,params,(err,results) => {
        // console.log(results,'results');
        if(err) {
            console.log(err,'err----------错误日志');
            res.send({
                code: 500,
                data: results,
                msg: '查询失败！'
            });
            return;
        } else {
            // console.log('查询列表成功！',results);
            if(results.length>0) {
                // 查询数据库并返回数据
                // console.log('查询分页条件---3',querySqltotal);
                connectionPool.query(querySqltotal,params,(errtotal,rows) => {
                    let total=0;
                    if(rows) {total=rows[0]['total']}

                    if(errtotal) {
                        console.log(errtotal);
                        res.send({
                            code: 401,
                            // data: results,
                            msg: '查询失败！'
                        });
                        return;
                    } else {
                        console.log('查询成功');
                        res.send({
                            total: total,
                            code: 200,
                            data: convertToCamelCase(results),
                            msg: '查询成功！',
                        });
                    }
                });
            } else {
                res.send({
                    total: 0,
                    code: 200,
                    data: [],
                    msg: '查询成功！',
                });
            }
        }
    });
}

// 新增接口
function addApi(insertSql,res,postData) {
    connectionPool.query(insertSql,postData,(error,results,fields) => {
        if(error) {
            console.log(error);
            res.send({
                code: 500,
                error: error,
                msg: '添加失败！'
            });
            return;
        } else {
            res.send({
                code: 200,
                // data: results,
                msg: '添加成功！'
            });
            return;
        }
    });
}

// 详情接口
function getApi(querySql,values,res) {
    connectionPool.query(querySql,values,(err,results) => {
        if(err) {
            console.error('Error querying database:',err);
            res.status(500).json({error: 'Internal server error'});
            return;
        }
        res.json({
            code: 200,
            data: convertToCamelCase(results[0])||{},
        });
    });
}

// 更新接口
function updateApi(updateSql,Search,res) {
    connectionPool.query(updateSql,Search,(error,results,fields) => {
        if(error) {
            res.send({
                code: 500,
                // data: results,
                error: error,
                msg: '修改失败！'
            });
            return;
        } else {
            res.send({
                code: 200,
                // data: convertToCamelCase(results),
                msg: '修改成功！'
            });
        }
    });
}


// 删除接口
function delApi(delSql,delvalue,res,message) {
    connectionPool.query(delSql,delvalue,(error,results) => {
        if(error) {
            res.json({
                code: 400,
                error: error,
                msg: message? message:'删除失败！',
            });
            console.error('Error querying database:',error);
            // res.status(500).json({ error: error });
            return;
        }
        res.json({
            code: 200,
            // data: results,
            msg: '删除成功！',
        });
    });
}


// 更新状态接口
function changeStatusApi(statusSql,upvalue,res) {
    connectionPool.query(statusSql,upvalue,(error,results,fields) => {
        if(error) {
            res.json({
                code: 500,
                error: error,
                msg: '更改失败！',
            });
            return;
        } else {
            res.json({
                code: 200,
                // data: results,
                msg: '更改成功！',
            });
        }
    });
}

module.exports={
    listApi,
    addApi,
    getApi,
    updateApi,
    delApi,
    changeStatusApi
};