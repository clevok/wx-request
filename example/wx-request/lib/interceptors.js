const interceptors = {
    
};
interceptors.request = {
    list: [],
    use () {
        [].forEach.call(arguments, (funs) => {
            if (typeof funs === 'function') {
                this.list.push(funs);
            }
        });
    },
    async done (ctx) {
        if (!this.list.length) {
            return ctx;
        }

        let l = this.list.length;
        for (let i = 0; i < l; i++) {
            // 如果 拦截器 没有 return 那将采用原对象;
            ctx = await this.list[i](ctx) || ctx;
        }
        return ctx;
    }
};
interceptors.response = {
    success: Object.assign({}, interceptors.request, {list: []}),
    fail: Object.assign({}, interceptors.request, {list: []})
};

module.exports = interceptors;