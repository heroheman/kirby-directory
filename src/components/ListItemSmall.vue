<template>
  <div class="listitem listitem--small">

    <router-link tag="h3" class="listitem__name" :to="'/detail/' + item.id + '/' + makeTitleSlug(item.title)" :key="item.id">

      <!-- Item Type -->
      <span class="listitem__type" v-if="item.item_type === 'plugins-v3'">
        <span class="listitem__type-k3">Kirby 3</span>
      </span>
      <span class="listitem__type" v-else-if="item.item_type === 'plugins-v2'">
        <span class="listitem__type-k2">Kirby 2</span>
      </span>
      <span class="listitem__type" v-else-if="item.item_type === 'themes'">
        <span class="listitem__type-theme">Theme</span>
      </span>
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
    <ul class="labels listitem__labels">
      <!-- All Tags -->
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

  </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: [
    'item'
  ],
  data () {
    return {
      showGif: false
    }
  },
  methods: {
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
      if (parts[0] !== 'Version') {
        return label
      } else {
        return parts[1].trim()
      }
    }
  }
}
</script>
