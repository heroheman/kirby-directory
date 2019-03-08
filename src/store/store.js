import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
// import createPersistedState from 'vuex-persistedstate'

const issueApi = 'https://api.github.com/repos/jenstornell/kirby-plugins/issues'
const repoApi = 'https://api.github.com/repos'
// const pluginData = '/static/items.json'
const pluginApi = process.env.VUE_APP_PLUGIN_ENDPOINT
const themeApi = process.env.VUE_APP_THEME_ENDPOINT

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
    excluded: ['State: Broken', 'State: Deprecated'],
    excludedAmount: 0,
    results: [],
    resultsUnexcluded: [],
    resultsPaged: []
  },
  isLoading: true,
  labelPlugins: [
    {
      name: 'Has',
      items: ['Blueprint', 'Controller', 'Field', 'Field Method', 'File Method', 'Kirbytext Tag', 'Model', 'Snippet', 'Template', 'Widget']
    },
    {
      name: 'Tag',
      items: ['Audio', 'Bootstrap', 'Cache', 'Calendar', 'Database', 'Date', 'E-commerce', 'Editor', 'Email', 'Embed', 'Feed', 'Font', 'Form', 'Foundation', 'Geo location', 'Gulp', 'Hook', 'Icon', 'Image', 'Less', 'Pagination', 'Panel', 'Podcast', 'Redirect', 'Sass', 'Security', 'Select', 'Sitemap', 'Social', 'Statistics', 'Table', 'Tabs', 'Text', 'Time', 'Tool', 'Unique', 'Users', 'Video']
    },
    {
      name: 'File',
      items: ['CLI', 'Screenshot', 'Packagist']
    },
    {
      name: 'Type',
      items: ['Plugin', 'Core', 'Tutorial', 'Misc']
    },
    {
      name: 'License',
      excludable: true,
      items: ['Commercial', 'MIT']
    },
    {
      name: 'State',
      excludable: true,
      items: ['Beta', 'Broken', 'Deprecated']
    },
    {
      name: 'Version',
      excludable: true,
      items: ['2', '3']
    }
  ],
  labelThemes: [
    {
      name: 'Themes',
      items: ['Blog', 'Bootstrap', 'Commercial', 'Docs', 'Foundation', 'Kube', 'Material', 'Portfolio', 'Screenshot', 'Kirby 3 Theme', 'Kirby 2 Theme']
    }
  ],
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
  SET_SEARCH_QUERY: (state, query) => {
    state.query = query
  },
  SET_RESULTS_ALL: (state) => {
    state.displayedItems.results = state.items
    // backup for reverse exclude
    state.displayedItems.resultsUnexcluded = state.displayedItems.results
  },
  SET_RESULTS_PLUGINS: (state) => {
    state.displayedItems.results = state.items.filter(i => i.item_type === 'plugin')
    // backup for reverse exclude
    state.displayedItems.resultsUnexcluded = state.displayedItems.results
  },
  SET_RESULTS_THEMES: (state) => {
    state.displayedItems.results = state.items.filter(i => i.item_type === 'theme')
    // backup for reverse exclude
    state.displayedItems.resultsUnexcluded = state.displayedItems.results
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
      // backup for reverse exclude
      state.displayedItems.resultsUnexcluded = state.displayedItems.results
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
    // backup for reverse exclude
    state.displayedItems.resultsUnexcluded = state.displayedItems.results
  },
  ADD_EXCLUDE_ITEM: (state, label) => {
    if (!state.displayedItems.excluded.includes(label)) {
      let exItems = state.displayedItems.excluded
      exItems.push(label)
      state.displayedItems.excluded = exItems
    }
  },
  REMOVE_EXCLUDE_ITEM: (state, label) => {
    state.displayedItems.excluded = state.displayedItems.excluded.filter(item => item !== label)
  },
  EXCLUDE_ITEMS: (state) => {
    // get backup to readd all missing items
    state.displayedItems.results = state.displayedItems.resultsUnexcluded

    const filtered = state.displayedItems.results
      .filter(item => item.labels
        .every(itemLabel => !state.displayedItems.excluded.includes(itemLabel.name)))

    // get amount of filtered items
    state.displayedItems.excludedAmount = state.displayedItems.results.length - filtered.length

    // set filtered items
    state.displayedItems.results = filtered
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
  GET_DETAIL: (state, payload) => {
    const { number } = payload
    // empty details
    state.detail.comments = []
    state.detail.readme = ''
    state.detail.item = state.items.find(i => i.id === Number(number))
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
  }
}

const actions = {
  fetchItemsAll: async function ({ commit, state }) {
    // toggle loading if is false
    if (state.isLoading === false) {
      commit('TOGGLE_LOADING')
    }

    let plugins = await fetch(pluginApi)
    let themes = await fetch(themeApi)

    plugins = await plugins.json()
    themes = await themes.json()

    let items = themes.concat(plugins)

    items.sort(function (a, b) {
      // convert date object into number to resolve issue in typescript
      return +new Date(a.updated_at) - +new Date(b.updated_at)
    })
    items = items.reverse()

    // let response = await fetch(pluginApi)
    // let items = await response.json()

    commit('SET_ITEMS', { items: items })
    commit('EXCLUDE_ITEMS')
    commit('TOGGLE_LOADING')
    commit('PAGE_CURRENT_RESULTS', 0)
  },
  removeItemsAll: function ({ commit }) {
    commit('REMOVE_ITEMS')
  },
  getResultsAll ({ commit, state }, page) {
    commit('SET_RESULTS_ALL')
    commit('EXCLUDE_ITEMS')
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getResultsPlugins ({ commit, state }, page) {
    commit('SET_RESULTS_PLUGINS')
    commit('EXCLUDE_ITEMS')
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getResultsThemes ({ commit, state }, page) {
    commit('SET_RESULTS_THEMES')
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getResultsFilter ({ commit, state }, payload) {
    const { label, page } = payload
    commit('SET_RESULTS_LABEL', label)
    commit('EXCLUDE_ITEMS')
    commit('PAGE_CURRENT_RESULTS', page)
    // commit('REMOVE_QUERY')
  },
  excludeItem ({ commit, state }, payload) {
    console.log(payload)
    commit('ADD_EXCLUDE_ITEM', payload)
    commit('EXCLUDE_ITEMS')
    commit('PAGE_CURRENT_RESULTS', 0)
  },
  includeItem ({ commit, state }, payload) {
    commit('REMOVE_EXCLUDE_ITEM', payload)
    commit('EXCLUDE_ITEMS')
    commit('PAGE_CURRENT_RESULTS', 0)
  },
  setSearchQuery ({ commit, state }, payload) {
    commit('SET_SEARCH_QUERY', payload)
  },
  getResultsSearch ({ commit, state }, payload) {
    const { query, page } = payload
    commit('SET_RESULTS_SEARCH', query)
    commit('EXCLUDE_ITEMS')
    commit('PAGE_CURRENT_RESULTS', page)
  },
  getDetail ({ commit }, payload) {
    commit('GET_DETAIL', payload)
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
  toggleLoading (commit) {
    commit('TOGGLE_LOADING')
  }
}

const getters = {
  getLoading: state => state.isLoading,
  getLabel: state => state.label,
  getQuery: state => state.query,
  getDetailTitle: state => state.detail.item.title,
  getLastPage: state => {
    return Math.ceil(state.displayedItems.results.length / state.displayedItems.perPage)
  },
  getSearchTerm: state => state.query,
  getExcluded: state => state.displayedItems.excluded,
  getExcludedAmount: state => state.displayedItems.excludedAmount,
  getPluginItems: state => state.items.filter((i) => i.item_type === 'plugin'),
  getThemeItems: state => state.items.filter((i) => i.item_type === 'theme')
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
