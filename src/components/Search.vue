<template>
  <section class="search">

    <b-jumbotron
      header-tag="h2"
      header-level="6"
      bg-variant="white"
      border-variant="black"
      text-variant="black"
      lead="A collection of plugins and themes for Kirby CMS">

      <form @submit.prevent="searchQuery">
        <label for="main-search" class="search__searchlabel">Search</label>
        <b-form-input  name="main-search" id="main-search" type="text" v-model="search" @keyup="searchQuery"
          placeholder="search by title, description, label or author and press enter"
        />
        <button class="search__searchbutton" type="submit">
          <span class="only-sr">Submit search</span>
          <font-awesome-icon icon="search" color="#333" aria-hidden="true" />
        </button>
      </form>
    </b-jumbotron>

  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import debounce from 'tiny-debounce'

export default {
  name: 'Search',
  data () {
    return {
      filter: {
        radioType: 'typeAll',
        radioVersion: 'versionAll',
        hideCommercial: false
      }
    }
  },
  computed: {
    search: {
      get () {
        return this.$store.getters.getSearchTerm
      },
      set (value) {
        // this.$store.commit('SET_SEARCH_QUERY', value)
        this.setSearchQuery(value)
      }
    },
    ...mapState([
      'items',
      'displayedItems'
    ]),
    ...mapGetters([
      'getLoading'
    ])
  },
  methods: {
    ...mapActions([
      'getResultsFilter',
      'getResultsSearch',
      'getResultsPlugins',
      'getResultsPluginsV2',
      'getResultsPluginsV3',
      'getResultsThemes',
      'setSearchQuery',
      'excludeItem',
      'includeItem'
    ]),
    searchQuery: debounce(function (e) {
      e.preventDefault()
      if (this.search !== '') {
        this.$router.push({ name: 'Search', params: { query: this.$store.getters.getSearchTerm, page: 1 } })
        // this.getResultsSearch({query: this.search, page: 1})
      } else {
        this.$router.push({ name: 'ListStart', params: { page: 1 } })
      }
    }, 500),
    applyFilter: function () {
      this.applyVersionFilter()
    },
    applyVersionFilter: function () {
      switch (this.filter.radioVersion) {
        case 'version2':
          this.excludeItem('Kirby 3 Theme')
          this.includeItem('Kirby 2 Theme')
          this.excludeItem('Version: 3')
          this.includeItem('Version: 2')
          break
        case 'version3':
          this.excludeItem('Kirby 2 Theme')
          this.includeItem('Kirby 3 Theme')
          this.excludeItem('Version: 2')
          this.includeItem('Version: 3')
          break
        default:
          this.includeItem('Kirby 2 Theme')
          this.includeItem('Kirby 3 Theme')
          this.includeItem('Version: 2')
          this.includeItem('Version: 3')
          break
      }
    }
  },
  beforeRouteLeave: function (to, from, next) {
    if (from.name === 'Search') {
      this.$store.dispatch('removeQuery')
      this.search = ''
    }
    next()
  },
  watch: {
    'filter.radioVersion': function () {
      this.applyVersionFilter()
    },
    'filter.radioType': function () {
      this.applyTypeFilter()
    }
  }
}
</script>

<style lang="scss">
@import './../assets/scss/_vars.scss';

.search {
  position: relative;
  top: 1rem;
  width: 100%;
  margin-top: .5rem;
  margin-bottom: 5.5rem;

  .jumbotron {
    padding: 2rem;
  }

  form {
    margin-bottom: .5rem;
    position: relative;
  }

  &__searchlabel {
    @extend %only-sr;
  }

  &__searchfield {
    position: relative;
    width: 100%;
    padding: 1rem;
    background: white;
    box-shadow: 0;
    appearance: none;
    border: 1px solid $cBorder;
  }

  &__searchbutton {
    position: absolute;
    top: .5rem;
    right: 1rem;
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    background: 0;
    img {
        width: 2rem;
        height: 2rem;
    }
    span {
      @extend %only-sr;
    }
  }
}
</style>
