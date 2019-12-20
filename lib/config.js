"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = {
    baseUrl: 'https://fhdowx.xyy001.com',
    method: 'POST',
    header: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    maxLink: 8,
    response: {
        abort: { errMsg: 'request:fail abort', rcode: -1, scode: -2 },
        timeout: { errMsg: 'request:fail timeout', rcode: -1, scode: -3 } // 请求超时
    }
};
exports.SetConfig = function (params) {
    if (params === void 0) { params = {}; }
    if (typeof params === 'object') {
        Object.keys(params).forEach(function (e) {
            exports.Config[e] = params[e];
        });
    }
};
