<script setup>
import { ref, computed } from 'vue'
import { GoalsBackend } from '../services/goals-backend'

const props = defineProps({
  model: Object,
  backend: {
    type: Object,
    default: GoalsBackend.getDefaultInstance()
  }
})

const isOpen = ref(false)
const editMode = ref(false)
const isFolder = computed(() => {
  return props.model.children?.length
})

function toggle() {
  isOpen.value = !isOpen.value
}

function changeType() {
  if (!isFolder.value) {
    props.model.children = []
    addChild()
    isOpen.value = true
  }
}

function addChild() {
  props.model.children.push({ title: 'new goal', id: Date.now() })
}

let beforeEditCache = ''
function edit() {
  beforeEditCache = props.model.title
  editMode.value = true
}

function cancelEdit() {
  props.model.title = beforeEditCache
  editMode.value = false
}

function doneEdit() {
  if (props.model.title.trim()) {
    props.model.title = props.model.title.trim()
    editMode.value = false
    if (beforeEditCache != props.model.title) {
      props.backend.updateGoal({ ...props.model, children: undefined })
    }
  } else {
    cancelEdit()
  }
}
</script>

<template>
  <li>
    <div :class="{ bold: isFolder }">
      <span v-if="isFolder" class="sign" @click="toggle">[{{ isOpen ? '-' : '+' }}]</span>
      <span v-else class="sign">&nbsp;-&nbsp;</span>
      <label v-if="!editMode" @dblclick="edit">{{ model.title }}</label>
      <input
        v-else
        class="edit"
        type="text"
        v-model="model.title"
        @vue:mounted="({ el }) => el.focus()"
        @blur="doneEdit"
        @keyup.enter="doneEdit"
        @keyup.escape="cancelEdit"
        :size="model.title.length"
      />
      <span v-if="!isFolder" class="sign" @dblclick="changeType">[+]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <!--
        A component can recursively render itself using its
        "name" option (inferred from filename if using SFC)
      -->
      <TreeItem class="item" v-for="model in model.children" :model="model"> </TreeItem>
      <li class="add sign" @click="addChild">&nbsp;+&nbsp;</li>
    </ul>
  </li>
</template>

<style>
ul {
  list-style-type: none;
}
.sign {
  font-family: monospace;
}
</style>
