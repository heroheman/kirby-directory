<template>
  <div class="detail__body-section">

    <div>
      <pulse-loader color="red" :loading="!readme"/>
      <vue-markdown class="detail__readme" :source="encodeReadme(readme)" />
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'DetailReadmeView',
  components: { VueMarkdown, PulseLoader },
  props: ['readme'],
  methods: {
    encodeReadme: function (text) {
      return atob(text)
    }
  }
}
</script>
<style lang="scss">
  @import './../assets/scss/_vars.scss';

  .detail__readme {
    padding: 0;

    h1, h2, h3, h4, h5, h6 {
      font-size: 1.2rem;
      margin-top: 1rem;
    }

    h1, h2 {
      font-size: 1.5rem;
      border-bottom: 1px solid #ccc;
      margin-top: 2.5rem;
    }

    img {
      max-width: 100%;
    }

    pre {
      // white-space: pre-wrap;
      white-space: pre-line;
      word-wrap: break-word;
      text-align: justify;
      border: 1px solid #ddd;
      padding: .5rem;
      font-size: small;
      background: white;

      @media screen and (min-width: $sm) {
        white-space: pre-wrap;
      }
    }

    pre code {
      overflow: scroll;
      white-space: pre-line;
      word-wrap: break-word;
      text-align: justify;

      @media screen and (min-width: $sm) {
        white-space: pre-wrap;
      }
    }
  }
</style>
