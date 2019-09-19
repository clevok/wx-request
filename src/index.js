const request = require('./lib/request');
const config = require('./config');
const interceptors = require('./lib/interceptors');

interceptors.request.use(
    async(ctx, next) => {
        ctx.options = Object.assign({
            baseUrl: ctx.options.baseUrl || config.baseUrl,
            method: ctx.options.method || config.method || 'POST',
            header: ctx.options.header || config.header || {},
            dataType: ctx.options.dataType || config.dataType || 'json'
        }, ctx.options);
        return next();
    }
);

request.interceptors = interceptors;
request.config = config;
request.config.set = (params={}) => {
    if (typeof params === 'object') {
        Object.keys(params).forEach((e)=> {
            config[e] = params[e];
        });
    }
};

/**
 * 网络请求
 * v0.0.1
 * 2019-04-02
 *
 * @param {string}  url 请求url
 * @param {object}  data 表单内容
 * @param {object}  options 扩展属性
 * @param {boolean} options.baseUrl
 * @param {string}  [options.method='POST'] method
 * @param {string}  [options.header={}] header
 * @param {boolean} [options.dataType=json] dataType
 */
module.exports = request;
export default request;
