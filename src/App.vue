<script setup>
import { RouterLink, RouterView } from 'vue-router'

import GCFooter from './components/GCFooter.vue'
</script>

<template>
  <div>
    <header>
      <nav>
        <RouterLink to="/">Goals Tree</RouterLink>
        <RouterLink to="/result">Result goals</RouterLink>
        <RouterLink to="/act">Action goals</RouterLink>
        <RouterLink to="/timeline">Timeline</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>
    <main><RouterView /></main>
    <GCFooter></GCFooter>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 1rem;
  text-transform: uppercase;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

main {
  min-width: 50rem;
}
</style>
