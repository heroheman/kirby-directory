<template>
  <div id="app" class="l-container l-container--grid">
    <!-- l-header -->
    <HeaderSection>
      kirby <span>plugins</span>
    </HeaderSection>

    <main class="l-main">
      <Search />

      <router-view/>

    </main>

    <footer class="l-footer">
      <p>&copy; 2018 - Frontend by <a href="https://flore.nz">Florenz Heldermann</a>
      | Backend data provided by Jens Tornell's <a href="https://github.com/jenstornell/kirby-plugins">Github Plugin Collection</a>
      | <router-link :to="{name: 'ContentPrivacy'}">Privacy</router-link>
      | <router-link :to="{name: 'ContentImprint'}">Imprint</router-link></p>
    </footer>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import HeaderSection from './components/Header.vue'
import Search from './components/Search.vue'
export default {
  name: 'App',
  components: { HeaderSection, Search },
  computed: {
    ...mapState([
      'meta'
    ])
  },
  metaInfo () {
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      // title: ,
      // all titles will be injected into this template
      titleTemplate: `%s | ${this.meta.title}`,
      meta: [
        {
          'name': 'keywords',
          'content': this.meta.keywords
        },
        {
          'property': 'og:title',
          'content': 'Home',
          'template': chunk => `${chunk} | ${this.meta.title}`,
          'vmid': 'og:title'
        },
        {
          'property': 'og:description',
          'content': `${this.meta.description}`,
          'vmid': 'og:description'
        },
        {
          'property': 'og:image',
          'content': `${this.meta.image}`,
          'vmid': 'og:image'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/main.scss';
#app {
}
</style>
