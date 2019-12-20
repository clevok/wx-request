interface IConfig {
    baseUrl?: string;
    /**连接（短链） */
    subUrl?: {
        [propName: string]: string;
    };
    method?: 'POST' | 'GET';
    header?: any;
    dataType?: string;
    /**最大并发 */
    maxLink?: number;
    response?: {
        /**取消请求的回调对象 */
        abort: {
            errMsg: string;
            rcode: number;
            scode: number;
        };
        /**请求超时 */
        timeout: {
            errMsg: string;
            rcode: number;
            scode: number;
        };
    };
}
export declare const Config: IConfig;
export declare const SetConfig: (params?: IConfig) => void;
export {};
