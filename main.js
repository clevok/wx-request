import Request from './src/index';
Request.config.set({
    baseUrl: "https://mianjiba.com/"
});

/**
 * 请求前
 */
Request.interceptors.request.use(
    /**
     * 扩展 subUrl, baseUrl, noBaseUrl
     * @return {Object} {option.baseUrl} 配置baseUrl
     * @param {Object} ctx
     */
    async (ctx) => {
        let {options} = ctx;
        if (typeof options.baseUrl === 'string') {
            if (options.baseUrl.indexOf('http') !== 0) {
                options.baseUrl = Request.config.subUrl[options.baseUrl] ? 
                    Request.config.subUrl[options.baseUrl] 
                    : Request.config.baseUrl;
            }
        } else {
            options.baseUrl = Request.config.baseUrl;
        }

        if (options.noBaseUrl) {
            options.baseUrl = '';
        }
    }
);

/**
 * 响应成功
 */
Request.interceptors.response.success.use(
    async (ctx) => {
        return ctx.data;
    }
);

/**
 * 响应失败
 * 注意了 statusCode
 */
Request.interceptors.response.fail.use(
    async (ctx) => {
        return Promise.reject({rcode: -1, scode: -1, statusCode: ctx.statusCode});
    }
);

export default Request;