import { Config } from '../config';
import Loop from './loop';
const loop = new Loop(Config.maxLink);


/**
 * 请求
 */
function _wxRequest (url: string, data = {}, options = {}) {
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
                res.statusCode = 0;
                if (res.errMsg === 'request:fail abort') {
                    res = Config.response.abort;
                }
                if (res.errMsg === 'request:fail timeout') {
                    res = Config.response.timeout;
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
function LoopRequest (...params: any[]) {
    let result = null;
    let request = null;

    let pro = new Promise((resolve, reject) => {
        result = loop.put(async (finsh) => {
            request = _wxRequest(...params);
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
            return reject(Config.response.abort);
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

export const wxRequest = LoopRequest;
