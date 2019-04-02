import wepy from 'wepy';
import Request from './wx-request/index';

Request.config.set({
    baseUrl: 'https://fhdowx.xyy001.com',
    subUrl: {
        fhk: 'http://fhk.fhd001.com'
    }
});

/**
 * 请求前
 */
Request.interceptors.request.use(
    /**
     * 扩展
     * @param {Object} options subUrl, baseUrl, noBaseUrl, noToken
     * @param {String} options.baseUrl 配置baseUrl,可以为https开头的,可以为config配置的subUrl的key
     * @param {Boolean} [options.noBaseUrl=false] 不需要baseUrl,登记高于baseUrl
     * @param {Boolean} [options.noToken=false] 设置发送的data中不需要token
     */
    async (ctx) => {
        let {options, data} = ctx;
        if (typeof options.baseUrl === 'string') {
            if (options.baseUrl.indexOf('http') !== 0) {
                options.baseUrl = Request.config.subUrl[options.baseUrl]
                    ? Request.config.subUrl[options.baseUrl]
                    : Request.config.baseUrl;
            }
        } else {
            options.baseUrl = Request.config.baseUrl;
        }
        if (options.noBaseUrl) {
            options.baseUrl = '';
        }
        if (!options.noToken) {
            data.token = wepy.$instance.globalData.token;
        }
    }
);

const complete = function ({source}) {

};

/**
 * 响应成功
 */
Request.interceptors.response.success.use(
    async ({data, source}) => {
        if (!data) {
            return data;
        }

        if (data.scode === 3 && source.url.indexOf('/system/getTime.do') === -1) {
            // 维护模式
        }
        if (data.scode === 103) {
            // token失效
        }
        if (data.rcode !== 0 || data.scode !== 0) {
            return Promise.reject(data);
        }
        return data;
    }
);

/**
 * 响应失败
 * 注意了 statusCode
 */
Request.interceptors.response.fail.use(
    async (ctx) => {
        let errMsg = ((code) => {
            if (!code) {
                return '网络连接错误';
            }
            return ctx.statusCode === 404 ? '接口不存在 404!' : `网络超时: ${ctx.statusCode}`;
        })(ctx.statusCode);

        wx.showToast({
            title: errMsg,
            icon: 'none',
            duration: 2000
        });
        return Promise.reject({
            rcode: -1,
            scode: -1,
            errMsg: errMsg + ' ' + ctx.errMsg,
            statusCode: ctx.statusCode || 0
        });
    }
);

export default Request;
