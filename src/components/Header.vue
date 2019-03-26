<template>
<div class="l-header">
  <header class="header">
    <h1 class="header__brand">
      <router-link :to="{name: 'ListStart', params: { page: '1'} }">
        <slot></slot>
      </router-link>
    </h1>
    <div class="header__mobile-nav">
      <router-link tag="button" class="navlist__link"
        :to="{name: 'ListStart', params: { page: '1'} }"
        title="Home">
        <font-awesome-icon icon="home" color="red" />
      </router-link>
      <router-link tag="button" class="navlist__link"
        :to="{name: 'ContentFAQ'}"
        title="FAQ">
        <font-awesome-icon icon="question" color="red" />
      </router-link>
      <!-- <button class="header__toggle" @click="showMenu()">
        <font-awesome-icon icon="ellipsis-h" color="red" />
      </button> -->
    </div>
  </header>

  <nav :class="['nav', {'is-open': menuVisible}]">

    <ul class="navlist navlist--main">
      <li>
        <router-link class="navlist__link"
          :to="{name: 'ListStart', params: { page: '1'} }"
          @click.native="toggleTags()">
          All
        </router-link>
        <ul class="navlist navlist--inline" v-if="labelTagsVisible">
          <li
            v-for="label in sortLabelsByTag(labels)"
            :key="label.id"
          >
            <router-link
              :class="['dot', `dot-${label.name}`]"
              :to="{ name: 'List', params: { label: label.name, page: 1 }}"
              :style="`--label-color: #${label.color}`"
            >{{label.shortname}}
            </router-link>
          </li>
        </ul>
      </li>

      <li>
        <router-link class="navlist__link"
          :to="{name: 'ListPluginsV2', params: { page: '1'} }"
          @click.native="toggleK2()">
          Plugins for Kirby 2
        </router-link>
        <ul class="navlist navlist--label" v-if="labelV2Visible">
          <li
            v-for="label in sortLabelsByType(getLabelsPluginsV2)"
            :key="label.id"
          >
            <router-link
              :class="['dot', `dot-${label.name}`]"
              :to="{ name: 'List', params: { label: label.name, page: 1 }}"
              :style="`--label-color: #${label.color}`"
            >{{label.shortname}}
            </router-link>
          </li>
        </ul>
      </li>

      <li>
        <router-link class="navlist__link"
          :to="{name: 'ListPluginsV3', params: { page: '1'} }"
          @click.native="toggleK3()">
          Plugins for Kirby 3
        </router-link>
        <ul class="navlist navlist--label" v-if="labelV3Visible">
          <li
            v-for="label in sortLabelsByType(getLabelsPluginsV3)"
            :key="label.id"
          >
            <router-link
              :class="['dot', `dot-${label.name}`]"
              :to="{ name: 'List', params: { label: label.name, page: 1 }}"
              :style="`--label-color: #${label.color}`"
            >{{label.shortname}}
            </router-link>
          </li>
        </ul>
      </li>
      <li>
        <router-link class="navlist__link"
          :to="{name: 'ListThemes', params: { page: '1'} }"
          @click.native="toggleThemes()">
          Themes
        </router-link>

        <ul class="navlist navlist--label" v-if="labelThemeVisible">
          <li
            v-for="label in getLabelsThemes"
            :key="label.id"
          >
            <router-link
              :class="['dot', `dot-${label.name}`]"
              :to="{ name: 'List', params: { label: label.name, page: 1 }}"
              :style="`--label-color: #${label.color}`"
            >{{label.name}}
            </router-link>
          </li>
        </ul>

      </li>
      <li>
        <router-link class="navlist__link"
          :to="{name: 'ContentFAQ'}"
          @click.native="hideNav()">
          FAQ
        </router-link>
      </li>
    </ul>
  </nav>
</div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'Header',
  data () {
    return {
      buttonDisabled: false,
      menuVisible: false,
      labelThemeVisible: false,
      labelV2Visible: false,
      labelV3Visible: false,
      labelTagsVisible: true
    }
  },
  computed: {
    ...mapState([
      'labels'
    ]),
    ...mapGetters([
      'getExcluded',
      'getLabelsThemes',
      'getLabelsPluginsV2',
      'getLabelsPluginsV3'
    ])
  },
  methods: {
    ...mapActions([
      'fetchItemsAll',
      'removeItemsAll',
      'excludeItem',
      'includeItem',
      'getLabels'
    ]),
    mutateNavTitle: function (title) {
      return title.replace(' ', '')
    },
    makeTitleSlug: function (title) {
      return title.replace(' ', '-')
    },
    showMenu: function () {
      this.menuVisible = !this.menuVisible
    },
    toggleThemes: function () {
      this.labelThemeVisible = true
      this.labelV2Visible = false
      this.labelV3Visible = false
      this.labelTagsVisible = false
    },
    toggleK2: function () {
      this.labelThemeVisible = false
      this.labelV2Visible = true
      this.labelV3Visible = false
      this.labelTagsVisible = false
    },
    toggleK3: function () {
      this.labelThemeVisible = false
      this.labelV2Visible = false
      this.labelV3Visible = true
      this.labelTagsVisible = false
    },
    toggleTags: function () {
      this.labelThemeVisible = false
      this.labelV2Visible = false
      this.labelV3Visible = false
      this.labelTagsVisible = true
    },
    getLabelName (name, type) {
      return `${name}: ${this.mutateNavTitle(type)}`
    },
    getLabelClass (payload) {
      return payload
    },
    isExcluded (label) {
      return this.getExcluded.includes(label)
    },
    sortLabelsByType (labels) {
      // TODO: this is shitty
      let sortedLabels = []
      for (let label of labels) {
        let splitted = label.name.split(':')
        if (splitted[1]) {
          label.groupname = splitted[0]
          label.shortname = splitted[1]
        }
        sortedLabels.push(label)
      }
      sortedLabels = sortedLabels
        .sort((a, b) => (a.groupname > b.groupname) ? 1 : ((b.groupname > a.groupname) ? -1 : 0))
      sortedLabels = sortedLabels.filter(i => i.groupname === 'Type' || i.groupname === 'Has')
      return sortedLabels
    },
    sortLabelsByTag (labels) {
      // TODO: this is shitty
      let sortedLabels = []
      for (let label of labels) {
        let splitted = label.name.split(':')
        if (splitted[1]) {
          label.groupname = splitted[0]
          label.shortname = splitted[1]
        }
        sortedLabels.push(label)
      }
      sortedLabels = sortedLabels.filter(i => i.groupname === 'Tag')
      return sortedLabels
    }
  },
  mounted () {
    this.getLabels()
  }
}
</script>

<style lang="scss">
@import './../assets/scss/_vars.scss';

.buttonnote {
  display: block;
  font-size: 1rem;
  @extend %smallprint;
}

.header {
  display: flex;
  position: relative;
  margin-top: 2rem;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 3rem;

  @media screen and (min-width: $xs) {
    margin-bottom: 5rem;
  }

  &__mobile-nav {
    position: absolute;
    right: 0;

    @media screen and (min-width: $xs) {
      display: none;
    }

    button {
      appearance: none;
      border: none;
      background: transparent;
      font-size: 2rem;
    }
  }

  &__icons {
    flex-basis: 50%;
    align-self: flex-end;
    text-align: right;
    padding-right: 2rem;
  }

  &__brand {
    flex-basis: 50%;
    margin: 0;
    vertical-align: middle;
    font-weight: 400;
    font-size: 2rem;

    &::before {
      content: '';
      position: relative;
      display: inline-block;
      width: 1.3rem;
      height: 1.3rem;
      margin-right: .5rem;
      background: red;
      border-radius: 50%;
    }

    span {
      font-size: inherit;
      font-weight: 800;
      // font-style: italic;
    }

    img {
      position: relative;
      top: 9px;
      max-width: 3rem;
      max-height: 3rem;
    }
  }

  &__filter {
    flex-basis: 100%;
  }

  @media screen and (min-width: $xs) {
    &__icons {
      display: none;
    }
    &__brand {
      flex-basis: 100%;
    }
  }
}

.nav {
  position: relative;
  display: none;
  height: 100vh;
  &.is-open {
    display: block;
  }
  @media screen and (min-width: $xs) {
    display: block;
    height: auto;
  }
}

.navlist {
  position: relative;
  list-style: none;
  margin: 0 0 2rem;
  padding: 0 2rem 0 0;
  @media screen and (min-width: $xs) {
    margin: 0 0 3rem;
  }

  > li {
    margin: 0 .5rem .5rem 0;
    &::not(.navlist__desc) {
      display: inline-block;
    }
    > a {
      text-decoration: none;
      font-weight: 800;
      text-transform: capitalize;
      border: 0;
    }
  }

  &--main {
    display: none;
    @media screen and (min-width: $xs) {
      display: block;
    }
  }

  &--label {
    margin-top: 1rem;
    > li {
      margin-right: 1rem;
      &::not(.navlist__desc) {
        display: block;
      }

      &:not(.navlist__desc) {
        display: inline-block;
      }

      a {
        font-weight: 400;
      }
    }
  }

  &--inline {
    margin-top: 1rem;
    > li {
      display: inline-block !important;
      margin-right: 1.5rem;
      a {
        font-weight: 400;
      }
    }
  }

  &__exclude {
    cursor: pointer;
    display: inline-block;
    font-size: 1.2rem;

    @media screen and (min-width: $xs) {
      margin-left: .5rem;
    }
  }

  &__desc {
    font-weight: 800;
    display: none;
    @media screen and (min-width: $xs) {
      display: block;
    }
  }

  @media screen and (min-width: $xs) {
    > li {
      display: block;
      &:not(.navlist__desc) {
        display: block;
      }
    }
  }
}
</style>
