<script setup>
import ActGoals from '../components/ActGoals.vue'
import BackendSelector from '@/services/backend/backend-selector'

const backend = BackendSelector.getBackend()
</script>

<template>
  <ActGoals :backend />
</template>
