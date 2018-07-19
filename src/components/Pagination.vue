<template>
  <ul class="pagination" v-if="getLastPage > 0">
    <li class="pagination__item" v-for="i in getLastPage" :key="`${label}-${i}`">
      <router-link
        :to="{ name: 'ListStart', params: { page: i }}"
        v-if="label === '' || label === undefined">
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
import { mapGetters } from 'vuex'
export default {
  name: 'Pagination',
  props: [
    'label',
    'page'
  ],
  computed: {
    ...mapGetters([
      'getLastPage'
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
