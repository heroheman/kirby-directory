<template>
  <div class="detail__body-section">

    <h3 class="detail__subheadline is-toggle"
      title="Show Readme"
      @click="showReadme()"
      >
      Show Readme
    </h3>

    <h3 class="detail__subheadline is-toggle"
        title="Hide Readme"
        @click="hideReadme()"
        >
      Hide Readme
    </h3>

    <vue-markdown class="detail__readme" :source="detail.readme" v-if="readmeVisible">
    </vue-markdown>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'DetailReadmeView',
  components: {VueMarkdown},
  data () {
    return {
      readmeVisible: false
    }
  },
  computed: {
    ...mapState([
      'detail'
    ]),
    ...mapGetters([
      'getLoading',
      'getPluginRepo'
    ])
  },
  methods: {
    ...mapActions([
      'getComments',
      'getReadme'
    ]),
    showReadme: function () {
      if (this.detail.readme === '') {
        this.getReadme(this.getPluginRepo)
      }
      this.readmeVisible = true
    },
    hideReadme: function () {
      this.readmeVisible = false
    }
  }
}
</script>
<style lang="scss">
.detail__readme {
    padding: 0 1rem;

    h1, h2, h3, h4, h5, h6 {
      font-size: 2rem;
    }
  }
</style>
