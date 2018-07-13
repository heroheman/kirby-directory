import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ListStart',
      component: List
    },
    {
      path: '/:label?',
      name: 'List',
      component: List
    }
  ]
})
