import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    //user是一个对象,存储当前登录用户信息(token等数据)
    //第一次打开页面的时候,因为还未登录,所以user为空
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))

    //使用封装的写法
    user: getItem(TOKEN_KEY)
  },
  getters: {
  },
  //组件可以直接和mutations通话
  mutations: {
    setUser(state, data) {
      //第一个参数:初始状态state的数据
      //第二个参数:dispath的值
      state.user = data

      //为了防止刷新丢失,我们需要把数据备份到本地存储
      //一刷新数据就丢失不是持久化的,通过本地存储解决问题
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))

      //使用封装的写法
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
