<script setup>
import GoalsTree from '../components/GoalsTree.vue'
import { GoalsBackend } from '@/services/goals-backend'

const backend = GoalsBackend.getDefaultInstance()
</script>

<template>
  <GoalsTree :backend :collapsed="false" :moveConfig="{ mode: 'tree' }" />
</template>
