import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import UserList from './components/userlist.vue'
import Welcome from './views/Welcom.vue'

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
