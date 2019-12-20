import {Loop, Queue} from '@clevok/task-queue';
import { Config } from '../depend/depend.config';
import { IRequestOptions } from '../interface/interface.config';
import { IResponseFail } from '../interface/interface.request';


/** 队列 */
const eventLoop = new Queue().addEventListener(new Loop(Config.maxLink))


/**
 * statusCode 不为 200 都是失败
 */
export const WxRequest = (

        /**
         * 请求数据
         */
        ctx: {url: string, data: string|Object, options: IRequestOptions},

        /**
         * 成功回调
         */
        success: (params: WechatMiniprogram.RequestSuccessCallbackResult) => void,

        /**
         * 失败回调
         */
        fail: (params: IResponseFail) => void

    ) => {

    let {url, data, options} = ctx;
    let request: WechatMiniprogram.RequestTask | null = null

    let requestLoop = eventLoop.push({

        abortTime: ctx.options.abortTime,

        abort () {
            return fail(Config.response.abort);
        },

        success (finshed) {

            /**
             * 补全url
             */
            if (url.indexOf('http') !== 0) {
                url = options.baseUrl + url;
            }

            request = wx.request({
                url: url,
                data: data || '',
                header: options.header || {},
                method: options.method || 'GET',
                dataType: options.dataType || 'json',
                responseType: options.responseType || 'text',
                success (res) {
                    if (res.statusCode !== 200) {
                        return fail(Object.assign(res, {
                            rcode: -1,
                            scode: -1
                        }));
                    }
                    return success(res);
                },
                fail (res) {
                    let callcack;
                    if (res.errMsg === 'request:fail abort') {
                        callcack = Config.response.abort;
                    } else if (res.errMsg === 'request:fail timeout') {
                        callcack = Config.response.timeout;
                    } else {
                        callcack = {
                            rcode: -1,
                            scode: -1,
                            statusCode: 500,
                            errMsg: res.errMsg
                        };
                    }
                    return fail(callcack);
                },
                complete () {
                    finshed();
                }
            });
        }
    });


    /***
     * 重写 abort 方法
     */
    const abort = requestLoop.abort;
    requestLoop.abort = () => {
        abort && abort();
        request && request.abort();
    }
    return requestLoop;
}
