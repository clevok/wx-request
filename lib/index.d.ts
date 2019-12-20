import request from './lib/request';
export { Interceptors } from './lib/interceptors';
export { Config, SetConfig } from './config';
/**
 * 网络请求
 * v0.0.1
 * 2019-04-02
 *
 * @param {string}  url 请求url
 * @param {object}  data 表单内容
 * @param {object}  options 扩展属性
 * @param {boolean} options.baseUrl
 * @param {string}  [options.method='POST'] method
 * @param {string}  [options.header={}] header
 * @param {boolean} [options.dataType=json] dataType
 */
export default request;
export declare const Request: typeof request;
