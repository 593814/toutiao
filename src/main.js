import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//使用lib-flexible动态设置REM基准值(html字体的大小)
//lib-flexible将一行分为十等份,根据设配的总宽度除以10,即可算出来十等份中每一份占多少,这样就给不同设备适配不同的值
//我们加载这个包,加载的是modules中的index.js
//引入amfe-flexible
import 'amfe-flexible'
//加载全局less样式
import './styles/index.less'
// 加载 Vant 核心组件库
import Vant from 'vant'
// 加载 Vant 全局样式
import 'vant/lib/index.css'
//加载dayjs初始化配置
import './utils/day'
// 注册使用 Vant 组件库
Vue.use(Vant)

Vue.config.productionTip = false

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')