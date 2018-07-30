<template>
  <div class="list">

    <div class="loadingwrapper" v-if="getLoading">
      <div class="loadingwrapper__inner">
        <pulse-loader :loading="getLoading"/>
        <p>
          Either this is your first visit or the data has been updated. Therefore we now load a temporary copy of the plugin database from Github. This can take up to 10 seconds
          Loading: {{ getLoading }}
        </p>
      </div>
    </div>

    <p class="list__summary">
      There are currently <strong>{{displayedItems.results.length}}</strong> results
      <span v-if="label !== ''">in <strong>{{label}}</strong></span>
      <span v-if="query !== ''">for the term <strong>{{query}}</strong></span>.
      Showing
      <select class="invisible-dropdown" v-model="displayedItems.perPage" v-on:change="updatePerPageNumber">
        <option disabled value="">Please select</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="70">70</option>
        <option value="100">100</option>
      </select>
      results per page.
    </p>

    <Pagination />

    <ul class="list__items" v-if="displayedItems !== 0">
      <li class="list__item"
        v-for="item in displayedItems.resultsPaged"
        :key="item.id">
        <ListItem :item="item"/>
      </li>
    </ul>

    <Pagination />

  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ListItem from './ListItem.vue'
import Pagination from './Pagination.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'List',
  components: {ListItem, Pagination, PulseLoader},
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'items',
      'query',
      'label',
      'displayedItems'
    ]),
    ...mapGetters([
      'getLoading'
    ])
  },
  methods: {
    ...mapActions([
      'fetchItemsAll',
      'getResultsAll',
      'getResultsFilter',
      'getResultsSearch',
      'setItemsPerPage',
      'setSearchQuery',
      'removeQuery',
      'removeLabel'
    ]),
    updatePerPageNumber: function (e) {
      this.setItemsPerPage(Number(e.target.value))
    },
    updateList: function () {
      console.info(this.$route.name)
      let page = this.$route.params.page || 1

      if (this.$route.name === 'ListStart') {
        console.log('updatelist: is Start: ', page)
        this.removeQuery()
        this.removeLabel()
        this.getResultsAll(page)
      }

      // if is label
      if (this.$route.name === 'List') {
        let label = this.$route.params.label
        console.log('updatelist: has label: ', label, page)
        this.removeQuery()
        this.getResultsFilter({label: label, page: page})
      }

      // if has search query
      if (this.$route.name === 'Search') {
        let query = this.$route.params.query
        if (this.$store.getters.getSearchTerm === '') {
          this.setSearchQuery(query)
        }

        console.log('updatelist: has search: ', query, page)

        this.removeLabel()
        this.getResultsSearch({query: query, page: page})
      }
    }
  },
  watch: {
    '$route.params': function () {
      // if is label
      console.log(this.$route.name)
      this.updateList()
    }
  },
  created () {
  },
  beforeRouteEnter: function (to, from, next) {
    // console.log('router enter', to, from)
    next()
  },
  beforeRouteLeave: function (to, from, next) {
    console.log('before.route.leave', to.name, from.name)
    if (to.name === 'Search') {
      // this.$store.dispatch('removeLabel')
    }
    if (to.name === 'List') {
      // this.$store.dispatch('removeQuery')
    }
    if (to.name === 'ListStart') {
      // console.log('going to list start')
      // this.$store.dispatch('removeLabel')
      // this.$store.dispatch('removeQuery')

      // this.getResultsAll()
      // this.$store.commit('PAGE_CURRENT_RESULTS', 1)
    }
    next()
  },
  beforeRouteUpdate: function (to, from, next) {
    console.log('before route update')
    this.$store.commit('PAGE_CURRENT_RESULTS', to.params.page)
    next()
  },
  mounted () {
    this.updateList()
  }
}
</script>

<style lang="scss">
@import './../assets/scss/_vars.scss';
.loadingwrapper {
  position: relative;
  min-width: 50vw;
  min-height: 50vh;
  width: 100%;

  &__inner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  p {
    @extend %smallprint;
  }
}

.invisible-dropdown {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  border: 0;
  font-weight: 800;
  border-bottom: 2px solid red;
  width: 30px;
}

.list {
  position: relative;
  padding: 10px;
  min-height: 70vh;

  &__summary {
    @extend %smallprint;
    font-style: normal;

    span {
      @extend %smallprint;
      font-style: normal;
    }

    strong {
      font-weight: 800;
      color: $cText;
    }
  }

  &__items {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item {
    border-bottom: 1px solid #eee;
    margin-bottom: 3rem;
    padding: 2rem 0;
  }

}
</style>
