import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    //路由懒加载
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: 'layout',//如果父路由有默认子路由,那么它的name没有意义
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      {
        path: '/home',//空字符串是默认子路由,只能有一个(页面刚打开显示的子路由)当我们访问的路径是/的时候,默认显示该子路由
        name: 'home',
        //路由懒加载
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        //路由懒加载
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        //路由懒加载
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        //路由懒加载
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    //路由懒加载
    component: () => import('@/views/search')
  },
  {
    //因为每次点击都要跳转到不同的atricle路由(比如点击第一篇文章,跳转到/article/1,点击第二篇文章,跳转到/article/2)
    path: '/article/:articleId',
    name: 'article',
    //路由懒加载
    component: () => import('@/views/article'),
    //props第二种写法,值为布尔值,若布尔值为真,就会把该路由组件收到的所有params参数,以props的形式传给Detail组件
    props: true
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    //路由懒加载
    component: () => import('@/views/user-profile')
  },
  {
    path: '/user/focus',
    name: 'user-focus',
    //路由懒加载
    component: () => import('@/views/Focus')
  }
]

const router = new VueRouter({
  routes
})

export default router
