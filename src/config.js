import wepy from 'wepy';

const config = {
    baseUrl: 'https://fhdowx.xyy001.com',
    subUrl: {
        hello: 'https://hello.xyy001.com',
        demo: 'https://demo.xyy001.com'
    },
    header: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    maxLink: 8, // 并发请求
    response: {
        abort: {errMsg: 'request:fail abort', scode: -2, rcode: -1}, // 取消请求的回调对象
        timeout: {errMsg: 'request:fail timeout', scode: -3, rcode: -1} // 请求超时
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
         * baseUrl规则
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
        async (ctx) => {
            let {options} = ctx;
            if (!options.noToken) {
                ctx.data.token = wepy.$instance.globalData.token;
            }
        }
    ],

    // 请求之后
    response: [
        async (ctx) => {
            return ctx.data;
        },
        async (ctx) => {
            if (ctx.rcode !== 0 || ctx.scode !== 0) {
                return Promise.reject(ctx);
            }
        }
    ]
};

exports.config = config;
exports.interceptors = interceptors;
