// import Compose from 'koa-compose';
const Compose = require('koa-compose')

const rules = Compose([
    (ctx, next) => {
        resul.d
        console.log("1");
        return 123
    }
]);
rules({name: 5}, (ctx, next) => {

}).then(result => {
    console.log('result');
}).catch(error => {
    console.log('catch');
});

// var a = new Promise((resolve, reject) => {
//     var d = new Promise((resolve, reject) => {
//         reject(2)
//     });
//     reject(d);
// });
// a.then(result => {
//     console.log('then', result);
// }).catch((result => {
//     console.log('catch', result);
// }))

// (async () => {
//     let done = () => {
//         throw new Error()
//         // return Promise.reject('121')
//     }
//     await Promise.resolve(done()).then(() => {
//         console.log('then');
//     }).catch(() => {
//         console.log('catch');
//     });
//     console.log('执行');
// })()