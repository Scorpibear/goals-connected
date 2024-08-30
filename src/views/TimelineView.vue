<script setup>
import GoalsTimeline from '../components/GoalsTimeline.vue'
import BackendSelector from '@/services/backend/backend-selector'

const backend = BackendSelector.getBackend()
</script>

<template>
  <GoalsTimeline :backend />
</template>
