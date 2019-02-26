import Vue from 'vue'
import App from './App'
import router from './router'
import Meta from 'vue-meta'
import store from './store/store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faArrowCircleLeft, faComments, faStream, faCog, faEllipsisH, faSearch, faLink, faHome, faQuestion, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowLeft, faArrowCircleLeft, faComments, faStream, faCog, faEllipsisH, faSearch, faLink, faHome, faQuestion, faEye, faEyeSlash)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(Meta)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
