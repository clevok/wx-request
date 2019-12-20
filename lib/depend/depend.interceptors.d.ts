/// <reference types="wechat-miniprogram" />
import { ICtx, ICtxFail, ICtxSuccess } from '../interface/interface.interceptors';
export interface IMiddle<P> {
    (ctx: P, next: () => Promise<any>): any;
}
/**
 * 拦截器
 */
export declare const Interceptors: {
    request: {
        use(...args: IMiddle<ICtx>[]): any;
        done(ctx: ICtx): Promise<any>;
    };
    response: {
        success: {
            use(...args: IMiddle<ICtxSuccess>[]): any;
            done(ctx: ICtxSuccess): Promise<any>;
        };
        fail: {
            use(...args: IMiddle<ICtxFail>[]): any;
            done(ctx: ICtxFail): Promise<any>;
        };
    };
};
