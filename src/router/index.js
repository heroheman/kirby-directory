import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Detail from '@/components/Detail'
import ContentFAQ from '@/components/ContentFAQ'
import ContentPrivacy from '@/components/ContentPrivacy'
import ContentImprint from '@/components/ContentImprint'

Vue.use(Router)

export default new Router({
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: { name: 'ListStart' }
    },
    {
      path: '/faq',
      name: 'ContentFAQ',
      component: ContentFAQ
    },
    {
      path: '/privacy',
      name: 'ContentPrivacy',
      component: ContentPrivacy
    },
    {
      path: '/imprint',
      name: 'ContentImprint',
      component: ContentImprint
    },
    {
      path: '/detail/:id/:slug?',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/all/:page?',
      name: 'ListStart',
      component: List
    },
    {
      path: '/plugins/:page?',
      name: 'ListPlugins',
      component: List
    },
    {
      path: '/plugins/v2/:page?',
      name: 'ListPluginsV2',
      component: List
    },
    {
      path: '/plugins/v3/:page?',
      name: 'ListPluginsV3',
      component: List
    },
    {
      path: '/themes/:page?',
      name: 'ListThemes',
      component: List
    },
    {
      path: '/search/:query/:page?',
      name: 'Search',
      component: List
    },
    {
      path: '/label/:label/:page?',
      name: 'List',
      component: List
    }
  ]
})
