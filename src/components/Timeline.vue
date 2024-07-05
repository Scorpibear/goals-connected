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

const focusedCell = ref(undefined)

const goalsList = ref(props.initGoals)

const categories = ['развитие', 'творчество', 'влияние', 'семья', 'хобби']
const hints = ['9:00 - 11:00', '10:00 - 12:00', '11:00 - 19:00', '18:00 - 22:00', '21:00 - 0:00']

const getSectionLastDate = (section) =>
  new Date(Date.parse(section.end) - 1).toISOString().split('T')[0]

function doMove(container, goal, fromIndex, toIndex) {
  let sourceSection = container[fromIndex]
  let goalIndex = sourceSection.goals.findIndex(({ id }) => id == goal.id)
  sourceSection.goals.splice(goalIndex, 1)
  let targetSection = container[toIndex]
  goal.targetDate = getSectionLastDate(targetSection)
  targetSection.goals.push(goal)
  props.backend.updateGoal(goal)
}

function onMove(goal, direction, sectionIndex) {
  switch (direction) {
    case 'right':
      if (sectionIndex < goalsList.value.length - 1) {
        doMove(goalsList.value, goal, sectionIndex, sectionIndex + 1)
      }
      break
    case 'left':
      if (sectionIndex > 0) {
        doMove(goalsList.value, goal, sectionIndex, sectionIndex - 1)
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
    <tr v-for="(category, catIndex) in categories" :key="category">
      <td class="category">
        {{ category }}<br /><span class="hint">{{ hints[catIndex] }}</span>
      </td>
      <td
        class="goals"
        v-for="(section, sectionIndex) in goalsList"
        :key="section.id"
        :class="focusedCell == section.title + category ? 'focused' : ''"
        @dblclick="
          focusedCell =
            focusedCell == section.title + category ? 'undefined' : section.title + category
        "
      >
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

.hint {
  font-size: smaller;
}

.focused {
  background-color: aquamarine;
}
</style>
