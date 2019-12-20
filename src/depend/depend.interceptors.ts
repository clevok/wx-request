import Compose from '@clevok/compose';
import { Config, RequestOptions } from './depend.config';
import { IRequestOptions } from '../interface/interface.config';
import { ICtx, ICtxFail, ICtxSuccess } from '../interface/interface.interceptors';

export interface IMiddle<P> {
    (ctx: P, next: () => Promise<any>): any
}

function getCompose<T>() {
    const middle: IMiddle<T>[] = [];
    const reuslt = Compose(middle);

    return {
        use (...args: IMiddle<T>[]) {
            args.forEach(mid => {
                middle.push(mid);
            });
            return this;
        },
        done (ctx: T) {
            return reuslt(ctx, () => {
                return ctx;
            })
        }
    }
}


/**
 * 拦截器
 */
export const Interceptors = {
    request: getCompose<ICtx>(),
    response: {
        success: getCompose<ICtxSuccess>(),
        fail: getCompose<ICtxFail>()
    }
}


/**
 *
 * 默认初始一些拦截器
 */
Interceptors.request.use(({options}, next) => {


    /**
     *
     * 补全options
     */
    Object.keys(RequestOptions).forEach(key => {
        let _key : keyof IRequestOptions = key as any;
        if (!options[key]) {
            options[key] = RequestOptions[_key];
        }
    });


    /**
     *
     * 修复 baseUrl
     * 尝试替换 baseUrl 中的 短链
     */
    if (options.baseUrl && typeof options.baseUrl === 'string') {
        if (options.baseUrl.indexOf('http') !== 0) {
            options.baseUrl = Config.subUrl[options.baseUrl]
                ? Config.subUrl[options.baseUrl]
                : options.baseUrl;
        }
    }


    next();
});
