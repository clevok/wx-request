/// <reference types="wechat-miniprogram" />
import { IRequestOptions } from '../interface/interface.config';
import { IResponseFail } from '../interface/interface.request';
/**
 * statusCode 不为 200 都是失败
 */
export declare const WxRequest: (ctx: {
    url: string;
    data: string | Object;
    options: IRequestOptions;
}, success: (params: WechatMiniprogram.RequestSuccessCallbackResult) => void, fail: (params: IResponseFail) => void) => {
    abort: () => void;
};
