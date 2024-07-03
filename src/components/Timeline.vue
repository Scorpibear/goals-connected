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

const getSectionLastDate = (section) => new Date(Date.parse(section.end) - 1).toISOString()

function onMove(goal, direction, sectionIndex) {
  switch (direction) {
    case 'right':
      if (sectionIndex < goalsList.value.length - 1) {
        let sourceSection = goalsList.value[sectionIndex]
        let goalIndex = sourceSection.goals.findIndex(({ id }) => id == goal.id)
        sourceSection.goals.splice(goalIndex, 1)
        let targetSection = goalsList.value[sectionIndex + 1]
        goal.targetDate = getSectionLastDate(targetSection)
        targetSection.goals.push(goal)
        props.backend.updateGoal(goal)
      }
      break
    case 'left':
      if (sectionIndex > 0) {
        let sourceSection = goalsList.value[sectionIndex]
        let goalIndex = sourceSection.goals.findIndex(({ id }) => id == goal.id)
        sourceSection.goals.splice(goalIndex, 1)
        let targetSection = goalsList.value[sectionIndex - 1]
        goal.targetDate = getSectionLastDate(targetSection)
        targetSection.goals.push(goal)
        props.backend.updateGoal(goal)
      }
      break
    default:
      console.error('Unsupported direction: ', direction)
  }
}

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
      <td class="goals" v-for="(section, sectionIndex) in goalsList" :key="section.id">
        <GoalsTree
          :initGoals="section.goals.filter((goal) => goal.tags?.includes(category))"
          :key="section.goals.length"
          :moveConfig="{
            mode: 'timeline',
            onMove: ({ goal, direction }) => onMove(goal, direction, sectionIndex)
          }"
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
          :key="section.goals.length"
          :moveConfig="{
            mode: 'timeline',
            onMove: ({ goal, direction }) => onMove(goal, direction, sectionIndex)
          }"
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
    min-width: 270px;
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
ul {
  padding-inline-start: 5px;
}
</style>
