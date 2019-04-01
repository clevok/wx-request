const { config } = require('../config');
const loop = new (require('./loop'))(config.maxLink);

/**
 * 请求
 */
function wxRequest (url, data = {}, options = {}) {
    let request = null;

    let pro = new Promise((resolve, reject) => {
        let _url = url.indexOf('http') === 0 ? url : options.baseUrl + url;
        request = wx.request({
            url: _url,
            data,
            method: options.method || 'POST',
            dataType: options.dataType || 'json',
            header: options.header || {},
            success (res) {
                if (res.statusCode !== 200) {
                    return reject(res);
                }
                return resolve(res);
            },
            fail (res) {
                if (res.errMsg === 'request:fail abort') {
                    res = config.response.abort;
                }
                if (res.errMsg === 'request:fail timeout') {
                    res = config.response.timeout;
                }
                return reject(res);
            },
            complete () {
                request = null;
            }
        });
    });
    pro.abort = () => {
        if (!request) return;
        if (typeof request.abort === 'function') {
            request.abort();
        }
        request = null;
    };
    return pro;
}

/**
 * 在请求基础上封装, 用于控制请求数量
 */
function LoopRequest () {
    let result = null;
    let request = null;

    let pro = new Promise((resolve, reject) => {
        result = loop.put(async (finsh) => {
            request = wxRequest(...arguments);
            try {
                request = await request;
            } catch (error) {
                finsh();
                return reject(error);
            }
            finsh();
            return resolve(request);
        });
        result.remove = () => {
            result.abort();
            return reject(config.response.abort);
        };
    });
    pro.abort = () => {
        if (!result) return;

        // 已经 进入请求, 不需要 result的remove了
        if (request) return request.abort();
        if (typeof result.remove === 'function') {
            result.remove();
        }
        result = null;
    };
    return pro;
}

exports.wxRequest = LoopRequest;
