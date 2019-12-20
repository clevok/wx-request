"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compose_1 = require("@clevok/compose");
var depend_config_1 = require("./depend.config");
function getCompose() {
    var middle = [];
    var reuslt = compose_1.default(middle);
    return {
        use: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            args.forEach(function (mid) {
                middle.push(mid);
            });
            return this;
        },
        done: function (ctx) {
            return reuslt(ctx, function () {
                return ctx;
            });
        }
    };
}
/**
 * 拦截器
 */
exports.Interceptors = {
    request: getCompose(),
    response: {
        success: getCompose(),
        fail: getCompose()
    }
};
/**
 *
 * 默认初始一些拦截器
 */
exports.Interceptors.request.use(function (_a, next) {
    var options = _a.options;
    /**
     *
     * 补全options
     */
    Object.keys(depend_config_1.RequestOptions).forEach(function (key) {
        var _key = key;
        if (!options[key]) {
            options[key] = depend_config_1.RequestOptions[_key];
        }
    });
    /**
     *
     * 修复 baseUrl
     * 尝试替换 baseUrl 中的 短链
     */
    if (options.baseUrl && typeof options.baseUrl === 'string') {
        if (options.baseUrl.indexOf('http') !== 0) {
            options.baseUrl = depend_config_1.Config.subUrl[options.baseUrl]
                ? depend_config_1.Config.subUrl[options.baseUrl]
                : options.baseUrl;
        }
    }
    next();
});
