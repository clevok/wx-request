import { Interceptors } from '../tool/src/index';
import Actions from '@clevok/actions';

Interceptors.request.use(
    ({data, options}, next) => {
        options.extends = {
            'startTime': Date.now()
        };
        if (options.noBaseUrl) {
            options.baseUrl = '';
        }
        if (!options.noToken) {
            data.token = 'wepy.$instance.globalData.token';
        }
        return next();
    },

    /**
     * beta接口, referer设置
     */
    async (ctx, next) => {
        let {data} = ctx;
        if (!data.referer) {
            data.referer = 'fhy';
        }
        next();
    }
);

const company = ({source, data: {data}}, next) => {
    if (source.options.baseUrl.indexOf('click.xyy001.com') !== -1) {
        return next();
    }
    const time = new Date();
    const timeCelc = time.getTime() - source.options.extends.startTime;
    let arr = [
        [`${source.url} , 响应耗时: ${timeCelc}`],
        [`请求参数: `, source.data],
        [`响应参数: `,data]
    ];
    let isError = false;

    if ( !data || data.scode !== 0 || data.rcode !== 0) {
        isError = true
    } else {
        isError = false
    }

    let done = (msg: string[]) => {
        isError ? console.error(...msg) : console.log(...msg)
    }
    done(['---------------------start------------------------']);
    arr.forEach(msgs => {
        done(msgs)
    });
    done(['----------------------end--------------------------']);
    return next();
};

Interceptors.response.success.use(
    company,
    async ({data, source}) => {
        if (!data) return data;

        let callbackData = data.data;

        // 维护模式
        if (callbackData.scode === 3 && source.url.indexOf('/system/getTime.do') === -1) {
            wx.reLaunch({
                url: '/pages/system/updating'
            });
        }

        // token失效
        let fhdIndex = source.options.baseUrl.indexOf('fhdowx.xyy001.com');
        if ( ( fhdIndex !== -1 && callbackData.scode === 103)
                || (fhdIndex === -1 && callbackData.scode === 6 ) ) {

            try {
                await Actions.Model.select('登录凭证过期', '重新登录');
            } catch (error) {
                return Promise.reject(data);
            }
            wx.reLaunch({
                url: '/pages/index'
            });
        }

        if (callbackData.rcode !== 0 || callbackData.scode !== 0) {
            return Promise.reject(callbackData);
        }
        return callbackData;
    }
)

Interceptors.response.fail.use(
    company,
    async (ctx) => {
        let errMsg = ((code) => {
            if (!code) {
                return '网络连接错误';
            }
            return ctx.data.statusCode === 404 ? '接口不存在 404!' : `网络超时: ${ctx.data.statusCode}`;
        })(ctx.data.statusCode);

        wx.showToast({
            title: errMsg,
            icon: 'none',
            duration: 2000
        });
        return Promise.reject({
            rcode: -1,
            scode: -1,
            errMsg: errMsg + ' ' + ctx.data.errMsg,
            statusCode: ctx.data.statusCode || 0
        });
    }
)
