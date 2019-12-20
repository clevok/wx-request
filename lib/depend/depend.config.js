"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 请求 options 必有选项
 */
exports.RequestOptions = {
    /** 基本请求url */
    baseUrl: 'https://fhdowx.xyy001.com',
    header: {},
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    /** 超时事件不能超过app配置 */
    abortTime: 15000,
};
exports.Config = {
    /** 最大队列 */
    maxLink: 6,
    /** 基本请求url */
    baseUrl: 'https://fhdowx.xyy001.com',
    /** 分支baseUrl */
    subUrl: {
        common: 'https://common.fhd001.com',
        fhd: 'https://fhdowx.xyy001.com',
        fhy: 'https://fhyapi.fhd001.com',
        fhk: 'https://fhkapi.fhd001.com',
        click: 'https://click.xyy001.com'
    },
    response: {
        /** 取消请求的回调对象 */
        abort: { errMsg: 'request:fail abort', rcode: -1, scode: -1000, statusCode: 500 },
        /** 请求超时 */
        timeout: { errMsg: 'request:fail timeout', rcode: -1, scode: -1001, statusCode: 500 }
    }
};
exports.SetConfig = function () {
};
