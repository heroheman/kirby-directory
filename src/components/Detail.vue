<template>
  <div>
    <div class="loadingwrapper" v-if="getLoading">
      <div class="loadingwrapper__inner">
        <pulse-loader :loading="getLoading" color="red"/>
      </div>
    </div>

    <section class="detail" v-if="!getLoading">
      <section class="detail__head">
        <h2 class="detail__headline">
          <button class="back" @click="goBack()" aria-hidden title="go back to overview">
            <font-awesome-icon icon="arrow-circle-left" color="red" size="lg" />
          </button>
          <a :href="detail.issue.html_url">
          {{ detail.issue.title }}
          </a>
        </h2>
        <h3 class="detail__subheadline" v-if="hasDetails">
          {{ detail.details.description}}
        </h3>
      </section>

      <section class="detail__short">
        <vue-markdown class="detail__body-main" :source="detail.issue.body">
        </vue-markdown>
      </section>

      <section class="detail__long" v-if="hasDetails">
        <DetailReadme :readme="detail.details.readme" />
      </section>

      <section class="detail__meta">
        <div class="detail__meta-pane" v-if="hasDetails">
          <h3 class="detail__meta-headline">Author</h3>
          <b-media v-if="hasDetails">
            <img
              class="detail__meta-authorimg"
              slot="aside"
              width="60"
              :src="detail.details.owner.avatar_url"
              :alt="detail.details.owner.login">
              <p class="detail__meta-authorname">
                {{detail.details.owner.login}}
                <br>
                <b-button
                  size="sm"
                  style="margin-right: .2rem;"
                  :href="`https://github.com/${detail.details.owner.login}`"
                  target="_blank">
                  Follow
                </b-button>
                <b-button
                  size="sm"
                  :href="detail.details.html_url"
                  target="_blank">
                    <font-awesome-icon icon="star" color="#fff" aria-hidden="true" />
                  {{detail.details.stargazers_count}}
                </b-button>
              </p>
          </b-media>
        </div>

        <div class="detail__meta-pane">
          <h3 class="detail__meta-headline">Labels</h3>
          <ul class="detail__labels labels">
            <li class="listitem__label" v-for="label in detail.issue.labels" :key="label.id">
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

        <div class="detail__meta-pane" v-if="hasDetails">
          <h3 class="detail__meta-headline">Github Stars</h3>
            <font-awesome-icon icon="star" color="#333" aria-hidden="true" />
          {{detail.details.stargazers_count}}
        </div>

        <div class="detail__meta-pane" v-if="hasDetails">
          Created: {{formatDate(detail.details.created_at)}}<br>
          Updated: {{formatDate(detail.details.updated_at)}}
        </div>
      </section>

    </section>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VueMarkdown from 'vue-markdown'
import DetailReadme from './DetailReadme.vue'
import debounce from 'tiny-debounce'
import removeMD from 'remove-markdown'
import parse from 'date-fns/parse'
import format from 'date-fns/format'

export default {
  name: 'DetailView',
  components: { VueMarkdown, DetailReadme, PulseLoader },
  metaInfo () {
    return {
      title: this.detail.issue.title,
      meta: [
        { description: removeMD(this.detail.issue.body) },
        {
          'property': 'og:title',
          'content': `${this.detail.issue.title} | ${this.meta.title}`
        },
        {
          'property': 'og:description',
          'content': removeMD(this.detail.issue.body)
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'detail',
      'meta'
    ]),
    ...mapGetters([
      'getLoading',
      'getDetailTitle',
      'hasDetails'
    ])
  },
  methods: {
    parse,
    format,
    formatDate: function (date) {
      let formatted = parse(new Date(date))
      formatted = format(formatted, 'DD.MM.YYYY')
      return formatted
    },
    ...mapActions([
      'getDetails',
      'fetchItemsAll'
    ]),
    updateDetail: debounce(function () {
      this.getDetails({ number: this.$route.params.id })
    }, 500),
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
    },
    goBack: function () {
      this.$router.go(-1)
    }
  },
  created () {
    if (this.detail.issue.title) {
      this.getDetails({ number: this.$route.params.id })
    } else {
      // wait a second after items are loaded
      this.updateDetail()
    }
  }
}
</script>

<style lang="scss">
@import './../assets/scss/_vars.scss';

.detail {
  position: relative;
  display: grid;
  grid-template-areas: "head head" "short meta" "long long";
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr auto auto;

  &__short,
  &__long,
  &__meta {
    background: #f8f8f8;
    border-radius: .5rem;
    padding: 1rem 2rem;
    margin-bottom: 1rem;
  }

  &__head {
    grid-area: head;
  }
  &__short {
    grid-area: short;
  }
  &__long {
    grid-area: long;
  }
  &__meta {
    grid-area: meta;
    margin-left: 1rem;

    &-headline {
      font-size: 1rem;
      font-weight: 800;
      border-bottom: 1px solid #cccccc;
    }
    &-pane {
      margin-bottom: 2rem;
    }
    &-authorimg {
      border-radius: 50%;
    }
    &-authorname {
      vertical-align: middle;

      .btn {
        display: inline-block;
        svg {
          height: .9rem;
        }
      }
    }
  }

  .back {
    position: relative;
    top: -1px;
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    background: 0;
    color: $cBorder;
    padding-left: 0;
    padding-right: 0.2rem;
  }

  &__head {
    margin-top: 3rem;
    margin-bottom: 0;
  }
  &__headline {
    font-weight: 400;
    margin: 0;
    span {
      color: #ccc;
    }
    a {
      font-weight: bold;
      transition: all .25s ease;
      @include custom-underline();
    }
  }
  &__subheadline {
    padding-left: 3.4rem;
    margin-top: 0;
    font-size: 1.2rem;
    font-style: italic;

  }
  &__body {
    a {
      &:not(.dot) {
        color: red;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }
    }

    code {
      white-space: pre-line;
      word-wrap: break-word;
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

    &__labels {
      margin: 0;
      .dot {
        &:hover {
          text-decoration: underline;
        }
      }
    }
    blockquote {
      border-left: 2px solid red;
      margin-left: 0;
      margin-bottom: 4rem;
      padding-left: 2rem;
      p {
        font-style: italic;
      }
    }
  }
  img {
    max-width: 100%;
  }
}
</style>
