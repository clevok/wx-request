"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("./lib/request"));
var interceptors_1 = require("./lib/interceptors");
exports.Interceptors = interceptors_1.Interceptors;
var config_1 = require("./config");
exports.Config = config_1.Config;
exports.SetConfig = config_1.SetConfig;
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
exports.default = request_1.default;
exports.Request = request_1.default;
