import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/nav',
    name: 'nav',
    component: () => import(/* webpackChunkName: "about" */ '../views/Navbar.vue'),
    children:[
      {
        path:'home',
        name:'home',
        component:()=>import('../views/IFRAME.vue')
    }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
