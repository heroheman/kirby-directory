<template>
  <section class="detail">

    <div class="loadingwrapper" v-if="getLoading">
      <div class="loadingwrapper__inner">
        <pulse-loader :loading="getLoading" color="red"/>
      </div>
    </div>

    <div class="detail__head" v-if="!getLoading">
      <h2 class="detail__headline">
        <a :href="detail.item.html_url">
          #{{ detail.item.number }}
        </a> &dash;
        {{ detail.item.title }}
      </h2>
    </div>

    <div class="detail__body" v-if="!getLoading">

      <!-- <div class="loading" :loading="loading"> -->
      <!--   <pacman-loader :loading="loading" color="red"></pacman-loader> -->
      <!-- </div> -->

      <vue-markdown class="detail__body-main" :source="detail.item.body">
      </vue-markdown>

      <div class="detail__body-section">
        <ul class="detail__labels labels">
          <li class="listitem__label" v-for="label in detail.item.labels" :key="label.id">
            <router-link
              :title="`Show more items from Label ${label.name}`"
              :to="{name:'List', params:{ label: label.name }}"
              :class="['dot', `dot-${label.name}`]"
              >
              {{ label.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <DetailReadme />
      <DetailComments />

    </div>
  </section>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VueMarkdown from 'vue-markdown'
import DetailComments from './DetailComments.vue'
import DetailReadme from './DetailReadme.vue'
import debounce from 'tiny-debounce'

export default {
  name: 'DetailView',
  components: {VueMarkdown, DetailComments, DetailReadme, PulseLoader},
  computed: {
    ...mapState([
      'detail'
    ]),
    ...mapGetters([
      'getLoading'
    ])
  },
  methods: {
    ...mapActions([
      'getDetail',
      'fetchItemsAll'
    ]),
    updateDetail: debounce(function () {
      this.getDetail({number: this.$route.params.id})
    }, 500)
  },
  mounted () {
    // wait a second after items are loaded
    this.updateDetail()
  }
}
</script>

<style lang="scss">
@import './../assets/scss/_vars.scss';

.detail {
  position: relative;

  &__head {
    margin-top: 3rem;
    width: 100%;
    margin-bottom: 2rem;
  }
  &__headline {
    font-weight: 400;
    margin: 0;
    span {
      font-size: inherit;
      color: #ccc;
    }
    a {
      font-weight: bold;
      transition: all .25s ease;
      @include custom-underline();
    }
  }
  &__subheadline {
    position: relative;
    font-size: 1.6rem;
    padding-left: 2rem;
    transition: all .25s ease;

    &.is-toggle {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    svg {
      position: absolute;
      left: 0;
      margin-top: .4rem;
      // fill: currentColor;
      fill: red;
      height: 1.2rem !important;
      width: 1.2rem !important;
      margin-right: .5rem;
    }
  }
  &__labels {
    margin: 0;
    .dot {
      &:hover {
        text-decoration: underline;
      }
    }
  }
  &__body {
    a {
      &:not(.dot) {
        color: red;
      }
    }
    border-bottom: 1px solid #ccc;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    &-main,
    &-section {
      position: relative;
      margin-bottom: 2rem;
    }
    &-main {
      min-height: 20vh;
      padding: 1rem 0;
    }
    &-section {
      background: #f8f8f8;
      border-radius: .5rem;
      padding: 1rem 2rem;
    }
    blockquote {
      border-left: 2px solid red;
      margin-left: 0;
      margin-bottom: 4rem;
      padding-left: 2rem;
      p {
        font-size: 2rem;
        font-style: italic;
      }
    }
  }
  img {
    max-width: 100%;
  }
}
</style>
