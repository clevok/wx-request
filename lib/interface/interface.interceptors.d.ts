import { IRequestOptions } from "./interface.config";
import { IResponseFail, IRequestSuccessCallbackResult } from './interface.request';
interface ICoptions extends IRequestOptions {
    [propName: string]: any;
}
/**
 * 拦截器ctx 请求前的类型
 */
export declare type ICtx = {
    url: string;
    data: any;
    options: ICoptions;
};
/**
 * 拦截器请求后的ctx类型
 */
export interface ICtxFail {
    source: ICtx;
    data: IResponseFail;
}
/**
 * 拦截器 请求成功的ctx类型
 */
export interface ICtxSuccess {
    source: ICtx;
    data: IRequestSuccessCallbackResult;
}
export {};
