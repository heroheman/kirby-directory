<template>
<div class="l-header">
  <header class="header">
    <h1 class="header__brand">
      <!-- <img alt="" src="../assets/kirbyicon.png"/> -->
      <slot></slot>
    </h1>
    <!-- <nav class="header__icons" v-if="$mq === 'xs'">
    </nav> -->
  </header>

  <nav class="nav">

    <ul class="navlist">
      <li>
        <router-link :to="{name: 'ListStart', params: { page: '1'} }">Home</router-link>
      </li>
      <li>
        <router-link :to="{name: 'ListStart', params: { page: '1'} }">FAQ</router-link>
      </li>
      <li>
        <router-link :to="{name: 'ListStart', params: { page: '1'} }">Privacy</router-link>
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
          :class="['label', `is-${type}`]"
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
          :class="['label', `is-${group}`]"
          >
          {{ group }}
        </router-link>
      </li>
    </ul>
  </nav>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Header',
  computed: {
    ...mapState([
      'labelGroups',
      'labelTypes'
    ])
  }
}
</script>

<style lang="scss">
@import './../assets/scss/_vars.scss';

.header {
  position: relative;
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  @media screen and (min-width: $xs) {
    margin-bottom: 5rem;
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
}
.navlist {
  position: relative;
  list-style: none;
  margin: 0 0 3rem;
  padding: 0 3rem 0 0;

  > li {
    margin: 0 .5rem .5rem;
    > a {
      text-decoration: none;
      font-weight: 800;
      border: 0;
    }
  }

  &--label {
    > li {
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

  &--mobile {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    > li {
      display: inline-block;
      margin: 0 .5rem 0 0;
      > a {
        text-decoration: none;
        border: 0;
      }
    }
  }
}
</style>
