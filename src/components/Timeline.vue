<script setup>
import { ref, onMounted } from 'vue'
import GoalsTree from './GoalsTree.vue'

const props = defineProps({
  initGoals: {
    type: Array,
    default() {
      return [
        { title: 'Week', goals: [] },
        { title: 'Month', goals: [] }
      ]
    }
  },
  backend: Object
})

const goalsList = ref(props.initGoals)

onMounted(async () => {
  try {
    goalsList.value = await props.backend.getTimeline()
    goalsList.value.forEach((section) => (section.id = Math.random()))
  } finally {
    // TODO: load from localstorage
  }
})
</script>

<template>
  <table>
    <tr>
      <th v-for="section in goalsList" :key="section.title">
        {{ section.title }}
      </th>
    </tr>
    <tr>
      <td v-for="section in goalsList" :key="section.id">
        <GoalsTree :initGoals="section.goals"></GoalsTree>
      </td>
    </tr>
  </table>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

td {
  vertical-align: top;
}

.item {
  cursor: pointer;
  line-height: 1.5;
}

.bold {
  font-weight: bold;
}
</style>
