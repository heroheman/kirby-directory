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
  <br>

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
  watch: {
    '$route.params': function () {
      // if is label
      if (this.$route.params.label !== '' && this.$route.params.query !== '') {
        let page = this.$route.params.page || 1
        console.log('load all item with page: ', page)

        this.$store.dispatch('getResultsAll')
        this.$store.commit('PAGE_CURRENT_RESULTS', page)
      }
    },
    '$route.params.label': function () {
      // if is label
      if (this.$route.params.label !== '') {
        let label = this.$route.params.label
        let page = this.$route.params.page || 1
        console.log('has label: ', label, page)
        this.$store.dispatch('getResultsFilter', {label: label, page: page})
      }
    },
    '$route.params.query': function () {
      // if has search query
      if (this.$route.params.query !== '' || this.$route.params.query !== undefined) {
        let query = this.$route.params.query
        let page = this.$route.params.page || 1
        console.log('has search: ', query, page)
        this.getResultsSearch({query: query, page: page})
      }
    },
    '$route.params.page': function () {
      // no searchquery, no label
      if (this.$route.params.page !== '') {
        let page = this.$route.params.page || 1

        if (this.$route.params.label !== '' && this.$route.params.label !== undefined) {
          console.log('label page changed to: ', page)
          // this.$store.dispatch('getResultsFilter', {label: label, page: page})
          this.$store.commit('PAGE_CURRENT_RESULTS', page)
        }
        if (this.$route.params.query !== '' && this.$route.params.query !== undefined) {
          console.log('search page changed to: ', page)
          // this.getResultsSearch({query: query, page: page})
          this.$store.commit('PAGE_CURRENT_RESULTS', page)
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'fetchItemsAll',
      'getResultsAll',
      'getResultsFilter',
      'getResultsSearch'
    ])
  },
  created () {
  },
  mounted () {
    console.log('list mounted')
    let page = this.$route.params.page || 1

    // if is label
    if (this.$route.params.label !== '') {
      let label = this.$route.params.label
      console.log('has label: ', label, page)
      this.$store.dispatch('getResultsFilter', {label: label, page: page})
    }
    // if has search query
    if (this.$route.params.query !== '' && this.$route.params.query !== undefined) {
      let query = this.$route.params.query
      console.log('has search: ', query, page)
      this.getResultsSearch({query: query, page: page})
    }
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

  .v-spinner {
  }

  p {
    @extend %smallprint;
  }
}
.list {
  position: relative;
  padding: 10px;
  min-height: 70vh;

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
