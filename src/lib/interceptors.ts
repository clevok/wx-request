import concat from './concat';
import {Config} from '../config';

export const Interceptors = {
    request: new concat(),
    response: {
        success: new concat(),
        fail: new concat()
    }
};

Interceptors.request.use(
    async(ctx:any , next: any) => {
        ctx.options = Object.assign({
            baseUrl: ctx.options.baseUrl || Config.baseUrl,
            method: ctx.options.method || Config.method || 'POST',
            header: ctx.options.header || Config.header || {},
            dataType: ctx.options.dataType || Config.dataType || 'json'
        }, ctx.options);
        return next();
    }
);