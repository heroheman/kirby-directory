<template>
  <div>

    {{ getLoading }}
    <br>

    <!-- <vue-fuse :keys="keys" :list="items" event-name="searchChanged" :treshold="0.1"/>

    <ul>
      <li v-for="item in searchResults" :key="item.id">
        {{item.title}}
        {{item.body}}
      </li>
    </ul> -->

    <router-link :to="{ name: 'ListStart' }">All</router-link>
    <router-link :to="{ name: 'List', params: { label: 'Panel' }}">Panel</router-link>
    <router-link :to="{ name: 'List', params: { label: 'Panel', page: 1 }}">Panel 1</router-link>
    <router-link :to="{ name: 'List', params: { label: 'Panel', page: 2 }}">Panel 2</router-link>
    <router-link :to="{ name: 'List', params: { label: 'CLI' }}">CLI</router-link>
    <router-link :to="{ name: 'List', params: { label: 'Commercial' }}">Commercial</router-link>

    <button @click="decPage()">Prev</button>
    <button @click="getPage(2)">goto2</button>
    <button @click="incPage()">Next</button>
    <ol>
      <li v-for="item in displayedItems.resultsPaged" :key="item.id">
        <ListItem :item="item"/>
      </li>
    </ol>
    <Pagination :label="label" :currentPage="page"/>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import VueFuse from 'vue-fuse'
import ListItem from './ListItem.vue'
import Pagination from './Pagination.vue'

export default {
  name: 'List',
  components: {VueFuse, ListItem, Pagination},
  data () {
    return {
      keys: ['title'],
      searchResults: [],
      label: this.$route.params.label || '',
      page: this.$route.params.page || '0'
    }
  },
  computed: {
    ...mapState([
      'items',
      'displayedItems'
    ]),
    ...mapGetters([
      'getLoading'
    ])
  },
  watch: {
    '$route.params': function () {
      this.label = this.$route.params.label
      this.page = this.$route.params.page || 1
      this.$store.dispatch('getResultsFilter', {label: this.label, page: this.page})

    }
  },
  methods: {
    ...mapActions([
      'fetchItemsAll',
      'getResultsAll',
      'getResultsFilter'
    ])
  },
  created () {
  },
  mounted () {
    let label = this.$route.params.label
    let page = this.$route.params.page || 1
    this.$store.dispatch('getResultsFilter', {label: label, page: page})

    // if (this.$route.params.label === undefined) {
    //   this.$store.dispatch('getResultsAll')
    // } else {
    //   this.label = this.$route.params.label
    //   this.$store.dispatch('getResultsFilter', {label: this.label})
    // }

    this.$on('searchChanged', results => {
      this.searchResults = results
    })
  }
}
</script>

<style scoped>
</style>
