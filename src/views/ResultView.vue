<script setup>
import ResultGoals from '../components/ResultGoals.vue'
import BackendSelector from '@/services/backend/backend-selector'

const backend = BackendSelector.getBackend()
</script>

<template>
  <ResultGoals :backend />
</template>
