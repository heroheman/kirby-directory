<template>
  <div>
    <b-list-group>
      <b-list-group-item
        v-for="label in labels" :key="label.id"
        class="d-flex justify-content-between align-items-center">

        <router-link :to="{name: 'Search', params: {query: label.short}}">
          {{ label.short }}
          <b-badge variant="primary" pill>{{label.amount}}</b-badge>
        </router-link>

      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'getLabels'
    ]),
    labels: function () {
      return this.getLabels.filter(l => l.amount > 15)
    }
  }
}
</script>
