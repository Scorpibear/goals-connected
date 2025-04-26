<script setup>
import { ref, computed } from 'vue'
import { VueTagsInput } from '@vojtechlanka/vue-tags-input'
import { flatCategories } from '../services/categories'
import ParentChangeView from './ParentChangeView.vue'
import BackendSelector from '@/services/backend/backend-selector'

const props = defineProps({
  model: Object,
  parent: Object,
  backend: {
    type: Object,
    default: BackendSelector.getBackend()
  }
})

const goalData = ref({ ...props.model, children: undefined })

const tag = ref('')
const tags = ref(props.model.tags ? props.model.tags.map((tagName) => ({ text: tagName })) : [])

const categories = flatCategories.map(({ title }) => title);

const titleInputSize = computed(() =>
  Math.max(props.model.title.length, 40)
)

const emit = defineEmits(['doneEdit'])

const isChanged = (goal1, goal2) =>
  goal1.title != goal2.title ||
  goal1.targetDate != goal2.targetDate ||
  goal1.type != goal2.type ||
  goal1.tags?.toString() != goal2.tags?.toString() ||
  goal1.parent != goal2.parent // Include parent in comparison

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

const showParentChangeView = ref(false)
const parentGoalName = computed(() => {
  return props.parent ? props.parent.title : 'No parent'
})

function applyParentChange(newParent) {
  console.debug('EditGoal:applyParentChange:newParent:', newParent);
  props.backend?.move(props.model.id, newParent.id)
  props.parent = newParent;
  showParentChangeView.value = false
}

function cancelParentChange() {
  showParentChangeView.value = false
}
</script>

<template>
  <form @submit.prevent @keyup.enter="doneEdit" @keyup.escape="cancelEdit">
    <input id="edit" class="edit" type="text" v-model="goalData.title" @vue:mounted="({ el }) => el.focus()"
      :size="titleInputSize" />
    by <input id="targetDate" type="date" v-model="goalData.targetDate" /><br />
    <label for="type">Type: </label><select id="type" v-model="goalData.type">
      <option value="0">State</option>
      <option value="1">Result</option>
      <option value="2">Action</option>
    </select>&nbsp;
    <label>Parent Goal: </label>
    <span class="parent-goal-name">{{ parentGoalName }}</span>&nbsp;
    <button type="button" @click="showParentChangeView = true">Change</button>
    <ParentChangeView v-if="showParentChangeView" :currentParenId="goalData.parent?.id" @apply="applyParentChange"
      @cancel="cancelParentChange" />
    <vue-tags-input v-model="tag" :tags="tags" :autocomplete-items="categories.map((category) => ({ text: category }))"
      @tags-changed="(newTags) => (goalData.tags = newTags.map((tag) => tag.text))"
      @tag-order-changed="(newTags) => (goalData.tags = newTags.map((tag) => tag.text))" />
    <button @click="doneEdit" type="button" id="save">Save</button><button @click="cancelEdit"
      type="button">Cancel</button>
  </form>
</template>

<style scoped>
button {
  cursor: pointer;
}

#parent-tree {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

.parent-goal-name {
  font-size: 0.9em;
  /* Smaller font size for parent goal name */
  color: #555;
  /* Optional: lighter color for better distinction */
}
</style>
