<script setup>
import { ref, defineEmits } from 'vue'
import EditGoal from './EditGoal.vue'
import { GoalsBackend } from '@/services/goals-backend'

const props = defineProps({
  baseGoalProps: Object,
  backend: {
    type: Object,
    default: GoalsBackend.getDefaultInstance()
  }
})

const emit = defineEmits(['create'])

const createGoalFromBase = () => ({
  ...props.baseGoalProps,
  children: undefined,
  title: 'new goal'
})

const editMode = ref(false)
const goalData = ref(undefined)

function startEdit() {
  editMode.value = true
  goalData.value = createGoalFromBase()
}

function doneEdit(newGoalData) {
  if (newGoalData) {
    emit('create', newGoalData)
    props.backend.create(newGoalData)
  }
  editMode.value = false
}
</script>

<template>
  <EditGoal v-if="editMode" @doneEdit="doneEdit" :model="goalData" />
  <div v-else class="startCreate" @dblclick="startEdit">+</div>
</template>

<style>
.startCreate {
  font-family: monospace;
  font-size: large;
  text-align: center;
  cursor: pointer;
}
</style>
