<script setup>
import { ref } from 'vue'
import GoalsTimeline from '../components/GoalsTimeline.vue'
import BackendSelector from '@/services/backend/backend-selector'

const backend = BackendSelector.getBackend()

const refreshKey = ref(0)

function onDateChange() {
  refreshKey.value += 1;
}

</script>

<template>
  <GoalsTimeline :backend :key=refreshKey @date-change="onDateChange" />
</template>
