const request = require('./lib/request');
const { config, interceptors } = require('./config');

request.interceptors.request.use(
    async(ctx) => {
        ctx.options = {
            baseUrl: ctx.options.baseUrl || config.baseUrl,
            methods: ctx.options.methods || config.methods || 'POST',
            header: ctx.options.header || config.header || {},
            dataType: ctx.options.dataType || config.dataType || 'json',
            noBaseUrl: false
        };
    },
    ...interceptors.request,
    async (ctx) => {
        let {options} = ctx;
        if (options.noBaseUrl) ctx.options.baseUrl = '';
    }
);

request.interceptors.response.success.use(...interceptors.response);

/**
 * 监听请求失败, 请求抛出
 */
request.interceptors.response.fail.use(async (ctx) => {
    return Promise.reject(ctx);
});

/**
 *  网络请求
 *
 * @param {string}  url 请求url
 * @param {object}  data 表单内容
 *
 * @param {object}  options 扩展属性
 * @param {boolean} options.baseUrl
 * @param {string}  [options.methods='POST'] methods
 * @param {string}  [options.header={}] header
 * @param {boolean} [options.dataType=json] dataType
 * @param {boolean} [options.noBaseUrl=false] 本地扩展
 */
module.exports = request;
