<template>
  <section class="detail">
    <div class="detail__head">
      <h2 class="detail__headline">
        <a :href="detail.item.html_url">
          #{{ detail.item.number }}
        </a> &dash;
        {{ detail.item.title }}
      </h2>
    </div>

    <div class="detail__body">

      <!-- <div class="loading" :loading="loading"> -->
      <!--   <pacman-loader :loading="loading" color="red"></pacman-loader> -->
      <!-- </div> -->

      <vue-markdown class="detail__body-main" :source="detail.item.body">
      </vue-markdown>

      <div class="detail__body-section">
        <ul class="detail__labels labels">
          <li class="listitem__label" v-for="label in detail.item.labels" :key="label.id">
            <router-link
              :to="{name:'list', params:{ type: label.name }}"
              :class="['label', `is-${label.name}`]"
              >
              {{ label.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="detail__body-section">

        <h3 class="detail__subheadline is-toggle"
          title="Show Readme"
          @click="showReadme()"
          >
          Show Readme
        </h3>

        <h3 class="detail__subheadline is-toggle"
            title="Hide Readme"
            @click="hideReadme()"
            >
          Hide Readme
        </h3>

        <vue-markdown class="detail__readme" :source="detail.readme" v-if="readmeVisible">
        </vue-markdown>
      </div>

      <div class="comment-wrapper detail__body-section">
        <h3 class="detail__subheadline is-toggle" @click="showComments">
          Show Comments
        </h3>
        <h3 class="detail__subheadline is-toggle" @click="hideComments">
          Hide Comments
        </h3>

        <p class="comments-note" v-if="commentsVisible">
          <span v-if="detail.comments.length > 0">
            <!-- <SvgIcon :icon="'comments'"></SvgIcon> -->
            This Entry has {{detail.comments.length}} Comments.  Participate directly
            <a :href="detail.html_url">on Github</a>.
          </span>
          <span v-if="detail.comments.length === 0">
            <!-- <SvgIcon :icon="'comments'"></SvgIcon> -->
            There is currently no comment for this entry. Participate directly
            <a :href="detail.html_url">on Github</a>.
          </span>
        </p>

        <div class="comments" v-if="detail.comments.length > 0">
          <div class="comment" v-for="comment in detail.comments" :key="comment.id">
            <div class="comment__img">
              <img :src="comment.user.avatar_url" :alt="comment.user.login">
            </div>
            <div class="comment__head">
              <span class="comment__name">
                <a :href="comment.user.html_url">
                  {{ comment.user.login }}
                </a>
              </span>
              <!-- <span class="comment__date" :time="getRelTime(comment.created_at)">
                test
                </span> -->
                <span class="comment__link">
                  <a :href="comment.html_url">
                    show comment on github
                  </a>
                </span>
            </div>
            <VueMarkdown class="comment__body" :source="comment.body">
            </VueMarkdown>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'DetailView',
  components: {VueMarkdown},
  data () {
    return {
      readmeVisible: false,
      commentsVisible: false
    }
  },
  computed: {
    ...mapState([
      'detail'
    ]),
    ...mapGetters([
      'getLoading',
      'getPluginRepo'
    ])
  },
  mounted () {
    this.$store.dispatch('getDetail', {number: this.$route.params.id})
  },
  methods: {
    ...mapActions([
      'getComments',
      'getReadme'
    ]),
    showReadme: function () {
      if (this.detail.readme === '') {
        this.getReadme(this.getPluginRepo)
      }
      this.readmeVisible = true
    },
    hideReadme: function () {
      this.readmeVisible = false
    },
    showComments: function () {
      if (this.detail.readme === '') {
        this.getComments(this.$route.params.id)
      }
      this.commentsVisible = true
    },
    hideComments: function () {
      this.commentsVisible = false
    }
  }
}
</script>

<style lang="scss">
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
    }
    &__subheadline {
        position: relative;
        display: block;
        padding-left: 3.5rem;
        transition: all .25s ease;
        &.is-toggle {
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }
        svg {
            position: absolute;
            left: 1rem;
            margin-top: .4rem;
            // fill: currentColor;
            fill: red;
            height: 1.5rem;
            width: 1.5rem;
            margin-right: .5rem;
        }
    }
    &__labels {
        margin-top: .5rem;
        margin-bottom: 0;
    }
    &__body {
        border-bottom: 1px solid #ccc;
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        &-main,
        &-section {
            position: relative;
            margin-bottom: 2rem;
            padding: 1rem 2rem;
        }
        &-main {
          min-height: 30vh;
        }
        &-section {
            background: #f8f8f8;
            border-radius: .5rem;
        }
        blockquote {
            border-left: 2px solid red;
            margin-left: 0;
            padding-left: 2rem;
            p {
                font-size: 2rem;
                font-style: italic;
            }
        }
    }
    &__readme {
        padding: 0 1rem;
        h1, h2, h3, h4, h5, h6 {
            font-size: 2rem;
        }
    }
    img {
          max-width: 100%;
      }
  }
    .comment {
        display: grid;
        grid-template-areas: "img head"
                            "img body"
                            "img body";
        grid-template-columns: 1fr 7fr;
        grid-template-rows: 1fr 1fr 1fr;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 2rem;
        padding: 2rem;
        &__img {
            grid-area: img;
            img {
                border-radius: 5px;
                height: auto;
                width: 100%;
                max-width: 8rem;
            }
        }
        &__head {
            grid-area: head;
        }
            &__name {
            }
            &__date {
            }
            &__link {
            }
        &__body {
            grid-area: body;
            p {
                margin: 0;
            }
        }
    }
    .comments {
        margin-top: 2rem;
        &-note {
            margin: 0;
            .icon {
                margin-left: 1rem;
                margin-right: .5rem;
            }
            // + button {
            //     margin-top: 1rem;
            // }
        }
    }
</style>
