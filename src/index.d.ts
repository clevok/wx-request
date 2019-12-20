
/**
 *  网络请求
 * @param {string} url - 请求url
 * @param {object} data - 表单内容
 * @param {object} options - 扩展属性
 * @param {string} [options.method='POST'] - method
 * @param {boolean} [options.noToken=false] - 不需要token
 * @param {boolean} [options.noBaseUrl=false] - 不需要baseUrl
 * @returns {Promise<{data:any,rcode:number,scode:number,nowTime:number,status:{[propName: string]: any}}>}
 */
export declare function Request(url: string, data?: {
    [propName: string]: any;
}, options?: {
    baseUrl?: string;
    method?: 'POST' | 'GET';
    noToken?: boolean;
    noBaseUrl?: boolean;
}): Promise<{
    data: any;
    rcode: number;
    scode: number;
    nowTime: number;
    status: {
        [propName: string]: any;
    };
}>;

declare const _default: Request;
export default Request;

/**
 * 配置
 */
export declare const Config: {
    baseUrl?: string,
    /**连接（短链） */
    subUrl?: {
        [propName: string]: string
    }
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


/**
 * 设置配置
 * @param params
 */
export declare function SetConfig(params: Config): void;


/**
 * 拦截器
 */
export declare const Interceptors: {
    request: {
        use: (...params) => any
    },
    response: {
        success: {
            use: (...params) => any
        },
        fail: {
            use: (...params) => any
        }
    }
}
