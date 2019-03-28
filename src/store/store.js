import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
// import createPersistedState from 'vuex-persistedstate'

const issueApi = 'https://api.github.com/repos/jenstornell/kirby-plugins/issues'
const repoApi = 'https://api.github.com/repos'
// const pluginData = '/static/items.json'
// const pluginApi = process.env.VUE_APP_PLUGIN_ENDPOINT
// const themeApi = process.env.VUE_APP_THEME_ENDPOINT
const itemsEndpoint = process.env.VUE_APP_ALL_ENDPOINT
const labelsEndpoint = process.env.VUE_APP_LABELS_ENDPOINT
const detailsEndpoint = process.env.VUE_APP_DETAIL_ENDPOINT
const issueEndpoint = process.env.VUE_APP_ISSUE_ENDPOINT

Vue.use(Vuex)

const state = {
  items: [],
  query: '',
  label: '',
  labels: [],
  detail: {
    issue: {},
    details: {},
    comments: []
  },
  displayedItems: {
    currentPage: 0,
    perPage: 20,
    maxPage: '',
    results: [],
    resultsPaged: []
  },
  isLoading: true,
  meta: {
    title: 'Kirby Plugin Directory',
    description: 'The Plugin Directory for the GetKirby CMS',
    keywords: 'kirby, plugins, cms, php, content management system, frontend, freelancer, florenz heldermann, list, collection',
    image: '/static/favicon/android-chrome-256x256.png'
  }
}

const mutations = {
  SET_ITEMS: (state, { items }) => {
    state.items = [...items]
    // backup for reverse exclude
    state.displayedItems.results = [...state.items]
  },
  SET_DETAILS: (state, payload) => {
    console.log(payload)
    state.detail.comments = []
    state.detail.issue = { ...payload.issue }
    state.detail.details = { ...payload.details }
  },
  SET_SEARCH_QUERY: (state, query) => {
    state.query = query
  },
  SET_RESULTS_ALL: (state) => {
    state.displayedItems.results = state.items
  },
  SET_RESULTS: (state, type = null) => {
    if (type === null) {
      state.displayedItems.results = state.items
    } else if (type === 'pluginsAll') {
      state.displayedItems.results = state.items
        .filter(i => i.item_type === 'plugins-v2' || i.item_type === 'plugins-v3')
    } else {
      state.displayedItems.results = state.items
        .filter(i => i.item_type === type)
    }
  },
  SET_RESULTS_SEARCH: (state, query) => {
    if (query !== '') {
      state.query = query
      query = query.trim().toLowerCase()

      state.displayedItems.results = state.items.filter(item => {
        // search for title, body and label
        return item.title.toLowerCase().includes(query) ||
          item.body.toLowerCase().includes(query) ||
          item.labels.some(i => i.name.toLowerCase().includes(query))
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
  GET_README: (state, payload) => {
    // encrypt payload
    if (payload.message) {
      state.detail.readme = payload.message
    } else {
      let encodedPayload = decodeURIComponent(atob(payload.content).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      // payload = atob(payload.content)
      state.detail.readme = encodedPayload
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
  },
  SET_LABELS: (state, labels) => {
    state.labels = labels
  }
}

const actions = {
  fetchItemsAll: async function ({ commit, state }) {
    // toggle loading if is false
    if (state.isLoading === false) {
      commit('TOGGLE_LOADING')
    }

    let items = await fetch(itemsEndpoint)
    items = await items.json()

    commit('SET_ITEMS', { items: items })
    commit('TOGGLE_LOADING')
    commit('PAGE_CURRENT_RESULTS', 0)
  },
  getDetails: async function ({ commit }, itemId) {
    const id = itemId.number
    const issueUrl = `${issueEndpoint}/${id}`
    let issue = await fetch(issueUrl)
    issue = await issue.json()

    const detailUrl = `${detailsEndpoint}/${id}`
    let details = await fetch(detailUrl)
    details = await details.json()

    commit('SET_DETAILS', { details, issue })
  },
  removeItemsAll: function ({ commit }) {
    commit('REMOVE_ITEMS')
  },
  getResultsAll ({ commit, state }, page) {
    commit('SET_RESULTS')
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getResultsPlugins ({ commit, state }, page) {
    commit('SET_RESULTS', 'pluginsAll')
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getResultsPluginsV2 ({ commit, state }, page) {
    commit('SET_RESULTS', 'plugins-v2')
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getResultsPluginsV3 ({ commit, state }, page) {
    commit('SET_RESULTS', 'plugins-v3')
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getResultsThemes ({ commit, state }, page) {
    commit('SET_RESULTS', 'themes')
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getResultsFilter ({ commit, state }, payload) {
    const { label, page } = payload
    commit('SET_RESULTS_LABEL', label)
    commit('PAGE_CURRENT_RESULTS', page)
    // commit('REMOVE_QUERY')
  },
  setSearchQuery ({ commit, state }, payload) {
    commit('SET_SEARCH_QUERY', payload)
  },
  getResultsSearch ({ commit, state }, payload) {
    const { query, page } = payload
    commit('SET_RESULTS_SEARCH', query)
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getComments: async function ({ commit }, payload) {
    const response = await fetch(`${issueApi}/${payload}/comments`)
      .then(res => res.json())
    commit('GET_COMMENTS', response)
  },
  getReadme: async function ({ commit, state }, payload) {
    let response = await fetch(`${repoApi}/${payload}/readme`)
      .then(res => res.json())
      // eslint-disable-next-line no-console
      .catch(error => console.error(`Fetch Error =\n`, error))

    commit('GET_README', response)
  },
  removeLabel ({ commit }) {
    commit('REMOVE_LABEL')
  },
  removeQuery ({ commit }) {
    commit('REMOVE_QUERY')
  },
  setItemsPerPage ({ commit }, payload) {
    commit('SET_ITEMS_PER_PAGE', payload)
    commit('PAGE_CURRENT_RESULTS', 1)
  },
  async getLabels ({ commit }) {
    const labels = await fetch(labelsEndpoint)
    const items = await labels.json()
    commit('SET_LABELS', items)
  },
  toggleLoading (commit) {
    commit('TOGGLE_LOADING')
  }
}

const getters = {
  getLoading: state => state.isLoading,
  getLabel: state => state.label,
  getQuery: state => state.query,
  getDetailTitle: state => state.detail.issue.title,
  getLastPage: state => {
    return Math.ceil(state.displayedItems.results.length / state.displayedItems.perPage)
  },
  getSearchTerm: state => state.query,
  getPluginItems: state => state.items.filter((i) => i.item_type !== 'theme'),
  getThemeItems: state => state.items.filter((i) => i.item_type === 'theme'),
  getLabels: state => state.labels,
  getLabelsThemes: state => state.labels.filter(label => label.label_type === 'themes'),
  getLabelsPluginsV2: state => state.labels.filter(label => label.label_type === 'plugins-v2'),
  getLabelsPluginsV3: state => state.labels.filter(label => label.label_type === 'plugins-v3')
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
  // plugins: [createPersistedState({
  //   paths: ['items']
  // })]
})

export default store
