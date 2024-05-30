<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  model: Object
})

const emits = defineEmits({ doneEdit, cancelEdit })
</script>

<template>
  <input
    class="edit"
    type="text"
    v-model="model.title"
    @vue:mounted="({ el }) => el.focus()"
    @blur="doneEdit"
    @keyup.enter="doneEdit"
    @keyup.escape="cancelEdit"
    :size="model.title.length"
  />
</template>

<style></style>
