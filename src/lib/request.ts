import { wxRequest } from './fetch';
import {Interceptors} from './interceptors';
import { Config } from '../config';

/**
 *  网络请求
 * @param {string}  url 请求url
 * @param {object}  data 表单内容
 * @param {object}  options 扩展属性
 * @param {string}  [options.method='POST'] method
 * @param {boolean} [options.noBaseUrl=false] 不需要baseUrl
 * @returns {Promise<{data:any,rcode:number,scode:number,nowTime:number,status:{[propName: string]: any}}>}
 */
export default function Request (url: string, data?: {
    [propName: string]: any;
}, options?: {
    /**基础url */
    baseUrl?: string;
    /**发送类型 */
    method?: 'POST' | 'GET';
    /**不需要加baseUrl? */
    noBaseUrl?: boolean;
}): Promise<{
    data: any;
    rcode: number;
    scode: number;
    nowTime: number;
    status: {
        [propName: string]: any;
    };
}> {
    let ctx = {
        url, data: data || {}, options: options || {}
    };
    let result = null;
    let abort = null; // 为了及时抛出请求

    let start = new Promise(async (resolve, reject) => {
        await Interceptors.request.done(ctx).catch(error => {
            errThrow(error);
            return resolve(Interceptors.response.fail.done(assignRequest(error, ctx)));
        });
        if (abort) {
            return resolve(Interceptors.response.fail.done(assignRequest(Config.response.abort, ctx)));
        }

        result = wxRequest(ctx.url, ctx.data, ctx.options);
        try {
            result = await result;
        } catch (error) {
            result = null;
            return resolve(Interceptors.response.fail.done(assignRequest(error, ctx)));
        }

        return resolve(Interceptors.response.success.done(assignRequest(result, ctx)));
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
    Request[type] = (url, data, options = {}) => {
        return Request(url, data, Object.assign(options, {method: type}));
    };
});

const assignRequest = (obj, ctx) => {
    return Object.assign(obj, {source: ctx});
};

const errThrow = (error) => {
    if (error instanceof Error) {
        console.error('拦截器异常', error);
    }
};
