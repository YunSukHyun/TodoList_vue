<template>
  <div class="todos-wrap shadow">
    <div class="todo-head">
      <TheIcon
        :active="isAllChecked"
        @click="toggleAllCheckboxes"
        >done_all</TheIcon
      >
      <div class="btn-group">
        <TheBtn
          v-for="filter in todosStore.filters"
          :key="filter.name"
          :active="todosStore.filterdStatus === filter.name"
          @click="todosStore.filterdStatus = filter.name"
        >
          {{ filter.label }}
        </TheBtn>
        <TheBtn
          danger
          @click="todosStore.deleteDoneTodos"
        >
          Delete Completed
        </TheBtn>
      </div>
    </div>
    <div
      ref="todoListEl"
      class="todo-list"
    >
      <TodoItem
        v-for="todo in todosStore.filteredTodos"
        :key="todo.id"
        :todo="todo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TheIcon from "./TheIcon.vue";
import TodoItem from "./TodoItem.vue";
import TheBtn from "./TheBtn.vue";
import { debounce } from "lodash";
import { computed, onMounted, ref } from "vue";
import Sortable from "sortablejs";
import { useTodosStore } from "~/store/todos";

const todosStore = useTodosStore();
const todoListEl = ref<HTMLDivElement | null>(null);

const debounced = debounce((val: boolean) => {
  todosStore.updateCheckboxes(val);
}, 1000);

const isAllChecked = computed({
  get() {
    return (
      !!todosStore.filteredTodos.length &&
      todosStore.filteredTodos.every((todo) => todo.done)
    );
  },
  set(val: boolean) {
    todosStore.todos.forEach((todo) => {
      todo.done = val;
    });
    debounced(val);
  },
});
todosStore.fetchTodos();

onMounted(() => {
  initSortable();
});

function toggleAllCheckboxes() {
  isAllChecked.value = !isAllChecked.value;
}

function initSortable() {
  if (!todoListEl.value) return;
  new Sortable(todoListEl.value, {
    handle: ".drag-handle",
    animation: 0,
    forceFallback: true,
    onEnd: (event) => {
      const { oldIndex, newIndex } = event;
      todosStore.reoderTodos({
        oldIndex: oldIndex as number,
        newIndex: newIndex as number,
      });
    },
  });
}
</script>
<style lang="scss" scoped>
.todos-wrap {
  border-radius: 6px;
  overflow: hidden;
}
</style>
