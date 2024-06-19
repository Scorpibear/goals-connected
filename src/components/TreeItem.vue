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
  }
})

const emit = defineEmits(['create', 'delete'])

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
  props.model.children.push({ id: newGoalId, title: newGoalTitle, tags: props.model.tags })
}

// called when child is already in UI tree and edit finished, so we just need to send request to backend and update id
async function addChild(goal) {
  if (goal) {
    try {
      const serverData = await props.backend.create({ parentId: props.model.id, ...goal })
      if (serverData?.id) {
        goal.id = serverData.id
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
    console.log(
      `Deleting goal id=${goalId} at index=${childIndex}. Parent goal: ${props.model.title}`
    )
    console.log(
      `Children before splice: `,
      props.model.children.map((child) => child.title).join(',')
    )
    props.model.children.splice(childIndex, 1)
    console.log(
      `Children after splice: `,
      props.model.children.map((child) => child.title).join(',')
    )
  } else {
    console.error(`Attemting to delete not-existent goal with id='${goalId}'`)
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
    <div :class="{ bold: isFolder }">
      <span v-if="isFolder" class="sign" @click="toggle">[{{ isOpen ? '-' : '+' }}]</span
      ><span v-else class="sign" @dblclick="startEdit">&nbsp;-&nbsp;</span
      ><label v-if="!editMode" @dblclick="startEdit"
        >{{ model.title
        }}<span v-if="model.targetDate"> к {{ formatDate(model.targetDate) }}</span></label
      ><EditGoal v-else :model @doneEdit="doneEdit" /><span
        v-if="!isFolder"
        class="sign"
        @dblclick="changeType"
        >[+]</span
      ><span v-if="!isFolder" class="sign" @click="openDeleteConfirmation">[x]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <TreeItem
        class="item"
        v-for="model in model.children"
        :model="model"
        :collapsed="props.collapsed"
        @create="addChild"
        @delete="deleteChild"
        v-bind:key="model.id"
      >
      </TreeItem>
      <li class="add sign" @click="startCreation">&nbsp;+&nbsp;</li>
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
