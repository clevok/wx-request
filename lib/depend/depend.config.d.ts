/// <reference types="wechat-miniprogram" />
import { IConfig, IRequestOptions } from '../interface/interface.config';
/**
 * 补全请求options
 */
export declare const RequestOptions: IRequestOptions;
export declare const Config: IConfig;
interface ISetConfig {
    /** 请求url */
    baseUrl?: string;
    header?: Object;
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
    dataType?: 'json';
    responseType?: 'text' | 'arraybuffer';
    /** 超时事件,不能超过app配置的network时间 */
    abortTime?: number;
    /** baseUrl 简称 */
    subUrl?: {
        [urlKey: string]: string;
    };
    response?: {
        /** 取消请求的回调对象 */
        abort?: {
            errMsg: string;
            rcode: number;
            scode: number;
            statusCode: number;
        };
        /** 请求超时 */
        timeout?: {
            errMsg: string;
            rcode: number;
            scode: number;
            statusCode: number;
        };
    };
}
/**
 *
 * 配置设置
 * @param params
 */
export declare const SetConfig: (params: ISetConfig) => void;
export {};
