<script setup>
import { ref } from 'vue'
import { VueTagsInput } from '@vojtechlanka/vue-tags-input'

const props = defineProps({
  model: Object
})

const goalData = ref({ ...props.model, children: undefined })

const tag = ref('')
const tags = ref(props.model.tags ? props.model.tags.map((tagName) => ({ text: tagName })) : [])

const categories = ['развитие', 'творчество', 'влияние', 'семья', 'хобби']

const emit = defineEmits(['doneEdit'])

const isChanged = (goal1, goal2) =>
  goal1.title != goal2.title ||
  goal1.targetDate != goal2.targetDate ||
  goal1.type != goal2.type ||
  goal1.tags?.toString() != goal2.tags?.toString()

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
    :size="Math.max(model.title.length, 40)"
  />
  by <input id="targetDate" type="date" v-model="goalData.targetDate" /><br />
  <label for="type">Type: </label
  ><select id="type" v-model="goalData.type">
    <option value="0">State</option>
    <option value="1">Result</option>
    <option value="2">Action</option></select
  ><vue-tags-input
    v-model="tag"
    :tags="tags"
    :autocomplete-items="categories"
    @tags-changed="(newTags) => (goalData.tags = newTags.map((tag) => tag.text))"
    @tag-order-changed="(newTags) => (goalData.tags = newTags.map((tag) => tag.text))"
  />
  <button @click="doneEdit" type="button">Save</button><button @click="cancelEdit">Cancel</button>
</template>

<style>
button {
  cursor: pointer;
}
</style>
