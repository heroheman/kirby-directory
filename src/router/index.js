import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Detail from '@/components/Detail'

Vue.use(Router)

export default new Router({
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: {name: 'ListStart'}
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/all/:page?',
      name: 'ListStart',
      component: List
    },
    {
      path: '/search/:query/:page?',
      name: 'Search',
      component: List
    },
    {
      path: '/:label/:page?',
      name: 'List',
      component: List
    }
  ]
})
