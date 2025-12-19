// utils/resmsg.js
module.exports = {
  // 成功的响应格式
  message(code = 200,message = '操作成功',res) {
    return res.send({
        code: code,
        msg:message,
    })
  },
};