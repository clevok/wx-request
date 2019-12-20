"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var task_queue_1 = require("@clevok/task-queue");
var depend_config_1 = require("../depend/depend.config");
/** 队列 */
var eventLoop = new task_queue_1.Queue().addEventListener(new task_queue_1.Loop(depend_config_1.Config.maxLink));
/**
 * statusCode 不为 200 都是失败
 */
exports.WxRequest = function (
/**
 * 请求数据
 */
ctx, 
/**
 * 成功回调
 */
success, 
/**
 * 失败回调
 */
fail) {
    var url = ctx.url, data = ctx.data, options = ctx.options;
    var request = null;
    var requestLoop = eventLoop.push({
        abortTime: ctx.options.abortTime,
        abort: function () {
            return fail(depend_config_1.Config.response.abort);
        },
        success: function (finshed) {
            /**
             * 补全url
             */
            if (url.indexOf('http') !== 0) {
                url = options.baseUrl + url;
            }
            request = wx.request({
                url: url,
                data: data || '',
                header: options.header || {},
                method: options.method || 'GET',
                dataType: options.dataType || 'json',
                responseType: options.responseType || 'text',
                success: function (res) {
                    if (res.statusCode !== 200) {
                        return fail(Object.assign(res, {
                            rcode: -1,
                            scode: -1
                        }));
                    }
                    return success(res);
                },
                fail: function (res) {
                    var callcack;
                    if (res.errMsg === 'request:fail abort') {
                        callcack = depend_config_1.Config.response.abort;
                    }
                    else if (res.errMsg === 'request:fail timeout') {
                        callcack = depend_config_1.Config.response.timeout;
                    }
                    else {
                        callcack = {
                            rcode: -1,
                            scode: -1,
                            statusCode: 500,
                            errMsg: res.errMsg
                        };
                    }
                    return fail(callcack);
                },
                complete: function () {
                    finshed();
                }
            });
        }
    });
    /***
     * 重写 abort 方法
     */
    var abort = requestLoop.abort;
    requestLoop.abort = function () {
        abort && abort();
        request && request.abort();
    };
    return requestLoop;
};
