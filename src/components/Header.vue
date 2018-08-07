<template>
<div class="l-header">
  <header class="header">
    <h1 class="header__brand">
      <router-link :to="{name: 'ListStart', params: { page: '1'} }">
        <slot></slot>
      </router-link>
    </h1>
    <div class="header__mobile-nav">
      <router-link tag="button" class="navlist__link" :to="{name: 'ListStart', params: { page: '1'} }" @click.native="hideNav()" title="Home">
        <font-awesome-icon icon="home" color="red" />
      </router-link>
      <router-link tag="button" class="navlist__link" :to="{name: 'ContentFAQ'}" @click.native="hideNav()" title="FAQ">
        <font-awesome-icon icon="question" color="red" />
      </router-link>
      <button class="header__toggle" @click="showMenu()">
        <font-awesome-icon icon="ellipsis-h" color="red" />
      </button>
    </div>
  </header>

  <nav :class="['nav', {'is-open': menuVisible}]">

    <ul class="navlist navlist--main">
      <li>
        <router-link class="navlist__link" :to="{name: 'ListStart', params: { page: '1'} }" @click.native="hideNav()">
          Home
        </router-link>
      </li>
      <li>
        <router-link class="navlist__link" :to="{name: 'ContentFAQ'}" @click.native="hideNav()">
          FAQ
        </router-link>
      </li>
    </ul>

    <ul
      v-for="group in labelGroups"
      :key="group.name"
      class="navlist navlist--label">

      <li class="navlist__desc">{{group.name}}</li>

      <li v-for="type in group.items" :key="type">
        <router-link
          @click.native="hideNav()"
          :to="{ name: 'List', params: { label: `${group.name}: ${mutateNavTitle(type)}`, page: 1 }}"
          :class="['dot', `dot-${group.name}`]"
          >
          {{ type }}
        </router-link>
      </li>
    </ul>

    <!--
    <button
      :disabled="buttonDisabled"
      class="btn--simple" v-on:click="deleteLocalStorage()"
      title="This resets the cache and re-downloads all the data from Github. As the Github API is very limited - please don't abuse it."
    >
      <font-awesome-icon icon="cog" />
      Reset Cache
    </button>
    -->
    <span class="buttonnote" v-if="buttonDisabled">Disabled. Please wait 30 Seconds</span>
  </nav>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import debounce from 'tiny-debounce'

export default {
  name: 'Header',
  data () {
    return {
      buttonDisabled: false,
      menuVisible: false
    }
  },
  computed: {
    ...mapState([
      'labelGroups'
    ])
  },
  methods: {
    ...mapActions([
      'fetchItemsAll',
      'removeItemsAll'
    ]),
    deleteLocalStorage: function () {
      this.removeItemsAll()
      this.fetchItemsAll()
      this.buttonDisabled = true
      this.hideNav()
      this.disableButton()
    },
    disableButton: debounce(function () {
      this.buttonDisabled = false
    }, 30000),
    mutateNavTitle: function (title) {
      return title.replace(' ', '')
    },
    showMenu: function () {
      this.menuVisible = !this.menuVisible
    },
    hideNav: function () {
      this.menuVisible = false
    },
    getLabelClass (payload) {
      return payload
    }
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
