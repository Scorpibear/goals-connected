<script setup>
import GoalsTree from '../components/GoalsTree.vue'
import { GoalsBackend } from '@/services/goals-backend'

const backend = GoalsBackend.getDefaultInstance()
</script>

<template>
  <main>
    <GoalsTree :backend />
  </main>
</template>
