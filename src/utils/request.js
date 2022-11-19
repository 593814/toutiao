// 请求模块
import axios from 'axios'
import store from '@/store'
//引入JSONBig库
import JSONBig from 'json-bigint'
//利用axios的create方法创建axios实例
const request = axios.create({
    //接口的基准路径
    baseURL: 'http://toutiao.itheima.net/',

    //自定义后端返回的原始数据
    transformResponse: [function (data) {


        //自定义后端返回的原始数据
        //data:后端返回的原始数据,说白了就是JSON格式的字符串
        try {
            return JSONBig.parse(data)
        } catch (err) {
            return data
        }

        //JavaScript 能够准确表示的整数范围在`-2^53`到`2^53`之间（不含两个端点），超过这个范围，无法精确表示这个值
        //当我们从服务器拿取数据的时候,服务器默认传过来的数据是JSON格式的字符串,我们通过axios从后端拿取数据,内部会将JSON格式的字符串转换为js对象,如果超出js的整数范围,那么转换出来的数据可以会不准
        //当我们拿着从服务器拿取变动的数据,再去后端请求的话,会找不到对应数据,会报404
        //axios默认会在内部这样来处理后端返回的数据(我们为了解决大数字问题,需要使用JSONBig来处理)
        //return JSON.parse(data)
    }]
})

// 添加请求拦截器(好处:这样以后所有需要授权的接口不需要再去api文件下request请求的时候添加headers了)
request.interceptors.request.use(function (config) {
    // 请求发起会经过这里
    //config:本次请求的请求配置对象
    // console.log(config)
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    //注意:这里务必要返回config配置对象,否则请求就停在这里出不去了
    return config;
}, function (error) {
    // 如果请求出错了,(还没有发出去)会进入这里
    return Promise.reject(error);
});
//响应拦截器

export default request