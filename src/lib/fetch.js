const { config } = require('../config');
const loop = new (require('./loop'))(config.maxLink);

/**
 * 请求
 */
function wxRequest (url, data={}, options = {}) {
    let request = null;

    let pro = new Promise((resolve, reject) => {
        request = wx.request({
            url: options.baseUrl+url,
            data,
            methods: options.methods || 'POST',
            dataType: options.dataType || 'json',
            header: options.header || {},
            success (res) {
                return resolve(res);
            },
            fail (res) {
                if (res.errMsg === 'request:fail abort') {
                    res = config.response.abort||{errMsg: 'request:fail abort'};
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
        if ('abort' in request) {
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

    let pro = new Promise(( resolve, reject ) => {
        result = loop.put(async (finsh)=> {
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
            return reject(config.response.abort||{errMsg: 'request:fail abort'});
        };
    });
    pro.abort = () => {
        if (request) return request.abort();

        if (!result) return;
        if ('abort' in result) {
            result.remove();
        }
        result = null;
    };
    return pro;
}

exports.wxRequest = LoopRequest;