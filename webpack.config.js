module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        filename: "index.js",
        path: __dirname + '/lib'   //打包后的文件存放的地方;注："__dirname"是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
    },
    module: {
        rules: [
            {
                // 正则检查所有的js文件
                test: /\.js$/,
                // 使用的babel-loader转换规则
                use: {
                    loader: 'babel-loader',
                },
                // 排除不被应用编译
                exclude: '/node_modules/'
            }
        ]
    }
};