/**
 * 在请求基础上封装, 用于控制请求数量
 */
declare function LoopRequest(...params: any[]): Promise<unknown>;
export declare const wxRequest: typeof LoopRequest;
export {};
