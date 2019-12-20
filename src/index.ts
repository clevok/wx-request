export { Config, SetConfig } from './depend/depend.config';
export { Interceptors } from './depend/depend.interceptors';
export { IMiddle } from './depend/depend.interceptors';

import { Interceptors } from './depend/depend.interceptors';
import { WxRequest } from './lib/request';
import { IRequestOptions } from './interface/interface.config';
import { IPro } from './interface/interface.request';
import { ICtx } from './interface/interface.interceptors';

/**
 * 请求request
 * @param url - 请求url
 * @param data - 属性对象
 * @param options - 扩展可选属性
 */
export function Request(url: string, data: any = {}, options: Partial<IRequestOptions> = {}): IPro {


    /**
     * 真正发出的请求
     */
    let wxRequest: any;


    /**
     * 回调promise
     */
    const Pro: any = new Promise(async (resolve, reject) => {

        /**
         * 指定类型
         */
        const requestParams = { url, data, options } as ICtx


        /**
         * 拦截器
         */
        await Interceptors.request.done(requestParams as any).catch(error => {
            if (error instanceof Error) console.error('拦截器异常', error);

            reject(error);
            return Promise.reject(error)
        });


        /**
         *
         * 提交请求申请
         */
        wxRequest = WxRequest(requestParams, (result) => {
            resolve(Interceptors.response.success.done({
                source: requestParams,
                data: result
            }));

        }, (error) => {


            /**
             * 失败永远 reject
             */
            Interceptors.response.fail.done({
                source: requestParams,
                data: error
            }).then(result => {
                reject(result)
            }).catch(error => {
                reject(error);
            });

        });

    });


    /**
     *
     * 附加 abort 方法
     */
    Pro.abort = () => {
        wxRequest && wxRequest.abort && wxRequest.abort();
    }
    return Pro;
}

export default Request;
