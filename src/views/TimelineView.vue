<script setup>
import Timeline from '../components/Timeline.vue'
import { GoalsBackend } from '@/services/goals-backend'

const backend = GoalsBackend.getDefaultInstance()
</script>

<template>
  <Timeline :backend />
</template>
