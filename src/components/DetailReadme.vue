<template>
  <div class="detail__body-section">

    <h3 class="detail__subheadline is-toggle"
      title="Show Readme"
      @click="showReadme()"
      v-if="!readmeVisible"
      >
      <font-awesome-icon icon="stream" />
      Show Readme
    </h3>

    <h3 class="detail__subheadline is-toggle"
        title="Hide Readme"
        @click="hideReadme()"
        v-else
        >
      <font-awesome-icon icon="stream" />
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
      'getLoading'
    ])
  },
  methods: {
    ...mapActions([
      'getComments',
      'getReadme'
    ]),
    getPluginRepo: function () {
      let bodytext = this.detail.item.body
      let pluginUrl
      let urlparts = []

      // eslint-disable-next-line
      pluginUrl = bodytext.match(/https?:\/\/github.com[^\s\)]+/)
      urlparts = pluginUrl[0].split('/')

      return urlparts[3] + '/' + urlparts[4]
    },
    showReadme: function () {
      if (this.detail.readme === '') {
        this.getReadme(this.getPluginRepo())
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
  @import './../assets/scss/_vars.scss';

  .detail__readme {
    padding: 0 1rem;

    h1, h2, h3, h4, h5, h6 {
      font-size: 2rem;
    }

    img {
      max-width: 100%;
    }

    pre code {
      overflow: scroll;
      white-space: pre-line;

      @media screen and (min-width: $sm) {
        white-space: pre-wrap;
      }
    }
  }
</style>
