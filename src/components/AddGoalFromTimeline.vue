<script setup>
import { ref } from 'vue'
import EditGoal from './EditGoal.vue'
import BackendSelector from '@/services/backend/backend-selector'

const props = defineProps({
  baseGoalProps: Object,
  backend: {
    type: Object,
    default: BackendSelector.getBackend()
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
    props.backend.create(newGoalData).then(createdData => newGoalData.id = createdData.id);
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
