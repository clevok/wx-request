/**
 * @file simpleKoa application对象
 */

class Connect {
    /**
     * 构造函数
     */
    constructor() {
        this.middlewares = [];
    }

    /**
     * 中间件挂载
     * @param {Function} middleware 中间件函数
     */
    use () {
        this.middlewares.push(...arguments);
    }

    /**
     * 中间件合并方法，将中间件数组合并为一个中间件
     * @return {Function}
     */
    compose() {
        // 将middlewares合并为一个函数，该函数接收一个ctx对象
        return async ctx => {
            function createNext(middleware, oldNext) {
                return () => {
                    return middleware(...ctx, oldNext);
                }
            }

            let len = this.middlewares.length;
            let next = () => {
                return Promise.resolve();
            };
            for (let i = len - 1; i >= 0; i--) {
                let currentMiddleware = this.middlewares[i];
                next = createNext(currentMiddleware, next);
            }

            return next();
        };
    }

    done() {
        return this.compose()(arguments);
    }
}

module.exports = Connect;
export default Connect;