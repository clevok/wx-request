/**
 * @file simpleKoa application对象
 */
export default class Connect {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 中间件挂载
     * @param {Function} middleware 中间件函数
     */
    use(...params: any[]): void;
    /**
     * 中间件合并方法，将中间件数组合并为一个中间件
     * @return {Function}
     */
    compose(): (ctx: any) => Promise<void>;
    done(...params: any[]): Promise<void>;
}
