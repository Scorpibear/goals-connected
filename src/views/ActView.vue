<script setup>
import ActGoals from '../components/ActGoals.vue'
import { GoalsBackend } from '@/services/goals-backend'

const backend = GoalsBackend.getDefaultInstance()
</script>

<template>
  <main>
    <ActGoals :backend />
  </main>
</template>
