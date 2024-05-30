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
  backend: Object
})

const goalsList = ref(props.initGoals)

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
    <TreeItem class="item" v-for="goal in goalsList" :model="goal" v-bind:key="goal.id"></TreeItem>
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
