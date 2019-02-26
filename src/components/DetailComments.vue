<template>
  <div class="comment-wrapper detail__body-section">
    <h3 class="detail__subheadline is-toggle" @click="showComments" v-if="!commentsVisible && detail.item.comments > 0">
      <font-awesome-icon icon="comments" />
      Show Comments
      ({{detail.item.comments}})
    </h3>
    <h3 class="detail__subheadline is-toggle" @click="hideComments" v-if="commentsVisible">
      <font-awesome-icon icon="comments" />
      Hide Comments
    </h3>

    <p class="comments-note" v-if="detail.item.comments === 0">
      <span>
        <!-- <SvgIcon :icon="'comments'"></SvgIcon> -->
        There is currently no comment for this entry.
      </span>
      <span>
        Participate directly
        <a :href="detail.html_url">on Github</a>.
      </span>
    </p>

    <div class="comments" v-if="commentsVisible">
      <pulse-loader color="red" :loading="!detail.comments.length"/>
      <div class="comment" v-for="comment in detail.comments" :key="comment.id">
        <div class="comment__img">
          <img :src="comment.user.avatar_url" :alt="comment.user.login">
            <span
              :class="['comment__assoc', `comment__assoc--${comment.author_association}`]"
              v-if="comment.author_association !== 'NONE' ">
              {{ comment.author_association }}
            </span>
        </div>
        <div class="comment__head">

          <span class="comment__name">
            <a :href="comment.user.html_url">
              {{ comment.user.login }}
            </a>
          </span>

          <span class="comment__date" :time="comment.created_at">
            {{parseDate(comment.created_at)}}
          </span>

          <span class="comment__link">
            <a title="view comment on github"
              :href="comment.html_url">
              <font-awesome-icon icon="link" color="#ccc" size="xs"/>
            </a>
          </span>
        </div>
        <VueMarkdown class="comment__body" :source="comment.body">
        </VueMarkdown>
      </div>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapState, mapActions } from 'vuex'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'DetailCommentsView',
  components: { VueMarkdown, PulseLoader },
  data () {
    return {
      commentsVisible: false
    }
  },
  computed: {
    ...mapState([
      'detail'
    ])
  },
  methods: {
    ...mapActions([
      'getComments'
    ]),
    showComments: function () {
      if (this.detail.readme === '') {
        this.getComments(this.$route.params.id)
      }
      this.commentsVisible = true
    },
    hideComments: function () {
      this.commentsVisible = false
    },
    parseDate: function (date) {
      // eslint-disable-next-line
      let parts = date.split(/[-:\sTZ\+]/);
      return `${parts[2]}.${parts[1]}.${parts[0]} - ${parts[3]}:${parts[4]}`
    }
  }
}
</script>

<style lang="scss">
@import './../assets/scss/_vars.scss';
.comment {
  display: grid;
  border-top: 1px solid #ccc;
  padding: 2rem 0;

  grid-template-areas: "img head"
                      "body body"
                      "body body";
  grid-template-columns: 20% 80%;
  grid-template-rows: 1fr auto auto;

  @media screen and (min-width: $xs) {
    grid-template-areas: "img head"
                        "img body"
                        "img body";
    grid-template-columns: 2fr 10fr;
    grid-template-rows: 1fr 1fr 1fr;
  }

  &::last-child {
    border-bottom: 1px solid #ccc;
  }

  &__img {
    grid-area: img;
    padding-right: 2rem;
    img {
      border-radius: 50%;
      height: auto;
      width: 100%;
      max-width: 8rem;
    }
  }

  &__head {
    grid-area: head;
    margin-bottom: 1rem;
  }
  &__assoc {
    border-radius: 5px;
    transform: translateY(-2rem);
    font-size: 1rem;
    font-weight: bold;
    padding: .2rem .3rem;
    color: white;
    display: none;

    &--OWNER {
      background: black;
    }
    &--COLLABORATOR {
      background: green;
    }

    @media screen and (min-width: $xs) {
      display: inline-block;
    }
  }
  &__name {
    display: block;

    @media screen and (min-width: $xs) {
      display: inline-block;
    }
  }
  &__date {
    @extend %smallprint;
    font-style: normal;

    @media screen and (min-width: $xs) {
      &::before {
        content: ' — ';
      }
    }
  }
  &__link {
  }
  &__body {
    grid-area: body;
    p {
      margin: 0;
      font-size: 1.6rem;
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
