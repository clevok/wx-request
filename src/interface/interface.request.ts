export interface IPro extends Promise<WechatMiniprogram.RequestSuccessCallbackResult> {
    /** 抛弃请求 */
    abort: () => void
}

/**
 * 回调失败的接口
 */
export interface IResponseFail {
    rcode: number,
    scode: number,
    errMsg: string,

    /** http码, 失败则500 */
    statusCode: number
}


/**
 * 重写微信请求
 */
export interface IRequestSuccessCallbackResult {
    /** 开发者服务器返回的数据 */
    data: any
    /** 开发者服务器返回的 HTTP Response Header
     *
     * 最低基础库： `1.2.0` */
    header: {
        [key: string]: any
    }
    /** 开发者服务器返回的 HTTP 状态码 */
    statusCode: number
    errMsg: string
}
