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

const categories = ['развитие', 'творчество', 'влияние', 'семья', 'хобби']

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
      <th class="category"></th>
      <th v-for="section in goalsList" :key="section.title">
        {{ section.title }}
      </th>
    </tr>
    <tr v-for="category in categories" :key="category">
      <td class="category">{{ category }}</td>
      <td class="goals" v-for="section in goalsList" :key="section.id">
        <GoalsTree
          :initGoals="section.goals.filter((goal) => goal.tags?.includes(category))"
        ></GoalsTree>
      </td>
    </tr>
    <tr>
      <td class="category"></td>
      <td class="goals" v-for="section in goalsList" :key="section.id">
        <GoalsTree
          :initGoals="
            section.goals.filter((goal) => !goal.tags?.some((tag) => categories.includes(tag)))
          "
        ></GoalsTree>
      </td>
    </tr>
  </table>
</template>

<style scoped>
td {
  vertical-align: top;
}
@media (min-width: 1024px) {
  td.goals {
    min-width: 350px;
    font-size: small;
  }
}
.category {
  align-content: center;
  text-align: center;
  text-transform: uppercase;
  padding: 5px;
}

table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
