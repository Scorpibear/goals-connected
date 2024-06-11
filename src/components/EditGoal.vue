<script setup>
import { ref } from 'vue'

const props = defineProps({
  model: Object
})

const goalData = ref({ ...props.model, children: undefined })

const emit = defineEmits(['doneEdit'])

const isChanged = (goal1, goal2) =>
  goal1.title != goal2.title || goal1.targetDate != goal2.targetDate || goal1.type != goal2.type

function doneEdit() {
  if (isChanged(goalData.value, props.model)) {
    console.debug('EditGoal:doneEdit:goalData.value:', goalData.value)
    setTimeout(() => emit('doneEdit', goalData.value))
  } else {
    cancelEdit()
  }
  return false // to not reload page on submit
}

function cancelEdit() {
  emit('doneEdit', false)
}
</script>

<template>
  <input
    class="edit"
    type="text"
    v-model="goalData.title"
    @vue:mounted="({ el }) => el.focus()"
    @keyup.enter="doneEdit"
    @keyup.escape="cancelEdit"
    :size="model.title.length"
  />
  by <input id="targetDate" type="date" v-model="goalData.targetDate" /><br />
  <label for="type">Type: </label
  ><select id="type" v-model="goalData.type">
    <option value="0">State</option>
    <option value="1">Result</option>
    <option value="2">Action</option></select
  ><button @click="doneEdit" type="button">Save</button><button @click="cancelEdit">Cancel</button>
</template>

<style>
button {
  cursor: pointer;
}
</style>
