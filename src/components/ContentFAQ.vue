<template>
  <Content>
# About

[Kirby](https://getkirby.com) is a file-based CMS by Bastian Allgeier. Unlike other systems such as ModX, Typo3 or even Wordpress, it can be set up quickly and yet is very flexible. It also allows extensions using plugins.

This page is a frontend [for the great plugin collection](https://github.com/jenstornell/kirby-plugins) of Jens Törnell on Github. Since Github itself is only moderately usable and I always wanted to implement a project with [Vue.js](https://vuejs.org), I took the opportunity and built a frontend myself using the [Github API](https://developer.github.com/v3/).

## FAQ

### *Who are you?*
I am Florenz Heldermann and an independent frontend developer from Bremen, Germany. More information can be found on my [site](https://flore.nz), [blog](https://flore.nz/blog) or on [Twitter](https://twitter.com/track02). On LinkedIn and Xing I can also be found, but don't even get the idea to reach me there in a timely manner.

### *The search does not work! What is a rate limit?*
The search is currently a direct request to the Github API. This does not allow [more than 10 requests](https://developer.github.com/v3/rate_limit/). If it doesn't work, please wait a moment - usually no more than a few seconds - and then try again.
Hopefully one of the next updates will solve this problem.

### *How can I add my plugin?*
Not here at all. Please go to the plugin repository on Github and add an issue. The issue should have a title, a short summary and a link to your Github repository.

### *How can I add my plugin?*
Not here at all. Please go to the [plugin repository](https://github.com/jenstornell/kirby-plugins) on Github and add an issue. The issue should have a title, a short summary and a link to your Github repository.

### *I have a problem with Plugin XYZ!!!!1111oneeleven*
Don't ask me, ask the plugin author.

### *I have a problem with Kirby. Can you help me?*
No! That's what the [Kirby Support Forum](https://github.com/jenstornell/kirby-plugins) is for.

### *What was this site built with?*
This site was built using Vue.js, vue-cli (with webpack-simple), [VueMarkdown](https://github.com/miaolz123/vue-markdown) and the Github Api.

### *Um... So no Kirby?*
Right. This page is currently the only page I have written by myself. Probably as soon as [Kirby 3](https://getkirby.com/next) (with the new built-in Rest API) is released I will use a Kirby installation as backend.

### *Your code sucks!*
I know. I'm still learning.

## Changelog
* initial release

## Roadmap
* [ ] Ask Jens if he agrees that I use his data.
* [ ] improved search with cached results
* [x] Vuex State Implementation
* [ ] Kirby as content backend
* [ ] Github Login / Firebase Integration  for faving plugins
* [ ] add kirby templates
  </Content>
</template>

<script>
import Content from './Content.vue'
export default {
  components: {Content}
}
</script>

<style lang="scss">
</style>
