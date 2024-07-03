<script setup>
import { ref, computed, onMounted } from 'vue'
import { GoalsBackend } from '../services/goals-backend'
import { formatDate } from '../services/date-utils'
import EditGoal from './EditGoal.vue'

const props = defineProps({
  model: Object,
  backend: {
    type: Object,
    default: GoalsBackend.getDefaultInstance()
  },
  collapsed: {
    type: Boolean,
    default: true
  },
  container: {
    type: Array,
    default: null
  },
  moveConfig: Object,
  parent: Object
})

const selected = ref(false)

const emit = defineEmits(['create', 'delete', 'levelUp'])

const newGoalTitle = 'new goal'
const newGoalId = 'id-new-tbd'

const isOpen = ref(!props.collapsed)
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
    startCreation()
    isOpen.value = true
  }
}

function startCreation() {
  props.model.children.push({
    id: newGoalId,
    title: newGoalTitle,
    tags: props.model.tags,
    type: props.model.type == 2 ? 2 : undefined
  })
}

// called when child is already in UI tree and edit finished, so we just need to send request to backend and update id
async function addChild(goal) {
  if (goal) {
    try {
      const serverData = await props.backend.create({ parentId: props.model.id, ...goal })
      if (serverData?.id) {
        goal.id = serverData.id
        goal.targetDate ||= serverData.targetDate
      } else {
        console.error(
          `The goal created by id was not provided by server. Server data: `,
          serverData
        )
      }
    } catch (ex) {
      console.error(`Issue with goal creation: ` + ex)
    }
  }
}

function startEdit() {
  editMode.value = true
}

// only valid goal properties has to be updated, other source properties to be ignored. Id should remain unchanged
const updateGoalProperties = (target, source) =>
  ['title', 'targetDate', 'tags', 'type'].reduce((target, propertyName) => {
    if (propertyName in source) {
      target[propertyName] = source[propertyName]
    }
    return target
  }, target)

function doneEdit(updatedGoalData) {
  console.debug('TreeItem:doneEdit:updatedGoalData:', updatedGoalData)
  if (updatedGoalData) {
    updateGoalProperties(props.model, updatedGoalData)
    if (newGoal) {
      emit('create', props.model)
    } else {
      props.backend.updateGoal(updatedGoalData)
    }
  }
  editMode.value = false
}

function openDeleteConfirmation() {
  if (window.confirm('Do you really want to delete the goal?')) {
    setTimeout(() => emit('delete', props.model.id))
    props.backend.delete(props.model.id)
  }
}

function deleteChild(goalId) {
  if (!goalId) return console.error(`Could not delete the goal as id was not provided`)
  const childIndex = props.model.children.findIndex((goal) => goal.id == goalId)
  if (childIndex != -1) {
    props.model.children.splice(childIndex, 1)
  } else {
    console.error(`Attemting to delete not-existent goal with id='${goalId}'`)
  }
}

function moveUp() {
  const index = props.container?.findIndex((goal) => goal.id == props.model.id)
  if (index > 0) {
    props.container.splice(index - 1, 2, props.container[index], props.container[index - 1])
    props.backend.moveUp(props.model.id)
  }
}

function levelDown() {
  const index = props.container?.findIndex((goal) => goal.id == props.model.id)
  if (index > 0) {
    const newParent = props.container[index - 1]
    if (!newParent.children) newParent.children = []
    newParent.children.push(props.model)
    props.container.splice(index, 1)
    props.backend.levelDown(props.model.id)
  }
}

function levelUp() {
  emit('levelUp', props.model.id)
  props.backend.levelUp(props.model.id)
}

function levelChildUp(childId) {
  if (props.container) {
    const indexInContainer = props.container.findIndex((goal) => goal.id == props.model.id)
    const indexOfChild = props.model.children.findIndex((goal) => goal.id == childId)
    props.container.splice(indexInContainer + 1, 0, props.model.children[indexOfChild])
    props.model.children.splice(indexOfChild, 1)
    if (!props.model.children.length) delete props.model.children
  }
}

let newGoal = false

onMounted(() => {
  if (props.model.id == newGoalId) {
    newGoal = true
    startEdit()
  }
})
</script>

<template>
  <li>
    <div :class="{ bold: isFolder }" @mouseenter="selected = true" @mouseleave="selected = false">
      <span v-if="isFolder" class="sign" @click="toggle">[{{ isOpen ? '-' : '+' }}]</span
      ><span v-else class="sign" @dblclick="startEdit">&nbsp;-&nbsp;</span
      ><label v-if="!editMode" @dblclick="startEdit"
        >{{ model.title
        }}<span v-if="model.targetDate"> к {{ formatDate(model.targetDate) }}</span></label
      ><EditGoal v-else :model @doneEdit="doneEdit" /><span
        v-if="!isFolder && selected"
        class="sign"
        @dblclick="changeType"
        >[+]</span
      ><span v-if="isFolder && selected" class="sign" @dblclick="startCreation">[+]</span>
      <span v-if="selected && props.parent" class="sign" @click="levelUp">[←]</span>
      <span
        v-if="selected && !props.parent && moveConfig.mode == 'timeline'"
        class="sign"
        @click="moveConfig.onMove({ goal: model, direction: 'left' })"
        >[←]</span
      >
      <span
        v-if="selected && container?.length && moveConfig.mode == 'tree'"
        class="sign"
        @click="moveUp"
        >[↑]</span
      >
      <span
        v-if="selected && container?.length && moveConfig.mode == 'tree'"
        class="sign"
        @click="levelDown"
        >[→]</span
      >
      <span
        v-if="selected && moveConfig.mode == 'timeline'"
        class="sign"
        @click="moveConfig.onMove({ goal: model, direction: 'right' })"
        >[→]</span
      >
      <span v-if="!isFolder && selected" class="sign" @click="openDeleteConfirmation">[x]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <TreeItem
        class="item"
        v-for="(child, index) in model.children"
        :model="child"
        :collapsed="props.collapsed"
        @create="addChild"
        @delete="deleteChild"
        :key="child.id"
        :container="index ? props.model.children : null"
        @levelUp="levelChildUp"
        :moveConfig="moveConfig"
        :parent="props.model"
      >
      </TreeItem>
    </ul>
  </li>
</template>

<style>
.sign {
  font-family: monospace;
}
label {
  cursor: pointer;
}
</style>
