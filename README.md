# wx-request
微信小程序请求封装



## 为什么要封装
主要是为了更加严苛的控制请求数, 以及使用async 来控制请求, 要求请求对象是 promise对象,
但目前使用的尽管是promise对象, 抛弃请求却十分的不方便
有的时候需要离开详情页, 详情页的请求也希望全部抛弃, 因此自己封装了

### 优势

1. promise
2. 并发限制: 动态排队请求, 超过配置的请求, 将排成队列, 等待最大完成请求数, 依次补上, 不等待空闲时间, 避免请求失败
3. 保留主动抛弃请求
4. 可配置
5. 分离 请求前后的业务逻辑, 参考 koa2 的洋葱模型


## demo

```js

    /**
     *  网络请求
     *
     * @param {string}  url 请求url
     * @param {object}  data 表单内容
     *
     * @param {object}  options 扩展属性
     * @param {boolean} options.baseUrl
     * @param {string}  [options.methods='POST'] methods
     * @param {string}  [options.header={...}] methods
     * @param {boolean} [options.dataType=json] dataType
     * @param {boolean} [options.noBaseUrl=false] 本地扩展
     */
    let request = requeir('./src/index');

        request.get('/system/getConfig.do', {time: 1}, {});
        request.put('/system/getConfig.do', {time: 1}, {});
        request.post('/system/getConfig.do', {time: 1}, {});

            // 直接抛弃请求
        request('/system/getConfig.do', {time: 1}, {}).abort();
        
        // 发送出去后抛弃请求
        let request1 = request('/system/getConfig.do', {time: 2}, {});
        setTimeout(() => {
            request1.abort();
        }, 30);

        request('/system/getConfig.do', {time: 3}, {});
        request('/system/getConfig.do', {time: 4}, {});
        request('/system/getConfig.do', {time: 5}, {noToken: true});

        // 队列中被直接抛弃
        let request2 = request('/system/getConfig.do', {time: 6}, {});
        setTimeout(() => {
            request2.abort();
        }, 30);

        request('/system/getConfig.do', {time: 7}, {});
        request('/system/getConfig.do', {time: 8}, {}).then(()=> {
            
        });

```

## 配置
    
### config.js
    
#### 通用配置
```js

    exports.config = {
        baseUrl: 'https://baidu.com', // 统一请求基路径
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        }, // header
        dataType: 'json',
        maxLink: 8, // 最大 并发请求
        response: {
            abort: {errMsg: 'request:fail abort'} // 取消请求后的回调消息
        }
    };

```

#### 拦截器 (学习koa2)

拦截器的目的是为了分离 业务代码 与 请求体
我们常见的是 比如 带 token, 我们可能会写在 请求里面, 
    
```js

    // 请求前
    data.token = app.token;

    // 或者在请求成功后
    success: (res) {
        let {data} = res;
        
        if (data.code !== 0) {
            return Promise.reject('请求失败')
        }
        if (data.code === 103) {
            return // 跳转到 登录页面
        }
        // if ().....
    }

```

注入此类, 为此, 在请求 模仿 类似 koa2一样的洋葱模型, 增加了拦截器
interceptors.request[] 传入多个 方法或Promise, 请求前的ctx包含了{url, data, options}
请求后的ctx, 为 小程序请求回来的对象

```js

    exports.interceptors = {

        /**
        * 请求之前
        * @param {boolean} [ctx.options.noToken=false] 扩展
        */
        request: [
            async (ctx) => {
                let {options} = ctx;
                if (!app.token) {
                    return Promise.reject(666);
                }
            },
            // ...async(ctx)=> {}
        ],

        // 请求成功的拦截器, (请求失败的拦截器没有对外开方)
        response: [
            async (ctx) => {
                return ctx.data; // 表示只需要 原来的小程序 data内的对象
            },
            async (ctx) => {
                if (ctx.code !== 0) {
                    return Promise.reject(ctx); // 进入这里, 那么请求将会以 reject 的方式回调 
                }
            }
        ]
    };

```

更多的设置

在 src/index中 配置了一些基本的拦截器
```js

    // 用于初始化数据
    async(ctx) => {
        ctx.options = {
            baseUrl: ctx.options.baseUrl || config.baseUrl,
            methods: ctx.options.methods || config.methods || 'POST',
            header: ctx.options.header || config.header || {},
            dataType: ctx.options.dataType || config.dataType || 'json',
            noBaseUrl: false
        };
    },
    // 你配置的
    ...interceptors.request,
    async (ctx) => {
        let {options} = ctx;
        if (options.noBaseUrl) ctx.options.baseUrl = '';
    }

```

请求失败的并没有对外开放, 有兴趣可以改 index.js
```js

    /**
    * 监听请求失败, 请求抛出
    */
    request.interceptors.response.fail.use(async (ctx) => {
        return Promise.reject(ctx);
    });
```
### 自带实用工具

1. loop 队列(控制并发数)


    - loop.**put**((finsh)=> {})

    执行finsh 表示该队列请求完毕, 该方法 返回传入的回调函数

    - loop.put.**abort** 
    
    移除该队列, 实际上是给传入的回调函数增加了 `abort` 方法

    - 实例
    
```js
    let loop = new Loop(2); // 最大并发数2
    loop.put((finsh)=> {
        console.log(1);
        
        setTimeout(()=> {
            finsh();
        }, 2000)
    })
    loop.put((finsh)=> {
        console.log(2);

        setTimeout(()=> {
            finsh();
        }, 2000)
    })
    loop.put((finsh)=> {
        console.log(3);

        setTimeout(()=> {
            finsh();
        }, 2000)
    })

    loop.put((finsh)=> {}).abort();
```

等待2秒后 才打印 3, finsh需手动执行, 表示该队列执行完成, 释放, 执行下一个方法



2. message.js (发布订阅, 从腾讯视频大大那边直接拿来用)

```js
    message.on('name', ()=> {});
    message.emit('name');
```

## 缺陷
感觉、、、 有内存泄露的可能性、、、、