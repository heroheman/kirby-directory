import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'ListStart'}
    },
    {
      path: '/all/:page?',
      name: 'ListStart',
      component: List
    },
    {
      path: '/:label/:page?',
      name: 'List',
      component: List
    }
  ]
})
