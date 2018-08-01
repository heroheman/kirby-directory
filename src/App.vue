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
      <p>Footer</p>
    </footer>
  </div>
</template>

<script>
import HeaderSection from './components/Header.vue'
import Search from './components/Search.vue'
export default {
  name: 'App',
  components: { HeaderSection, Search }
}
</script>

<style lang="scss">
@import './assets/scss/main.scss';
#app {
}
</style>
