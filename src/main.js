// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFuse from 'vue-fuse'
import store from './store/store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faComments, faStream, faCog, faEllipsisH, faSearch, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowLeft, faComments, faStream, faCog, faEllipsisH, faSearch, faLink)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  VueFuse,
  store,
  components: { App },
  template: '<App/>',
  beforeCreate () {
    this.$store.dispatch('fetchItemsAll')
  }
})
