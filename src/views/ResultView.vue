<script setup>
import ResultGoals from '../components/ResultGoals.vue'
import { GoalsBackend } from '@/services/goals-backend'

const backend = GoalsBackend.getDefaultInstance()
</script>

<template>
  <ResultGoals :backend />
</template>
