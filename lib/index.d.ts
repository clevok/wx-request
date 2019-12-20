/// <reference types="wechat-miniprogram" />
export { Config, SetConfig } from './depend/depend.config';
export { Interceptors } from './depend/depend.interceptors';
export { IMiddle } from './depend/depend.interceptors';
import { IRequestOptions } from './interface/interface.config';
import { IPro } from './interface/interface.request';
/**
 * 请求request
 * @param url - 请求url
 * @param data - 属性对象
 * @param options - 扩展可选属性
 */
export declare function Request(url: string, data?: any, options?: Partial<IRequestOptions>): IPro;
export default Request;
