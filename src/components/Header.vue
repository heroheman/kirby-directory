<template>
  <b-navbar
    toggleable="lg"
    variant="white"
    sticky>
    <b-container>
      <b-navbar-brand href="#" :to="{name: 'ListStart', params: { page: '1'} }">
        <div class="header-brand">
          kirby <span>directory</span>
        </div>
      </b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav class="ml-auto">
          <b-nav-item
            :to="{name: 'ListStart', params: { page: '1'} }"
          >All</b-nav-item>

          <b-nav-item
            :to="{name: 'ListPluginsV2', params: { page: '1'} }"
          >Plugins for Kirby 2</b-nav-item>

          <b-nav-item
            :to="{name: 'ListPluginsV3', params: { page: '1'} }"
          >Plugins for Kirby 3</b-nav-item>

          <b-nav-item
            :to="{name: 'ListThemes', params: { page: '1'} }"
          >Themes</b-nav-item>

          <b-nav-item
            :to="{name: 'ContentFAQ'}"
          >FAQ</b-nav-item>
        </b-navbar-nav>

      </b-collapse>
    </b-container>
  </b-navbar>
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

.header-brand {
  margin: 0 1rem 0 0;
  vertical-align: middle;
  font-weight: 400;

  &::before {
    content: '';
    position: relative;
    display: inline-block;
    width: .8rem;
    height: .8rem;
    margin-right: .5rem;
    background: red;
    border-radius: 50%;
  }

  span {
    font-size: inherit;
    font-weight: 800;
  }
}

</style>
