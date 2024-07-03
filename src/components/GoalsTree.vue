<script setup>
import { ref, onMounted } from 'vue'
import TreeItem from './TreeItem.vue'

const props = defineProps({
  initGoals: {
    type: Array,
    default() {
      return []
    }
  },
  backend: Object,
  collapsed: {
    type: Boolean,
    default: true
  },
  moveConfig: Object
})

const goalsList = ref(props.initGoals)

function onDelete(goalId) {
  const goalIndex = goalsList.value.findIndex(({ id }) => id == goalId)
  if (goalIndex >= 0) {
    goalsList.value.splice(goalIndex, 1)
  }
}

onMounted(async () => {
  try {
    if (!goalsList.value?.length && props?.backend?.getGoalsTree) {
      goalsList.value = await props.backend.getGoalsTree()
    }
  } finally {
    // TODO: load from localstorage
  }
})
</script>

<template>
  <ul>
    <TreeItem
      class="item"
      v-for="(goal, index) in goalsList"
      :model="goal"
      :key="goal.id"
      :collapsed="props.collapsed"
      :container="index ? goalsList : null"
      :moveConfig="moveConfig"
      @delete="onDelete"
    ></TreeItem>
  </ul>
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

.item {
  cursor: pointer;
  line-height: 1.5;
}

.bold {
  font-weight: bold;
}
</style>
