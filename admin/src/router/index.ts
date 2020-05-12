import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/nav',
    name: 'nav',
    component: () => import(/* webpackChunkName: "about" */ '../views/Navbar.vue'),
    children: [
    ]
  }
]

const router = new VueRouter({
  routes
})

const VueRouterPush:Function = VueRouter.prototype.push
VueRouter.prototype.push = function push(to: any) {
  return VueRouterPush.call(this, to).catch((err: any) => err)
}

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next()
})

export default router
