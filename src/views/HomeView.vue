<script setup>
import GoalsTree from '../components/GoalsTree.vue'
import BackendSelector from '@/services/backend-selector'

const backend = BackendSelector.getBackend()
</script>

<template>
  <GoalsTree :backend :collapsed="false" :moveConfig="{ mode: 'tree' }" />
</template>
