<template>
  <ul class="pagination" v-if="getLastPage > 1">
    <li class="pagination__item" v-for="i in getLastPage" :key="`${label}-${i}`">
      <router-link
        :to="{ name: 'Search', params: { query: query, page: i }}"
        v-if="$route.name === 'Search'">
        {{ i }}
      </router-link>

      <router-link
        :to="{ name: 'ListStart', params: { page: i }}"
        v-else-if="$route.name === 'ListStart'">
        {{ i }}
      </router-link>

      <router-link
        :to="{ name: 'List', params: { label: label, page: i }}"
        v-else>
        {{ i }}
      </router-link>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Pagination',
  computed: {
    ...mapGetters([
      'getLastPage'
    ]),
    ...mapState([
      'items',
      'query',
      'label',
      'displayedItems'
    ])
  }
}
</script>

<style scoped>
  .pagination {
    position: relative;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .pagination__item {
    display: inline-block;
    margin: 0 .3rem;
  }

  .pagination__item a {
    display: inline-block;
    padding: .3rem .6rem;
  }

  .pagination__item .router-link-active {
    background: red;
    color: white;
  }
</style>
