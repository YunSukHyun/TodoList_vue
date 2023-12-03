<template>
  <div class="todo-creator shadow">
    <TheLoader v-if="todoStore.loading" />
    <TheIcon
      v-else
      active
      @click="createTodo"
      >add</TheIcon
    >
    <input
      :value="title"
      placeholder="Input new todo"
      @input="title = ($event.target as HTMLInputElement).value"
      @keydown.enter="createTodo"
    />
  </div>
</template>

<script setup lang="ts">
import TheLoader from "./TheLoader.vue";
import { ref } from "vue";
import TheIcon from "~/components/TheIcon.vue";
import { useTodosStore } from "~/store/todos";
const title = ref("");

const todoStore = useTodosStore();
async function createTodo(event: MouseEvent | KeyboardEvent) {
  if (event instanceof KeyboardEvent && event.isComposing) return;
  if (!title.value.trim()) return;
  try {
    await todoStore.createTodo({
      title: title.value,
    });
    title.value = "";
  } catch (err) {
    console.error("TodoCreator/createTodo");
  }
}
</script>

<style lang="scss" scoped>
.todo-creator {
  height: var(--item-height);
  position: relative;
  margin-bottom: 28px;
  :deep(.the-loader),
  :deep(.the-icon) {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 24px;
    z-index: 1;
  }
  input {
    padding: 0 10px 0 80px;
    border: none;
    outline: none;
    border-radius: 6px;
    background-color: #fff;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    &::placeholder {
      color: #ccc;
    }
  }
}
</style>
