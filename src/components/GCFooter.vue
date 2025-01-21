<script setup>
const version = process.env.PACKAGE_VERSION || '0.0.0';
</script>

<template>
  <footer>Goals Connected v{{ version }} &copy; LifeIdea.org</footer>
</template>

<style>
footer {
  font-size: xx-small;
  margin: 5rem;
}
</style>
