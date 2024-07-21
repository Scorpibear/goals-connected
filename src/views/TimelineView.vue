<script setup>
import GoalsTimeline from '../components/GoalsTimeline.vue'
import { GoalsBackend } from '@/services/goals-backend'

const backend = GoalsBackend.getDefaultInstance()
</script>

<template>
  <GoalsTimeline :backend />
</template>
