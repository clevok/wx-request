import { IConfig, IRequestOptions } from '../interface/interface.config';

/**
 * 补全请求options
 */
export const RequestOptions: IRequestOptions = {
    /** 基本请求url */
    baseUrl: 'https://fhdowx.xyy001.com',

    header: {},

    method: 'POST',

    dataType: 'json',

    responseType: 'text',

    /** 超时事件不能超过app配置 */
    abortTime: 15000,
}

export const Config: IConfig = {
    /** 分支baseUrl */
    subUrl: {
        common: 'https://common.fhd001.com',
        fhd: 'https://fhdowx.xyy001.com',
        fhy: 'https://fhyapi.fhd001.com',
        fhk: 'https://fhkapi.fhd001.com',
        click: 'https://click.xyy001.com'
    },

    /** 最大队列 */
    maxLink: 6,

    response: {
        /** 取消请求的回调对象 */
        abort: {errMsg: 'request:fail abort', rcode: -1, scode: -1000, statusCode: 500 },

        /** 请求超时 */
        timeout: {errMsg: 'request:fail timeout', rcode: -1, scode: -1001, statusCode: 500 }
    }
}

interface ISetConfig {
    /** 请求url */
    baseUrl: string,

    header: Object,

    method: 'OPTIONS'
            | 'GET'
            | 'HEAD'
            | 'POST'
            | 'PUT'
            | 'DELETE'
            | 'TRACE'
            | 'CONNECT',
    dataType: 'json',

    responseType: 'text' | 'arraybuffer',

    /** 超时事件,不能超过app配置的network时间 */
    abortTime: number,

    /** 最大发起请求数 */
    maxLink: number;

    /** baseUrl 简称 */
    subUrl: {
        [urlKey: string]: string
    },

    response: {
        /** 取消请求的回调对象 */
        abort: {errMsg: string, rcode: number, scode: number, statusCode: number },
        /** 请求超时 */
        timeout: {errMsg: string, rcode: number, scode: number, statusCode: number}
    }
}
export const SetConfig = (params: ISetConfig) => {
    Object.keys(params).forEach(key => {
        if (key in RequestOptions) {
            if (typeof RequestOptions[key] === 'object') {
                Object.assign(RequestOptions[key], params[key])
            } else {
                RequestOptions[key] = params[key];
            }
        }
        if (key in Config) {
            if (typeof Config[key] === 'object') {
                Object.assign(Config[key], params[key])
            } else {
                Config[key] = params[key];
            }
        }
    });
}
