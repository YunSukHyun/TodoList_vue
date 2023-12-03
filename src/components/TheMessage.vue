<template>
  <div class="the-message">{{ message }}</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTodosStore } from "~/store/todos";

const todosStore = useTodosStore();
const message = computed(() => {
  if (!todosStore.todos.length) return "Write yout todos";
  if (!todosStore.filteredTodos.length) return "No Filtering todos";
  if (todosStore.filterdStatus === "all")
    return "Drag & Drop if you want to reorder";
  return "Check daily todos";
});
</script>

<style lang="scss" scoped>
.the-message {
  margin-top: 40px;
  text-align: center;
  color: rgba(#fff, 0.25);
}
</style>
