module.exports = {
    baseUrl: 'https://fhdowx.xyy001.com',
    header: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    maxLink: 8, // 并发请求
    response: {
        abort: {errMsg: 'request:fail abort', rcode: -1, scode: -2 }, // 取消请求的回调对象
        timeout: {errMsg: 'request:fail timeout', rcode: -1, scode: -3 } // 请求超时
    }
};