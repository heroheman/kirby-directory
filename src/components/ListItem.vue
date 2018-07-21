<template>
  <div class="listitem">

    <router-link tag="h3" class="listitem__name" :to="'/detail/' + item.number" :key="item.id">
      <a>
        {{ item.title }}
      </a>
      <span class="listitem__authorname" v-if="getAuthor(item.body) !== false">
        &mdash; by
        <a href="#">
          {{ getAuthor(item.body) }}
        </a>
      </span>
    </router-link>

    <VueMarkdown v-if="item.body"
      :source="item.body"
      class="listitem__description listitem__description--excerpt">
      {{ item.body }}
    </VueMarkdown>

    <p class="listitem__description listitem__description--excerpt" v-else >
      Could'nt find any description
    </p>

    <ul class="labels listitem__labels">
      <li class="listitem__label" v-for="label in item.labels" :key="label.id">
        <router-link
          :to="{name:'List', params:{ label: label.name }}"
          :class="[`dot-${label.name}`]"
          >
          {{ label.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'ListItem',
  components: { VueMarkdown },
  props: [
    'item'
  ],
  methods: {
    getAuthor: function (bodytext) {
      let pluginUrl
      let urlparts = []

      // eslint-disable-next-line
      pluginUrl = bodytext.match(/https?:\/\/github.com[^\s\)]+/) || false

      if (!pluginUrl) {
        return false
      } else {
        urlparts = pluginUrl[0].split('/')
        return urlparts[3]
      }
    }
  }
}
</script>

<style lang="scss">
@import './../assets/scss/_vars.scss';

.listitem {
  display: grid;
  grid-template-areas: "name" "description" "labels";
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;

  @media screen and (min-width: $sm) {
    // grid-template-areas: "name name labels" "description description description";
    // grid-template-areas: "name" "description" "labels";
    // grid-template-columns: 40% 1fr;
    // grid-template-rows: 1fr;
  }

  &__name {
    grid-area: name;
    display: block;
    margin: 0;
    margin-bottom: 1rem;

    @extend %h18;
    a {
      @include custom-underline;
    }
  }

  &__authorname {
    @extend %smallprint;
    span, a {
      @extend %smallprint;
    }
    a {
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__labels {
    grid-area: labels;
    text-align: left;
    margin: 0 2rem 0 0;
    padding: 1rem 0;

    @media screen and (min-width: $sm) {
      // text-align: right;
      // padding: 0;
    }
  }

  &__description {
    grid-area: description;
    margin-bottom: 1rem;
    &--excerpt {
      img, img, pre, ul, strong, br, table,
      h1, h2, h3, h4, h5, h6, p > a, blockquote + p
      { display: none; }
      p {
        padding: 0;
        margin: 0;
      }
      blockquote {
        font-style: italic;
        padding: 0;
        margin: 0;
        p {display: inline;}
      }
    }
  }
}
</style>
