/**
 *  网络请求
 * @param {string}  url 请求url
 * @param {object}  data 表单内容
 * @param {object}  options 扩展属性
 * @param {string}  [options.method='POST'] method
 * @param {boolean} [options.noBaseUrl=false] 不需要baseUrl
 * @returns {Promise<{data:any,rcode:number,scode:number,nowTime:number,status:{[propName: string]: any}}>}
 */
export default function Request(url: string, data?: {
    [propName: string]: any;
}, options?: {
    /**基础url */
    baseUrl?: string;
    /**发送类型 */
    method?: 'POST' | 'GET';
    /**不需要加baseUrl? */
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
