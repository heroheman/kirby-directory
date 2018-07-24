<template>
    <vue-markdown class="content-markdown">
      <slot></slot>
    </vue-markdown>
</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {
  components: {VueMarkdown}
}
</script>
<style lang="scss">
@import './../assets/scss/_vars.scss';
.content-markdown {
  a {
    @include custom-underline(inherit, red);
  }
}
</style>
