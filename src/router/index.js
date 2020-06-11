import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login'
import { API_USERS_CKECKTOKEN } from '@/api/apis'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../pages/Index'),
      children: [{
        path: '/index/',
        name: 'home',
        meta: { role: ['super', 'normal'] },
        component: () => import('../pages/index/Content')
      },
      {
        path: '/index/ordermanagement',
        name: 'ordermanagement',
        meta: { role: ['super', 'normal'] },
        component: () => import('../pages/index/OrderMgement')
      },
      {
        path: '/index/productlist',
        name: 'productlist',
        meta: { role: ['super', 'normal'] },
        component: () => import('../pages/index/ProductList')
      },
      {
        path: '/index/productadd',
        name: 'productadd',
        meta: { role: ['super', 'normal'] },
        component: () => import('../pages/index/ProductAdd')
      },
      {
        path: '/index/productclass',
        name: 'productclass',
        meta: { role: ['super', 'normal'] },
        component: () => import('../pages/index/ProductClass')
      },
      {
        path: '/index/storemanagement',
        name: 'storemanagement',
        meta: { role: ['super'] },
        component: () => import('../pages/index/StoreManagement')
      },
      {
        path: '/index/accountlist',
        name: 'accountlist',
        meta: { role: ['super'] },
        component: () => import('../pages/index/AccountList')
      },
      {
        path: '/index/accountadd',
        name: 'accountadd',
        meta: { role: ['super'] },
        component: () => import('../pages/index/AccountAdd')
      },
      {
        path: '/index/accountedit',
        name: 'accountedit',
        meta: { role: ['super'] },
        component: () => import('../pages/index/AccountEdit')
      },
      {
        path: '/index/commoditysum',
        name: 'commoditysum',
        meta: { role: ['super'] },
        component: () => import('../pages/index/CommoditySum')
      },
      {
        path: '/index/ordersum',
        name: 'ordersum',
        meta: { role: ['super'] },
        component: () => import('../pages/index/OrderSum')
      },
      {
        path: '/index/person',
        name: 'person',
        meta: { role: ['super', 'normal'] },
        component: () => import('../pages/index/Person')
      }
      ]
    }

    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
  ],
  linkActiveClass: 'active'
})
router.beforeEach((to, from, next) => {
  // to： 即将进入的route对象
  // from: 现在的route对象（就没有切换之前的）
  if (to.path != '/') {//只要不是登录的页面，想进入其他页面都需要判断一次是否登录!
    // 发送请求验证token是否过期
    API_USERS_CKECKTOKEN(localStorage.token).then(res => {
      if (res.data.code == 0) {
        // 登录状态
        next()//放行 执行下一步
        //权限拦截，不能通过hash值访问到非自己权限的页面！
        if (to.meta.role.includes(localStorage.role)) {
          next()
        } else next(from)
      }
      else {
        // 未登录，拦截，进行跳转到登录页面
        next('/') //next函数，如果传参，就表示跳转到指定hash地址
      }
    })
  } else next()
})
export default router


