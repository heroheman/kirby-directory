import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const searchApi = 'https://api.github.com/search/issues?q=is:open+repo:jenstornell/kirby-plugins&sort=desc&order=created'
const issueApi = 'https://api.github.com/repos/jenstornell/kirby-plugins/issues'
const repoApi = 'https://api.github.com/repos'

Vue.use(Vuex)

const state = {
  items: [],
  query: '',
  label: '',
  detail: {
    item: {},
    comments: [],
    readme: ''
  },
  displayedItems: {
    currentPage: 0,
    perPage: 20,
    maxPage: '',
    results: [],
    resultsPaged: []
  },
  isLoading: true,
  labelTypes: {
    name: 'Types',
    items: ['Blueprint', 'Controller', 'Core', 'Field', 'Misc', 'Model', 'Plugin', 'Snippet', 'Tag', 'Template']
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
  SET_RESULTS_SEARCH: (state, query) => {
    if (query !== '') {
      state.query = query
      query = query.trim().toLowerCase()

      state.displayedItems.results = state.items.filter(item => {
        return item.title.toLowerCase().includes(query) || item.body.toLowerCase().includes(query)
      })
    }
  },
  SET_RESULTS_LABEL: (state, label) => {
    state.label = label
    if (label !== undefined) {
      // get all items with label
      state.displayedItems.results = state.items.filter(i => i.labels.some(i => i.name === label))
    } else {
      state.displayedItems.results = state.items
    }
  },
  PAGE_CURRENT_RESULTS: (state, page) => {
    // set currentpage
    console.log(page)
    if (page !== 0) {
      state.displayedItems.currentPage = page - 1
    } else {
      state.displayedItems.currentPage = page
    }

    // get only paged from pageview
    const start = state.displayedItems.currentPage * state.displayedItems.perPage
    const end = start + state.displayedItems.perPage

    state.displayedItems.resultsPaged = state.displayedItems.results.slice(start, end)
  },
  TOGGLE_LOADING: (state) => {
    state.isLoading = !state.isLoading
  },
  GET_DETAIL: (state, payload) => {
    const {number} = payload
    // empty details
    state.detail.comments = []
    state.detail.readme = ''
    state.detail.item = state.items.find(i => i.number === Number(number))
  },
  GET_README: (state, payload) => {
    // encrypt payload
    payload = atob(payload.content)
    state.detail.readme = payload
  },
  GET_COMMENTS: (state, payload) => {
    state.detail.comments = payload
  }
}

const actions = {
  fetchItemsAll: async function ({ commit }) {
    // if no local state given
    if (!localStorage.getItem('vuex')) {
      // create state with empty content
      localStorage.setItem('vuex', '{"items":[]}')
    }

    let lsTest = JSON.parse(localStorage.getItem('vuex'))

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
  getResultsAll ({ commit, state }) {
    commit('SET_RESULTS_ALL')
  },
  getResultsFilter ({commit, state}, payload) {
    const {label, page} = payload
    commit('SET_RESULTS_LABEL', label)
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getResultsSearch ({commit, state}, payload) {
    const {query, page} = payload
    commit('SET_RESULTS_SEARCH', query)
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getDetail ({commit}, payload) {
    commit('GET_DETAIL', payload)
  },
  getComments: async function ({commit}, payload) {
    const response = await fetch(`${issueApi}/${payload}/comments`)
      .then(res => res.json())
    commit('GET_COMMENTS', response)
  },
  getReadme: async function ({commit, state}, payload) {
    let response = await fetch(`${repoApi}/${payload}/readme`)
      .then(res => res.json())
    commit('GET_README', response)
  },
  toggleLoading (commit) {
    commit('TOGGLE_LOADING')
  }
}

const getters = {
  getLoading: state => state.isLoading,
  getLastPage: state => {
    return Math.ceil(state.displayedItems.results.length / state.displayedItems.perPage)
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [createPersistedState({
    paths: ['items']
  })]
})

export default store
