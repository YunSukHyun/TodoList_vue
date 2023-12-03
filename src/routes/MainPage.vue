<template>
  <main>
    <TodoCreator />
    <TodoList />
    <TheMessage />
  </main>
  <Transition><RouterView v-if="todosStore.todos.length" /></Transition>
</template>

<script setup lang="ts">
import TheMessage from "~/components/TheMessage.vue";
import TodoCreator from "~/components/TodoCreator.vue";
import TodoList from "~/components/TodoList.vue";
import { useTodosStore } from "~/store/todos";
const todosStore = useTodosStore();
</script>

<style lang="scss" scoped>
main {
  max-width: 700px;
  margin: 0 auto;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
