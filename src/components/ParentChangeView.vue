<template>
  <div class="parent-change-view">
    <h3>Select New Parent Goal</h3>
    <TreeView id="my-tree" v-model="goalsTree" selectionMode="single" :selected="selectedParentId"
      @treeNodeClick="onSelectParent" class="tree-view" />
    <div class="actions">
      <button @click="applyChange">Apply</button>
      <button @click="cancelChange">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { TreeView } from '@grapoza/vue-tree'
import BackendSelector from '@/services/backend/backend-selector'

const props = defineProps({
  currentParentId: {
    type: Object
  }
})

const emit = defineEmits(['apply', 'cancel'])

const backend = BackendSelector.getBackend()
const goalsTree = ref([])
const selectedParentId = ref(props.currentParentId)
const selectedParent = ref(null)

function onSelectParent(node) {
  console.debug('Selected node data:', node.data)
  selectedParent.value = node.data
  selectedParentId.value = node.data?.id
}

function applyChange() {
  console.log('Applying new parent id:', selectedParentId.value);
  emit('apply', selectedParent.value)
}

function cancelChange() {
  emit('cancel')
}

// Function to load hierarchical tree data
async function loadGoalsTree() {
  const goalsTreeData = await backend.getGoalsTree()
  goalsTree.value = transformToTreeViewFormat(goalsTreeData)
}

// Helper function to transform data
function transformToTreeViewFormat(data) {
  return data.map((node) => ({
    id: node.id,
    label: node.title, // Map 'title' to 'label'
    children: node.children ? transformToTreeViewFormat(node.children) : [],
    selectable: true
  }))
}

onMounted(async () => {
  await loadGoalsTree()
})

watch(() => props.currentParentId, (newVal) => {
  selectedParentId.value = newVal
})
</script>

<style scoped>
.parent-change-view {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.tree-view .tree-node.selected {
  background-color: #e0f7fa;
  border-left: 4px solid #00796b;
}
</style>
