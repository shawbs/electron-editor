import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/page/index').default
    },
    {
      path: '/editor',
      name: 'editor',
      component: require('@/page/editor').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
