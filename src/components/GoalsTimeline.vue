<script setup>
import { ref, onMounted } from 'vue'
import GoalsTree from './GoalsTree.vue'
import AddGoalFromTimeline from './AddGoalFromTimeline.vue'
import { timelineCategories, findBestTimelineCategory } from '../services/categories'

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

const goalsList = ref(undefined)

const categoriesData = timelineCategories;

const getSectionLastDate = (section) => {
  const date = new Date((Date.parse(section?.end) || Date.now()) - 1)
  return date.toISOString().split('T')[0]
}

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
    goalsList.value = props.backend?.getTimeline ? await props.backend.getTimeline() : props.initGoals;
    goalsList.value?.forEach((section) => (section.id = Math.random()))
  } catch (err) {
    console.error(err)
  }
})

</script>

<template>
  <table>
    <thead>
      <tr>
        <th class="category"></th>
        <th v-for="section in goalsList" :key="section.title">
          {{ section.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in categoriesData" :key="category.title">
        <td class="category">
          {{ category.title }}<br /><span class="hint">{{ category.hint }}</span>
        </td>
        <td class="goals" v-for="(section, sectionIndex) in goalsList" :key="section.id"
          :class="focusedCell == section.title + category.title ? 'focused' : ''">
          <GoalsTree
            :initGoals="section.goals.filter((goal) => (findBestTimelineCategory(goal.tags) == category.title))"
            :key="section.goals.length" :moveConfig="{
              mode: 'timeline',
              onMove: ({ goal, direction }) => onMove(goal, direction, sectionIndex)
            }"></GoalsTree>
          <AddGoalFromTimeline v-if="sectionIndex != goalsList.length - 1"
            :baseGoalProps="{ tags: [category.title], targetDate: getSectionLastDate(section) }"
            @create="goal => section.goals.push(goal)" />
        </td>
      </tr>
      <tr>
        <td class="category"></td>
        <td class="goals" v-for="(section, sectionIndex) in goalsList" :key="section.id">
          <GoalsTree :initGoals="section.goals.filter(
            (goal) => !findBestTimelineCategory(goal.tags))
            " :key="section.goals.length" :moveConfig="{
              mode: 'timeline',
              onMove: ({ goal, direction }) => onMove(goal, direction, sectionIndex)
            }"></GoalsTree>
        </td>
      </tr>
    </tbody>
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
