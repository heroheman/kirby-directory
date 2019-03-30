<template>
  <div class="list">
    <div class="loadingwrapper" v-if="!hasItems">
      <div class="loadingwrapper__inner">
        <pulse-loader :loading="getLoading" color="red"/>
      </div>
    </div>

    <div class="sticky-summary">
      <b-row>
        <b-col>
          <p class="list__summary" v-if="hasItems">
            There are currently <strong>{{displayedItems.results.length}}</strong> results
            <span v-if="label !== ''">in <strong>{{label}}</strong></span>
            <span v-if="query !== ''">for the term <strong>{{query}}</strong></span>.
            Showing
            <select class="invisible-dropdown"
              v-model="displayedItems.perPage"
              v-on:change="updatePerPageNumber"
            >

              <option disabled value="">Please select</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="70">70</option>
              <option value="100">100</option>

            </select>
            results per page. |
            <span @click="setListitemSize('normal')">normal</span>
            <span @click="setListitemSize('small')"> small</span> <br>
          </p>
        </b-col>
      </b-row>
    </div>

    <b-row>
      <b-col cols="3">
        <QuickNavigation />
      </b-col>

      <b-col cols="9">
        <!-- Regular Items -->
        <ul
          v-if="getListtype === 'normal' && displayedItems !== 0"
          :class="{ 'list__items--themes': isThemes }"
          class="list__items">

          <li class="list__item"
            v-for="item in displayedItems.resultsPaged"
            :key="item.id">
            <ListItem :item="item"/>
          </li>

        </ul>

        <!-- Small Items -->
        <ul
          v-if="getListtype === 'small' && displayedItems !== 0"
          class="list__items">

          <li class="list__item--small"
            v-for="item in displayedItems.resultsPaged"
            :key="item.id">
            <ListItemSmall :item="item"/>
          </li>

        </ul>
      </b-col>
    </b-row>

    <b-row>
      <Pagination />
    </b-row>

  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import QuickNavigation from './QuickNavigation.vue'
import ListItem from './ListItem.vue'
import ListItemSmall from './ListItemSmall.vue'
import Pagination from './Pagination.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import debounce from 'tiny-debounce'

export default {
  name: 'List',
  components: { ListItem, ListItemSmall, Pagination, PulseLoader, QuickNavigation },
  metaInfo () {
    return {
      title: this.getLabel || this.getQuery || 'Home',
      meta: [
        { description: `See all Plugins for the GetKirby CMS labeled with ${this.label || 'all'}` },
        {
          'property': 'og:title',
          'content': (this.getLabel || this.getQuery || 'Home') + ` | ${this.meta.title}`
        },
        {
          'property': 'og:description',
          'content': `See all Plugins for the GetKirby CMS labeled with ${this.label || 'all'}`
        }
      ]
    }
  },
  data () {
    return {
      isThemes: false
    }
  },
  computed: {
    ...mapState([
      'items',
      'query',
      'label',
      'meta',
      'displayedItems'
    ]),
    ...mapGetters([
      'getLoading',
      'getLabel',
      'getQuery',
      'getListtype',
      'getPluginItems'
    ]),
    hasItems: function () {
      return this.items.length > 0
    }
  },
  methods: {
    ...mapActions([
      'fetchItemsAll',
      'getResultsAll',
      'getResultsThemes',
      'getResultsPlugins',
      'getResultsPluginsV2',
      'getResultsPluginsV3',
      'getResultsFilter',
      'getResultsSearch',
      'setItemsPerPage',
      'setListitemSize',
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

      if (this.$route.name === 'ListThemes') {
        this.removeQuery()
        this.removeLabel()
        this.getResultsThemes(page)
      }

      if (this.$route.name === 'ListPluginsV2') {
        this.removeQuery()
        this.removeLabel()
        this.getResultsPluginsV2(page)
      }

      if (this.$route.name === 'ListPluginsV3') {
        this.removeQuery()
        this.removeLabel()
        this.getResultsPluginsV3(page)
      }

      // if is label
      if (this.$route.name === 'List') {
        let label = this.$route.params.label
        this.removeQuery()
        this.getResultsFilter({ label: label, page: page })
      }

      // if has search query
      if (this.$route.name === 'Search') {
        let query = this.$route.params.query
        if (this.$store.getters.getSearchTerm === '') {
          this.setSearchQuery(query)
        }

        this.removeLabel()
        this.getResultsSearch({ query: query, page: page })
      }
    },
    debounceUpdateList: debounce(function () {
      this.updateList()
    }, 1000),
    handleViewStyle: function () {
      if (this.$route.name === 'ListThemes') {
        this.isThemes = true
      } else {
        this.isThemes = false
      }
    }
  },
  watch: {
    '$route.params': function () {
      this.updateList()
    },
    '$route.name': function () {
      this.handleViewStyle()
    },
    'items': function () {
      this.updateList()
    }
  },
  beforeRouteUpdate: function (to, from, next) {
    this.$store.commit('PAGE_CURRENT_RESULTS', to.params.page)
    next()
  },
  created () {
    this.handleViewStyle()
    this.debounceUpdateList()
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

.sticky-summary {

    position: sticky;
    top: 3.5rem;
    background: White;
    margin: 0;
    z-index: 120;
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
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;

    &-excludeditem {
      cursor: pointer;
      position: relative;

      &::after {
        content: ' / ';
      }

      &:last-child {
        &::after {
          content: '';
        }
      }

      &:hover {
        strong {
          &::before{
            content: '';
            border-bottom: 2px solid red;
            position: absolute;
            left: 0;
            top: 50%;
            width: 90%;
          }
        }
      }

      strong {
        display: inline-block;
      }

    }

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

    &--themes {
      column-width: auto;
      column-count: 3;
      > li {
        break-inside: avoid;
      }

    }
  }

  &__item {
    border-bottom: 1px solid #eee;
    margin-bottom: 3rem;
    padding: 2rem 0;

    &--small {
      border-bottom: 1px solid #eee;
      margin: 1rem 0;
    }
  }

}
</style>
