<template>
  <div class="comment-wrapper detail__body-section">
    <h3 class="detail__subheadline is-toggle" @click="showComments" v-if="!commentsVisible">
      <font-awesome-icon icon="comments" />
      Show Comments
    </h3>
    <h3 class="detail__subheadline is-toggle" @click="hideComments" v-else>
      <font-awesome-icon icon="comments" />
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
</template>
<script>
import VueMarkdown from 'vue-markdown'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DetailCommentsView',
  components: {VueMarkdown},
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
    }
  }
}
</script>
<style lang="scss">
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
