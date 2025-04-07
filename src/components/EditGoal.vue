<script setup>
import { onMounted, ref, shallowRef, computed } from 'vue'
import { VueTagsInput } from '@vojtechlanka/vue-tags-input'
import { TreeView } from '@grapoza/vue-tree'
import { flatCategories } from '../services/categories'
import BackendSelector from '@/services/backend/backend-selector';
import { tree2list } from '@/services/goal-utils'

const props = defineProps({
  model: Object,
  backend: {
    type: Object,
    default: BackendSelector.getBackend()
  },
})

const goalData = ref({ ...props.model, children: undefined })
let goalsTree = ref([]) // Use for hierarchical tree data

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

// Function to load hierarchical tree data
async function loadGoalsTree() {
  const goalsTreeData = await props.backend.getGoalsTree();
  goalsTree.value = transformToTreeViewFormat(goalsTreeData);
}

// Helper function to transform data
function transformToTreeViewFormat(data) {
  return data.map((node) => ({
    id: node.id,
    label: node.title, // Map 'title' to 'label'
    children: node.children ? transformToTreeViewFormat(node.children) : [] // Recursively transform children
  }));
}

function selectParentGoal(node) {
  goalData.value = { ...goalData.value, parent: node.id }; // Ensure reactivity by creating a new object
}

onMounted(async () => {
  await loadGoalsTree();
})
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
    </select>
    <!-- Parent Goal Dropdown -->
    <label for="parent">Parent Goal: </label>
    <TreeView id="parent-tree" :modelValue="goalsTree" selectionMode="single" @update:modelValue="selectParentGoal"
      expandable selectable />
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
</style>
