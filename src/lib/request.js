const { wxRequest } = require('./fetch');
const { config } = require('../config');

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
        url, data, options
    };
    let result = null;
    let abort = null; // 为了及时抛出请求

    let start = new Promise(async (resolve, reject) => {
        await request.interceptors.request.done(ctx);
        if (abort) return resolve(request.interceptors.response.fail.done(config.response.abort || {errMsg: 'request:fail abort'}));

        result = wxRequest(ctx.url, ctx.data, ctx.options);
        try {
            result = await result;
        } catch (error) {
            result = null;
            return resolve(request.interceptors.response.fail.done(error));
        }
        return resolve(request.interceptors.response.success.done(result));
    });
    start.abort = async function () {
        abort = true;
        if (!result) return;
        if (typeof result.abort === 'function') {
            result.abort();
        };
        result = null;
    };
    return start;
};

['get', 'put', 'post', 'delete'].forEach(type => {
    request[type] = (url, data, options = {}) => {
        return request(url, data, Object.assign(options, {method: type}));
    };
});

request.interceptors = {};
request.interceptors.request = {
    list: [],
    use () {
        [].forEach.call(arguments, (funs) => {
            if (typeof funs === 'function') {
                this.list.push(funs);
            }
        });
    },
    async done (ctx) {
        if (!this.list.length) {
            return ctx;
        }

        let l = this.list.length;
        for (let i = 0; i < l; i++) {
            // 如果 拦截器 没有 return 那将采用原对象;
            ctx = await this.list[i](ctx) || ctx;
        }
        return ctx;
    }
};
request.interceptors.response = {
    success: Object.assign({}, request.interceptors.request, {list: []}),
    fail: Object.assign({}, request.interceptors.request, {list: []})
};

module.exports = request;
