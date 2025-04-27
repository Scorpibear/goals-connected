<template>
  <div class="parent-change-view">
    <TreeView id="my-tree" v-model="goalsTree" selection-mode="single" :selected="selectedParentId"
      @treeNodeClick="onSelectParent" :model-defaults="modelDefaults">
      <template #expander="{ metaModel, customClasses, expanderId, canExpand, toggleNodeExpanded }">
        <button :id="expanderId" type="button" v-if="canExpand" aria-hidden="true" tabindex="-1"
          :title="metaModel.expanderTitle" class="grtvn-self-expander" :class="[customClasses.treeViewNodeSelfExpander,
          metaModel.state.expanded ? 'grtvn-self-expanded' : '',
          metaModel.state.expanded ? customClasses.treeViewNodeSelfExpanded : '']" @click="toggleNodeExpanded">
          {{ metaModel.state.expanded ? '-' : '+' }}
        </button>
        <span v-else class="grtvn-self-spacer" :class="customClasses.treeViewNodeSelfSpacer"></span>
      </template>
    </TreeView>
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
  },
  goalsTree: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['apply', 'cancel'])

const backend = BackendSelector.getBackend()
let goalsTree = props.goalsTree;
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

watch(() => props.currentParentId, (newVal) => {
  selectedParentId.value = newVal
})

function modelDefaults(node) {
  return {
    expandable: true,
    selectable: true,
    state: {
      expanded: false,
      selected: false,
    },
    labelProperty: 'title'
  }
}
</script>

<style>
.parent-change-view {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.grtvn-self-selected {
  border: 2px solid #007bff;
}
</style>
