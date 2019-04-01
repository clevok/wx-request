import Request from './src/index';
// Request.config.set({
//     baseUrl: 'https://fhdowx.xyy001.com',
//     subUrl: {
//         fhk: 'http://fhk.fhd001.com'
//     }
// });

Request.interceptors.response.success.use(
    async (ctx) => {
        return ctx.data;
    },
    async (ctx) => {
        ctx;
        debugger;
    }
);

Request.interceptors.response.fail.use(
    async (ctx) => {
        ctx;
        debugger;
    }
);