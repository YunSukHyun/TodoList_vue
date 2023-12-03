<template>
  <div class="modal">
    <div
      class="background"
      @click="offModal"
    ></div>
    <div class="contents">
      <div class="todo-head">
        <TheIcon
          :active="todosStore.currentTodo.done"
          @click="toggleDone"
          >check</TheIcon
        >
        <div class="btn-group">
          <TheBtn @click="offModal">Cancel</TheBtn>
          <TheBtn
            danger
            :loading="deleteLoading"
            @click="deleteTodo"
            >Delete</TheBtn
          >
          <TheBtn
            success
            :loading="updateLoading"
            @click="updateTodo"
            >Save</TheBtn
          >
        </div>
      </div>
      <div class="date-group">
        <div class="date">
          Created: {{ formatDate(todosStore.currentTodo.createdAt) }}
        </div>
        <div
          v-if="
            todosStore.currentTodo.createdAt !==
            todosStore.currentTodo.updatedAt
          "
          class="date"
        >
          Edited: {{ formatDate(todosStore.currentTodo.updatedAt) }}
        </div>
      </div>
      <div
        ref="editorEl"
        class="editor"
        contenteditable
        @blur="onChange"
        @keydown.enter.prevent="onChange(), updateTodo()"
        v-text="todosStore.currentTodo.title"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import TheBtn from "~/components/TheBtn.vue";
import TheIcon from "~/components/TheIcon.vue";
import { useTodosStore } from "~/store/todos";

const todosStore = useTodosStore();
const route = useRoute();
const router = useRouter();

const editorEl = ref<HTMLDivElement | null>(null);
const updateLoading = ref(false);
const deleteLoading = ref(false);

const foundTodo = todosStore.todos.find((todo) => todo.id === route.params.id);
foundTodo ? (todosStore.currentTodo = { ...foundTodo }) : router.push("/");

onMounted(() => {
  editorEl.value?.focus();
  window.addEventListener("keydown", escKeyHandler);
});

onUnmounted(() => {
  window.removeEventListener("keydown", escKeyHandler);
});

function escKeyHandler(event: KeyboardEvent) {
  if (event.key === "Escape") offModal();
}
function toggleDone() {
  todosStore.currentTodo.done = !todosStore.currentTodo.done;
}

function onChange() {
  const title = editorEl.value?.textContent;
  if (title && title.trim()) {
    todosStore.currentTodo.title = title;
  }
}
function offModal() {
  router.push("/");
}
async function deleteTodo() {
  if (updateLoading.value || deleteLoading.value) return;
  deleteLoading.value = true;
  try {
    await todosStore.deleteTodo({
      id: todosStore.currentTodo.id,
    });
    offModal();
  } catch (error) {
    console.error("TodoItemModal/deleteTodo:", error);
  } finally {
    deleteLoading.value = false;
  }
}
async function updateTodo() {
  if (updateLoading.value || deleteLoading.value) return;
  updateLoading.value = true;
  try {
    await todosStore.updateTodo({
      ...todosStore.currentTodo,
    });
    offModal();
  } catch (error) {
    console.error("TodoItemModal/updateTodo");
  } finally {
    updateLoading.value = false;
  }
}
function formatDate(date: string) {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(#000, 0.7);
  }
  .contents {
    margin: 0 16px;
    width: 100%;
    max-width: 700px;
    max-height: calc(100vh - 40px);
    overflow: auto;
    border-radius: 4px;
    background-color: #fff;
    position: relative;
    .date-group {
      padding: 30px 30px 0 30px;
      .date {
        color: #ddd;
        font-size: 14px;
        line-height: 1.4;
      }
    }
    .editor {
      padding: 30px;
      line-height: 1.5;
      outline: none;
    }
  }
}
</style>
