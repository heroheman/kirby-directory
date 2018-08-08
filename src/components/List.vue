<template>
  <div class="list">

    <div class="loadingwrapper" v-if="getLoading">
      <div class="loadingwrapper__inner">
        <pulse-loader :loading="getLoading" color="red"/>
      </div>
    </div>

    <p class="list__summary" v-if="!getLoading">
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
  metaInfo () {
    return {
      title: this.getLabel || this.getQuery || 'Home',
      meta: [
        {description: `All Plugins labeled with ${this.label}`}
      ]
    }
  },
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
      'getLoading',
      'getLabel',
      'getQuery'
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
      let page = this.$route.params.page || 1

      if (this.$route.name === 'ListStart') {
        this.removeQuery()
        this.removeLabel()
        this.getResultsAll(page)
      }

      // if is label
      if (this.$route.name === 'List') {
        let label = this.$route.params.label
        this.removeQuery()
        this.getResultsFilter({label: label, page: page})
      }

      // if has search query
      if (this.$route.name === 'Search') {
        let query = this.$route.params.query
        if (this.$store.getters.getSearchTerm === '') {
          this.setSearchQuery(query)
        }

        this.removeLabel()
        this.getResultsSearch({query: query, page: page})
      }
    }
  },
  watch: {
    '$route.params': function () {
      this.updateList()
    }
  },
  beforeRouteUpdate: function (to, from, next) {
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
  text-align-last:center;
  appearance: none;
  background: transparent;
  border: 0;
  font-weight: 800;
  border-bottom: 2px solid red;
  width: 30px;
}

.list {
  position: relative;
  padding: 0;
  min-height: 70vh;

  &__summary {
    @extend %smallprint;
    font-style: normal;
    font-size: 1.4rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;

    span {
      @extend %smallprint;
      font-size: inherit;
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
