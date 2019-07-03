import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import UserList from './components/userlist.vue'
import Welcome from './views/Welcom.vue'
import Roles from './components/roles.vue'
import Rights from './components/rights.vue'
import Goods from './components/goods.vue'
import Params from './components/params.vue'
import Categories from './components/categories.vue'
import Orders from './components/orders.vue'
import Reports from './components/reports.vue'

Vue.use(Router)

var router = new Router({
  routes: [{
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home,
    children: [{
      path: '/home',
      component: Welcome
    }, {
      path: '/users',
      component: UserList
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/goods',
      component: Goods
    }, {
      path: '/params',
      component: Params
    }, {
      path: '/categories',
      component: Categories
    }, {
      path: '/orders',
      component: Orders
    }, {
      path: '/reports',
      component: Reports
    }]
  }]
})
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  next()
})
export default router
