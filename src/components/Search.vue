<template>
  <section class="search">

    <form @submit.prevent="searchQuery">
      <label for="main-search" class="search__searchlabel">Search</label>
      <input class="search__searchfield" name="main-search" id="main-search" type="text" v-model="search" @keyup="searchQuery"
        placeholder="search by title, description, label or author and press enter"
        />
      <button class="search__searchbutton" type="submit">
        <span class="only-sr">Submit search</span>
        <font-awesome-icon icon="search" color="#333" aria-hidden="true" />
      </button>
    </form>

    <div class="search__ctrls">
      <div class="checkbox">
        <div class="checkbox__desc">
          Limit search to:
        </div>
        <div class="checkbox__box">
          <input type="checkbox" id="typePlugin">
          <label for="typePlugin">Plugins</label>
        </div>
        <div class="checkbox__box">
          <input type="checkbox" id="typeTheme">
          <label for="typeTheme">Themes</label>
        </div>
      </div>

      <div class="checkbox">
        <div class="checkbox__desc">
          Just show me:
        </div>
        <div class="checkbox__box">
          <input type="checkbox" id="typePlugin">
          <label for="typePlugin">Kirby 2</label>
        </div>
        <div class="checkbox__box">
          <input type="checkbox" id="typeTheme">
          <label for="typeTheme">Kirby 3</label>
        </div>
      </div>

      <div class="checkbox">
        <div class="checkbox__box">
          <input type="checkbox" id="typePlugin">
          <label for="typePlugin">Hide Commercial</label>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import debounce from 'tiny-debounce'

export default {
  name: 'Search',
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
  mounted () {
  },
  methods: {
    ...mapActions([
      'getResultsFilter',
      'getResultsSearch',
      'setSearchQuery'
    ]),
    searchQuery: debounce(function (e) {
      e.preventDefault()
      if (this.search !== '') {
        this.$router.push({ name: 'Search', params: { query: this.$store.getters.getSearchTerm, page: 1 } })
        // this.getResultsSearch({query: this.search, page: 1})
      } else {
        this.$router.push({ name: 'ListStart', params: { page: 1 } })
      }
    }, 500)
  },
  beforeRouteLeave: function (to, from, next) {
    if (from.name === 'Search') {
      this.$store.dispatch('removeQuery')
      this.search = ''
    }
    next()
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
  margin-bottom: 6rem;

  form {
    margin-bottom: .5rem;
  }

  @media screen and (min-width: $xs) {
    margin-bottom: 6rem;
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
    top: 1rem;
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
