//引入WebSocket信息
// 接口的公共部分
// 查询条件
function addCondition(query, params, condition, value) {
    // 排除 pageNum 和 pageSize
    if (condition !== 'pageNum' && condition !== 'pageSize' && value !== undefined && value !== '' && value !== null) {
        if (query.includes('WHERE')) {
            query += ` AND ${condition} = ?`;  // 如果已经有WHERE，使用AND连接
        } else {
            query += ` WHERE ${condition} = ?`;  // 如果没有WHERE，添加WHERE子句
        }
        params.push(value);
    }
    return query;
}


// 时间参数
function addDateRangeCondition(query, params, startTime, endTime) {
    if (startTime !== undefined && startTime !== '' && startTime !== null &&
        endTime !== undefined && endTime !== '' && endTime !== null) {
        query += params.length ? ' AND' : ' WHERE';
        query += ' create_time BETWEEN ? AND ?';
        params.push(startTime);
        params.push(endTime);
    }
    return query;
}


// 页码数和页条数
function addPagination(query, params, pageNum, pageSize) {
    // 判断 pageNum 和 pageSize 是否为有效的数字
    if (pageNum !== undefined && !isNaN(pageNum) && pageNum > 0 && pageSize !== undefined && !isNaN(pageSize) && pageSize > 0) {
        query += ' LIMIT ?, ?';
        let offset = (pageNum - 1) * pageSize;
        params.push(offset);
        params.push(parseInt(pageSize));
    } else {
        // 如果无效，去除 LIMIT 子句，或者你也可以在这里设置默认值
        query = query.replace(/ LIMIT \?, \?/, '');
    }
    return query;
}



// 判断日期字符串（ISO 8601 格式） "2024-12-12T01:07:41.000Z" 2024-12-27T08:02:03.000Z
function isValidISODate(str) {
    const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    return pattern.test(str);
}


// 判断格式 "2024-12-12 01:07:41"
function isValidDateTime(str) {
    const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return pattern.test(str);
}


// 格式化日期为 'YYYY-MM-DD HH:mm:ss' 格式
function formatDate(dateStr) {
    // 创建一个 Date 对象
    const date = new Date(dateStr);

    // 获取日期部分（年-月-日）
    const datePart = date.toISOString().split('T')[0]; // 获取 "2024-12-12"
    //获取时间部分（时:分:秒）
    const timePart = date.toISOString().split('T')[1].split('.')[0]; // 获取 "01:07:41"
    // 合并成你需要的格式
    return `${datePart} ${timePart}`;
}

function isTimeDate(obj) {
    if (!isValidISODate(obj) || !isValidDateTime(obj)) {
        return false
    }
}

// 驼峰命名法(前端使用)=>蛇形命名法(sql数据库使用)
function camelToSnake(str) {
    if(isTimeDate(str)){
        console.log(str,'str');
        return str
    }
    return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function convertKeysToSnakeCase(obj) {
    if (Array.isArray(obj)) {
        return obj.map(convertKeysToSnakeCase);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = camelToSnake(key);
            acc[newKey] = convertKeysToSnakeCase(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}


// 将蛇形命名法转换为驼峰命名法
function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
}
// 递归转换对象的所有键为驼峰命名法
function convertToCamelCase(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => convertToCamelCase(item)); // 对数组进行递归处理
    } else if (obj !== null && typeof obj == 'object') {
        const newObj = {};
        for (let key in obj) {
            // console.log(obj[key],'obj[key111]');
            if (obj.hasOwnProperty(key)) {
                const newKey = snakeToCamel(key);
                if(newKey=='createTime'||newKey=='updateTime'){
                    newObj[newKey] = formatDate(obj[key]);
                }else{
                  newObj[newKey] = obj[key];  
                }
            }
        }
       return newObj;
    }
    return obj;// 如果是基础数据类型，直接返回
}

module.exports = {
    addCondition,
    addDateRangeCondition,
    addPagination,
    convertKeysToSnakeCase,
    convertToCamelCase,
};