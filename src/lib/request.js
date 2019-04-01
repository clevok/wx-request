const { wxRequest } = require('./fetch');
const { config } = require('../config');
const interceptors = require('../interceptors');


/**
 *  网络请求
 *
 * @param {string}  url 请求url
 * @param {object}  data 表单内容
 *
 * @param {object}  options 扩展属性
 * @param {string}  [options.method='POST'] method
 * @param {boolean} [options.noToken=false] 不需要token
 * @param {boolean} [options.noBaseUrl=false] 不需要baseUrl
 * @returns
 */
const request = function (url, data = {}, options = {}) {
    let ctx = {
        url, data: data || {}, options: options || {}
    };
    let result = null;
    let abort = null; // 为了及时抛出请求

    let start = new Promise(async (resolve, reject) => {
        await interceptors.request.done(ctx);
        if (abort) {
            return resolve(interceptors.response.fail.done(config.response.abort));
        }
        
        result = wxRequest(ctx.url, ctx.data, ctx.options);
        try {
            result = await result;
        } catch (error) {
            result = null;
            return resolve(interceptors.response.fail.done(error));
        }

        return resolve(interceptors.response.success.done(result));
    });
    start.abort = async function () {
        abort = true;
        if (!result) return;
        if (typeof result.abort === 'function') {
            result.abort();
        }
        result = null;
    };
    return start;
};

['get', 'put', 'post', 'delete'].forEach(type => {
    request[type] = (url, data, options = {}) => {
        return request(url, data, Object.assign(options, {method: type}));
    };
});

module.exports = request;
