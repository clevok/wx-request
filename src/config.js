exports.config = {
    baseUrl: 'https://fhdowx.xyy001.com',
    header: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    maxLink: 2, // 并发请求
    response: {
        abort: {errMsg: '取消请求'} // 取消请求的回调对象
    }
};

/**
 * 拦截器
 */
exports.interceptors = {

    /**
     * 请求之前
     * @param {boolean} [ctx.options.noToken=false] 扩展
     */
    request: [
        async (ctx) => {
            let {options} = ctx;
            if (options.noToken) {
                ctx.data.token = '';
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
