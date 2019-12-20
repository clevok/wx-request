import concat from './concat';
export declare const Interceptors: {
    request: concat;
    response: {
        success: concat;
        fail: concat;
    };
};
