<template>
  <div>

    {{ getLoading }}
    <br>

    <!-- <ul>
      <li v-for="item in getItemsByLabel('CLI')" :key="item.id">
        {{item.title}}
        {{item.comments}}
        <span v-for="label in item.labels" :key="label.id">
          {{label.name}}
        </span>
      </li>
    </ul> -->

    <!-- <vue-fuse :keys="keys" :list="items" event-name="searchChanged" :treshold="0.1"/>

    <ul>
      <li v-for="item in searchResults" :key="item.id">
        {{item.title}}
        {{item.body}}
      </li>
    </ul> -->

    <router-link :to="{ name: 'ListStart' }">All</router-link>
    <router-link :to="{ name: 'List', params: { label: 'Panel' }}">Panel</router-link>
    <router-link :to="{ name: 'List', params: { label: 'CLI' }}">CLI</router-link>
    <router-link :to="{ name: 'List', params: { label: 'Commercial' }}">Commercial</router-link>

    <ol>
      <li v-for="item in displayedItems.results" :key="item.id">
        {{ item.title }} &mdash;
        <span v-for="label in item.labels" :key="label.id">
          {{label.name}}
        </span>
      </li>
    </ol>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import VueFuse from 'vue-fuse'

export default {
  name: 'List',
  components: {VueFuse},
  data () {
    return {
      keys: ['title'],
      searchResults: []
    }
  },
  computed: {
    filterByPanel () {
      return this.$store.state.items.filter(item => item.comments > 3)
    },
    ...mapState([
      'items',
      'displayedItems'
    ]),
    ...mapGetters([
      'getLoading'
    ])
  },
  watch: {
    '$route.params.label': function () {
      if (this.$route.params.label) {
        this.label = this.$route.params.label
        this.$store.dispatch('setResultsFilter', {label: this.label})
      } else {
        this.$store.dispatch('setResultsAll')
      }
    }
  },
  methods: {
    ...mapActions([
      'fetchItemsAll',
      'setResultsAll',
      'setResultsFilter'
    ])
  },
  created () {
  },
  mounted () {
    if (this.$route.params.label === undefined) {
      console.log('has no label')
      this.$store.dispatch('setResultsAll')
    } else {
      console.log('has label')
      this.label = this.$route.params.label
      this.$store.dispatch('setResultsFilter', {label: this.label})
    }

    this.$on('searchChanged', results => {
      this.searchResults = results
    })
  }
}
</script>

<style scoped>
</style>
