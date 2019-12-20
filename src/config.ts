interface IConfig {
    baseUrl?: string,
    /**连接（短链） */
    subUrl?: {
        [propName: string]: string
    },
    method?: 'POST'|'GET';
    header?: any;
    dataType?: string,
    /**最大并发 */
    maxLink?: number,
    response?: {
        /**取消请求的回调对象 */
        abort: {errMsg: string, rcode: number, scode: number},
        /**请求超时 */
        timeout: {errMsg: string, rcode: number, scode: number }
    }
}


export const Config: IConfig = {
    baseUrl: 'https://fhdowx.xyy001.com',
    method: 'POST',
    header: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    maxLink: 8, // 并发请求
    response: {
        abort: {errMsg: 'request:fail abort', rcode: -1, scode: -2 }, // 取消请求的回调对象
        timeout: {errMsg: 'request:fail timeout', rcode: -1, scode: -3 } // 请求超时
    }
};

export const SetConfig = (params: IConfig={}) => {
    if (typeof params === 'object') {
        Object.keys(params).forEach((e)=> {
            Config[e] = params[e];
        });
    }
}