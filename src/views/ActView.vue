<script setup>
import ActGoals from '../components/ActGoals.vue'
import { GoalsBackend } from '@/services/goals-backend'

const backend = GoalsBackend.getDefaultInstance()
</script>

<template>
  <ActGoals :backend />
</template>
