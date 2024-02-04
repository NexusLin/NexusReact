import request from '@/utils/request.js'

// 获取网站信息
export function getqueryWebInfo(params) {
    return request({
        url: '/websiteBaseConfigure/queryWebInfo',
        method: 'get',
        params
    })
}

  //获取图形验证码的接口
export function getRandomImage(params) {
    return request({
        url: '/sys/randomImage'+`/${params}`,
        method: 'get',
    })
}

  //登录接口
  export function getLogin(data) {
    return request({
        url: '/sys/login',
        method: 'POST',
        data,
    })
}

