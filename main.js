import Request from './src/index';
// Request.config.set({
//     baseUrl: 'https://fhdowx.xyy001.com',
//     subUrl: {
//         fhk: 'http://fhk.fhd001.com'
//     }
// });

Request.interceptors.request.use(
    /**
     * 扩展 subUrl, baseUrl
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
);

Request.interceptors.response.success.use(
    async (ctx) => {
        return ctx.data;
    },
    async (ctx) => {
        ctx;
        debugger;
    }
);

Request.interceptors.response.fail.use(
    async (ctx) => {
        ctx;
        debugger;
    }
);

export default Request;