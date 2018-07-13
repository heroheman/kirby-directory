import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const searchApi = 'https://api.github.com/search/issues?q=is:open+repo:jenstornell/kirby-plugins&sort=desc&order=created'
// const issueApi = 'https://api.github.com/repos/jenstornell/kirby-plugins/issues'

Vue.use(Vuex)

const state = {
  items: [],
  displayedItems: {
    currentPage: '',
    results: []
  },
  isLoading: true,
  labelTypes: {
    name: 'Types',
    items: ['all', 'Blueprint', 'Controller', 'Core', 'Field', 'Misc', 'Model', 'Plugin', 'Snippet', 'Tag', 'Template']
  },
  labelGroups: {
    name: 'Groups',
    items: ['Commercial', 'Panel', 'Screenshot', 'Stable', 'Beta']
  }
}

const mutations = {
  SET_ITEMS: (state, { items }) => {
    state.items = items
    state.displayedItems.results = state.items
  },
  SET_RESULTS_ALL: (state) => {
    state.displayedItems.results = state.items
  },
  SET_RESULTS_FILTER: (state, payload) => {
    state.displayedItems.results = state.items.filter(i => i.labels.some(i => i.name === payload.label))
  },
  TOGGLE_LOADING: (state) => {
    state.isLoading = !state.isLoading
  }
}

const actions = {
  fetchItemsAll: async function ({ commit }) {
    if (!localStorage.getItem('vuex')) {
      localStorage.setItem('vuex', '{"items":[]}')
    }

    let lsTest = JSON.parse(localStorage.getItem('vuex'))
    console.log(lsTest)

    if (lsTest === null || lsTest.items.length === 0) {
      let allData = []
      let morePagesAvailable = true
      let currentPage = 0
      let perPage = 100

      while (morePagesAvailable) {
        currentPage++
        const response = await fetch(`${searchApi}&per_page=${perPage}&page=${currentPage}`)
        let {items, total_count} = await response.json()
        items.forEach(e => allData.unshift(e))
        morePagesAvailable = currentPage < (total_count / perPage)
        console.log(allData, morePagesAvailable, currentPage, items)
      }
      commit('SET_ITEMS', { items: allData })
      commit('TOGGLE_LOADING')
    }
  },
  setResultsAll ({ commit, state }) {
    commit('SET_RESULTS_ALL')
  },
  setResultsFilter ({commit, state}, label) {
    commit('SET_RESULTS_FILTER', label)
  },
  toggleLoading ({commit, state}) {
    commit('TOGGLE_LOADING')
  }
}

const getters = {
  getItemsByLabel: state => label => state.items.filter(i => i.labels.some(l => l.name === label)),
  getLoading: state => state.isLoading
  // expanded:
  // filtered: (state) => (label) => {
  //   return state.items.filter((item) => {
  //     return item.labels.some(l => l.name == label)
  //   })
  // }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [createPersistedState()]
})

export default store
