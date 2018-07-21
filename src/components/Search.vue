<template>
  <section class="search">

    <input class="search__searchfield" name="" type="text" v-model="search" @keyup="searchQuery"
      placeholder="search for plugin, label, author or anything else"
      />

    <button class="search__searchbutton" @click="searchQuery">
      <img alt="" src="../assets/icons/search.png"/>
    </button>

  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'Search',
  data () {
    return {
      search: ''
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
  mounted () {
  },
  methods: {
    ...mapActions([
      'getResultsFilter',
      'getResultsSearch'
    ]),
    searchQuery: function () {
      if (this.search !== '') {
        this.$router.push({name: 'Search', params: {query: this.search, page: 1}})
        this.getResultsSearch({query: this.search, page: 1})
      } else {
        this.$router.push({name: 'ListStart', params: {page: 1}})
      }
    }
  }
}
</script>

<style lang="scss">
.search {
  position: relative;
  top: 1rem;
  width: 100%;
  margin-bottom: 5rem;

  &__searchfield {
    width: 100%;
    padding: 1rem;
  }

  &__searchbutton {
    position: absolute;
    top: 1rem;
    right: 2rem;
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    background: 0;
    img {
        width: 2rem;
        height: 2rem;
    }
  }
}
</style>
