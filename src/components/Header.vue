<template>
<div class="l-header">
  <header class="header">
    <h1 class="header__brand">
      <!-- <img alt="" src="../assets/kirbyicon.png"/> -->
      <slot></slot>
    </h1>
    <button class="header__toggle" @click="showMenu()">
      <font-awesome-icon icon="ellipsis-h" color="red" />
    </button>
  </header>

  <nav :class="['nav', {'is-open': menuVisible}]">

    <ul class="navlist">
      <li>
        <router-link :to="{name: 'ListStart', params: { page: '1'} }">Home</router-link>
      </li>
      <li>
        <router-link :to="{name: 'ContentFAQ'}">FAQ</router-link>
      </li>
      <li>
        <router-link :to="{name: 'ContentPrivacy'}">Privacy</router-link>
      </li>
      <!-- <li>
        <router-link :to="{'path': '/about'}">About & FAQ</router-link>
      </li> -->
      <!-- <li>
        <router-link :to="{'path': '/privacy'}">Privacy</router-link>
      </li> -->
    </ul>

    <ul class="navlist navlist--label">
      <li class="navlist__desc">{{labelTypes.name}}</li>
      <li v-for="type in labelTypes.items" :key="type">
        <router-link
          :to="{ name: 'List', params: { label: type, page: 1 }}"
          :class="['dot', `dot-${type}`]"
          >
          {{ type }}
        </router-link>
      </li>
    </ul>

    <ul class="navlist navlist--label">
      <li class="navlist__desc">{{labelGroups.name}}</li>
      <li v-for="group in labelGroups.items" :key="group">
        <router-link
          :to="{ name: 'List', params: { label: group, page: 1 }}"
          :class="['dot', `dot-${group}`]"
          >
          {{ group }}
        </router-link>
      </li>
    </ul>

    <button
      :disabled="buttonDisabled"
      class="btn--simple" v-on:click="deleteLocalStorage()"
      title="This resets the cache and re-downloads all the data from Github. As the Github API is very limited - please don't abuse it."
    >
      <font-awesome-icon icon="cog" />
      Reset Cache
    </button>
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
      'labelGroups',
      'labelTypes'
    ])
  },
  methods: {
    ...mapActions([
      'fetchItemsAll',
      'removeItemsAll'
    ]),
    deleteLocalStorage: function () {
      // this.removeItemsAll()
      // this.fetchItemsAll()
      this.buttonDisabled = true
      this.disableButton()
    },
    disableButton: debounce(function () {
      this.buttonDisabled = false
    }, 30000),
    showMenu: function () {
      this.menuVisible = !this.menuVisible
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
  position: relative;
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 5rem;

  &__toggle {
    position: absolute;
    right: 0;
    appearance: none;
    border: none;
    background: transparent;
    font-size: 2rem;

    @media screen and (min-width: $xs) {
      display: none;
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
  margin: 0 0 3rem;
  padding: 0 3rem 0 0;

  > li {
    margin: 0 .5rem .5rem 0;
    > a {
      text-decoration: none;
      font-weight: 800;
      border: 0;
    }
  }

  &--label {
    > li {
      display: block;

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
