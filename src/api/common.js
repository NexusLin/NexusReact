import request from '@/utils/request.js'

// 获取网站信息
export function getqueryWebInfo(params) {
    return request({
        url: '/websiteBaseConfigure/queryWebInfo',
        method: 'get',
        params
    })
}