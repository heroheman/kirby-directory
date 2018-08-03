import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const searchApi = 'https://api.github.com/search/issues?q=is:open+repo:jenstornell/kirby-plugins&sort=updated&order=asc'
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
  labelGroups: [
    {
      name: 'File',
      items: ['CLI', 'Screenshot', 'Packagist']
    },
    {
      name: 'Has',
      items: ['Blueprint', 'Controller', 'Field', 'Field Method', 'Kirbytext Tag', 'Model', 'Snippet', 'Template', 'Widget']
    },
    {
      name: 'License',
      items: ['Commercial', 'MIT']
    },
    {
      name: 'State',
      items: ['Beta', 'Broken', 'Deprecated']
    },
    {
      name: 'Type',
      items: ['Plugin', 'Core', 'Tutorial', 'Misc']
    },
    {
      name: 'Version',
      items: ['2', '3']
    }
  ]
}

const mutations = {
  SET_ITEMS: (state, { items }) => {
    state.items = items
    state.displayedItems.results = state.items
  },
  SET_RESULTS_ALL: (state) => {
    state.displayedItems.results = state.items
  },
  SET_SEARCH_QUERY: (state, query) => {
    console.log(query)
    state.query = query
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
      state.displayedItems.results = state.items
        .filter(i => i.labels.some(i => i.name.toLowerCase() === label.toLowerCase()))
    } else {
      state.displayedItems.results = state.items
    }
  },
  PAGE_CURRENT_RESULTS: (state, page) => {
    // set currentpage
    // console.log('page called', page)
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
    console.log(payload)
    if (payload.message) {
      state.detail.readme = payload.message
    } else {
      payload = atob(payload.content)
      state.detail.readme = payload
    }
  },
  GET_COMMENTS: (state, payload) => {
    state.detail.comments = payload
  },
  REMOVE_ITEMS: (state) => {
    state.items = []
    state.displayedItems.results = state.items
    state.displayedItems.resultsPaged = state.items
  },
  SET_ITEMS_PER_PAGE: (state, payload) => {
    state.displayedItems.perPage = payload
  },
  REMOVE_QUERY: (state) => {
    state.query = ''
  },
  REMOVE_LABEL: (state) => {
    state.label = ''
  }
}

const actions = {
  fetchItemsAll: async function ({ commit, state }) {
    // toggle loading if is false
    if (state.isLoading === false) {
      commit('TOGGLE_LOADING')
    }

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

      console.time('FETCH NEW ITEMS')
      while (morePagesAvailable) {
        currentPage++
        const response = await fetch(`${searchApi}&per_page=${perPage}&page=${currentPage}`)
        let {items, total_count} = await response.json()
        items.forEach(e => allData.unshift(e))
        morePagesAvailable = currentPage < (total_count / perPage)
        // console.log(allData, morePagesAvailable, currentPage, items)
      }
      console.timeEnd('FETCH NEW ITEMS')
      commit('SET_ITEMS', { items: allData })
      commit('TOGGLE_LOADING')
      commit('PAGE_CURRENT_RESULTS', 0)
    } else {
      commit('TOGGLE_LOADING')
    }
  },
  removeItemsAll: function ({commit}) {
    commit('REMOVE_ITEMS')
  },
  getResultsAll ({ commit, state }, page) {
    commit('SET_RESULTS_ALL')
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getResultsFilter ({commit, state}, payload) {
    const {label, page} = payload
    commit('SET_RESULTS_LABEL', label)
    commit('PAGE_CURRENT_RESULTS', page)
    // commit('REMOVE_QUERY')
  },
  setSearchQuery ({commit, state}, payload) {
    commit('SET_SEARCH_QUERY', payload)
  },
  getResultsSearch ({commit, state}, payload) {
    const {query, page} = payload
    commit('SET_RESULTS_SEARCH', query)
    commit('PAGE_CURRENT_RESULTS', page)
    // commit('REMOVE_LABEL')
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
      .catch(error => console.error(`Fetch Error =\n`, error))

    commit('GET_README', response)
  },
  removeLabel ({commit}) {
    commit('REMOVE_LABEL')
  },
  removeQuery ({commit}) {
    commit('REMOVE_QUERY')
  },
  setItemsPerPage ({commit}, payload) {
    commit('SET_ITEMS_PER_PAGE', payload)
    commit('PAGE_CURRENT_RESULTS', 1)
  },
  toggleLoading (commit) {
    commit('TOGGLE_LOADING')
  }
}

const getters = {
  getLoading: state => state.isLoading,
  getLastPage: state => {
    return Math.ceil(state.displayedItems.results.length / state.displayedItems.perPage)
  },
  getSearchTerm: state => state.query
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
