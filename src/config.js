const config = {
    baseUrl: 'https://fhdowx.xyy001.com',
    subUrl: {
        fhk: 'http://fhk.fhd001.com'
    },
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

/**
 * 拦截器
 */
const interceptors = {
    /**
     * 请求之前
     * @param {boolean} [ctx.options.noToken=false] 扩展
     */
    request: [
        /**
         * 扩展 subUrl, baseUrl
         * @return {Object} {option.baseUrl} 配置baseUrl
         * @param {Object} ctx
         */
        async (ctx) => {
            let {options} = ctx;
            if (typeof options.baseUrl === 'string') {
                if (options.baseUrl.indexOf('http') !== 0) {
                    options.baseUrl = config.subUrl[options.baseUrl] ? config.subUrl[options.baseUrl] : config.baseUrl;
                }
            } else {
                options.baseUrl = config.baseUrl;
            }
        },
        /**
         * 扩展 noBaseUrl
         * @return {Object} {option.noBaseUrl} noBaseUrl 不需要 baseUrl
         */
        async (ctx) => {
            let {options} = ctx;
            if (options.noBaseUrl) {
                options.baseUrl = '';
            }
        }
    ]
};

exports.config = config;
exports.interceptors = interceptors;
