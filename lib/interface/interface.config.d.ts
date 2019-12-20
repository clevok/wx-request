/// <reference types="wechat-miniprogram" />
/**
 * 请求进入参数
 */
export interface IRequestOptions {
    /** 请求url */
    baseUrl: string;
    header: Object;
    method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
    dataType: 'json';
    responseType: 'text' | 'arraybuffer';
    /** 超时事件,不能超过app配置的network时间 */
    abortTime: number;
}
/**
 * 默认配置
 */
export interface IConfig {
    /** 最大发起请求数 */
    maxLink: number;
    /** baseUrl 简称 */
    subUrl: {
        [urlKey: string]: string;
    };
    response: {
        /** 取消请求的回调对象 */
        abort: {
            errMsg: string;
            rcode: number;
            scode: number;
            statusCode: number;
        };
        /** 请求超时 */
        timeout: {
            errMsg: string;
            rcode: number;
            scode: number;
            statusCode: number;
        };
    };
}
