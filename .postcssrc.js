module.exports = {
    plugins: {
        /*  'autoprefixer': {
             browsers: ['Android >= 4.0', 'iOS >= 8']
         }, */
        'postcss-pxtorem': {
            rootValue: 37.5,
            propList: ['*']
        }
    },
    //配置不要转换的样式资源
    exclude: 'github-markdown'
}
