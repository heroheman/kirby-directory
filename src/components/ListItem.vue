<template>
  <div :class="['listitem', getThumbnail(item.body) ? 'listitem--thumb' : '']">

    <router-link tag="h3" class="listitem__name" :to="'/detail/' + item.number + '/' + makeTitleSlug(item.title)" :key="item.id">
      <a>
        {{ item.title }}
      </a>
      <span class="listitem__authorname" v-if="getAuthor(item.body) !== false">
        &mdash; by
        <a :href="`https://github.com/${getAuthor(item.body)}`">
          {{ getAuthor(item.body) }}
        </a>
      </span>
    </router-link>

    <div v-if="getThumbnail(item.body)" class="listitem__thumb">
      <div class="thumb">
        <img
          :src="getThumbnail(item.body)"
          :alt="item.title"
        >
      </div>
    </div>

    <VueMarkdown v-if="item.body"
      :source="cleanMarkdown(item.body)"
      class="listitem__description listitem__description--excerpt">
    </VueMarkdown>

    <p class="listitem__description listitem__description--excerpt" v-else >
      Could'nt find any description
    </p>


    <ul class="labels listitem__labels">
      <li v-if="getGif(item.body)">
        <button class="listitem__playbutton" title="show/hide gif" @click="toggleGif()">
          <span class="triangle"></span>
          <!-- <span v-if="!showGif">Show Gif</span>
          <span v-if="showGif">Hide Gif</span> -->
        </button>
      </li>
      <li class="listitem__label" v-for="label in item.labels" :key="label.id">
        <router-link
          :to="{name:'List', params:{ label: label.name }}"
          :class="['dot', `dot-${getLabelClass(label.name)}`]"
          :title="`show all items with label ${getLabelName(label.name)}`"
          >
          {{ getLabelName(label.name) }}
        </router-link>
      </li>
    </ul>

    <img class="listitem__gif" v-if="showGif" :src="getGif(item.body)" alt="a nice jif">

  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
// import removeMD from 'remove-markdown'

export default {
  name: 'ListItem',
  components: { VueMarkdown },
  props: [
    'item'
  ],
  data () {
    return {
      showGif: false
    }
  },
  methods: {
    getThumbnail: function (text) {
      const regex = /(https?:\/\/.*\.(?:png|jpg))/
      let images = text.match(regex)

      if (images !== null) {
        return images[0]
      } else {
        return false
      }
    },
    getGif: function (text) {
      const regex = /(https?:\/\/.*\.(?:gif|gif))/
      let gifs = text.match(regex)

      if (gifs !== null) {
        console.log(gifs)
        return gifs[0]
      } else {
        return false
      }
    },
    toggleGif: function () {
      this.showGif = !this.showGif
    },
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
    },
    cleanMarkdown: function (description) {
      let cleanDesc
      // remove img markdown from text
      cleanDesc = description.replace(/(!\[.*?\]\()(.+?)(\))/g, '')
      // remove markdown
      // cleanDesc = removeMD(description, { useImgAltText: false })
      // remove urls
      // cleanDesc = description.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
      // remove the single Github, that has no link anymore. sad.
      // cleanDesc = description.replace(/GitHub/ig, '')
      return cleanDesc
    },
    makeTitleSlug: function (title) {
      return title.toString().toLowerCase()
        // Replace spaces with -
        .replace(/\s+/g, '-')
        // Remove all non-word chars
        // eslint-disable-next-line no-useless-escape
        .replace(/[^\w\-]+/g, '')
        // Replace multiple - with single -
        // eslint-disable-next-line no-useless-escape
        .replace(/\-\-+/g, '-')
        // Trim - from start of text
        .replace(/^-+/, '')
        // Trim - from end of text
        .replace(/-+$/, '')
    },
    getLabelClass: function (label) {
      const parts = label.split(':')
      return parts[0]
    },
    getLabelName: function (label) {
      const parts = label.split(':')
      if (parts[0] === 'Version') {
        return label
      } else {
        return parts[1].trim()
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
  grid-template-rows: 1fr auto 1fr;

  @media screen and (min-width: $xs) {
    grid-template-areas: "name" "description" "labels";
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
  }

  &--thumb {
    grid-template-areas: "thumb" "name" "description" "labels";
    grid-template-columns: auto;
    grid-template-rows: 2fr auto auto 1fr;

    @media screen and (min-width: $xs) {
      grid-template-areas: "thumb name" "thumb description" "thumb labels";
      grid-template-columns: 20rem 1fr;
      grid-template-rows: auto auto 1fr;
    }
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

  &__thumb {
    grid-area: thumb;

    .thumb {
      overflow: hidden;
      max-height: 12rem;

      @media screen and (min-width: $xs) {
        max-height: 12rem;
        max-width: 24rem;
        padding-right: 2rem;
      }
    }

    img {
      // width: 24rem;
      width: 100%;
      overflow: hidden;
    }
  }

  &__playbutton {
    appearance: none;
    border: 1px solid #ddd;
    padding: .1rem .3rem .1rem .5rem;
    border-radius: 5px;
    background: transparent;
    transition: all .25s ease;
    cursor: pointer;

    &:hover {
      border-color: #aaa;
      .triangle {
        border-color: transparent transparent transparent #aaa;
      }
    }

    span {
      font-size: 1.2rem;
    }

    .triangle {
      display: inline-block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 5px 0 5px 10px;
      border-color: transparent transparent transparent #ddd;
    }
  }

  &__gif {
    max-width: 100%;
    padding-top: 1rem;
  }

  &__authorname {
    @extend %smallprint;
    display: block;
    @media screen and (min-width: $xs) {
      display: inline-block;
    }
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
      h1, h2, h3, h4, h5, h6, > p:first-child, blockquote + p
      { display: none; }
      p {
        font-size: 1.6rem;
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
