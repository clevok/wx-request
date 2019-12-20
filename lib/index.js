"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var depend_interceptors_1 = require("./depend/depend.interceptors");
exports.Interceptors = depend_interceptors_1.Interceptors;
var depend_config_1 = require("./depend/depend.config");
exports.Config = depend_config_1.Config;
exports.SetConfig = depend_config_1.SetConfig;
var depend_interceptors_2 = require("./depend/depend.interceptors");
var request_1 = require("./lib/request");
/**
 * 请求request
 * @param url - 请求url
 * @param data - 属性对象
 * @param options - 扩展可选属性
 */
function Request(url, data, options) {
    var _this = this;
    if (data === void 0) { data = {}; }
    if (options === void 0) { options = {}; }
    /**
     * 真正发出的请求
     */
    var wxRequest;
    /**
     * 回调promise
     */
    var Pro = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var requestParams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestParams = { url: url, data: data, options: options };
                    /**
                     * 拦截器
                     */
                    return [4 /*yield*/, depend_interceptors_2.Interceptors.request.done(requestParams).catch(function (error) {
                            if (error instanceof Error)
                                console.error('拦截器异常', error);
                            reject(error);
                            return Promise.reject(error);
                        })];
                case 1:
                    /**
                     * 拦截器
                     */
                    _a.sent();
                    /**
                     *
                     * 提交请求申请
                     */
                    wxRequest = request_1.WxRequest(requestParams, function (result) {
                        resolve(depend_interceptors_2.Interceptors.response.success.done({
                            source: requestParams,
                            data: result
                        }));
                    }, function (error) {
                        /**
                         * 失败永远 reject
                         */
                        depend_interceptors_2.Interceptors.response.fail.done({
                            source: requestParams,
                            data: error
                        }).then(function (result) {
                            reject(result);
                        }).catch(function (error) {
                            reject(error);
                        });
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     *
     * 附加 abort 方法
     */
    Pro.abort = function () {
        wxRequest && wxRequest.abort && wxRequest.abort();
    };
    return Pro;
}
exports.Request = Request;
exports.default = Request;
