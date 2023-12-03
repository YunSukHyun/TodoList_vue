import axios from "axios";
import { defineStore } from "pinia";

export type Todos = Todo[]; // 할 일 목록

export interface Todo {
  id: string; // 할 일 ID
  order: number; // 할 일 순서
  title: string; // 할 일 제목
  done: boolean; // 할 일 완료 여부
  createdAt: string; // 할 일 생성일
  updatedAt: string; // 할 일 수정일
}

type FilterStatus = "all" | "todo" | "done";
type Filters = Filter[];

interface Filter {
  label: string;
  name: FilterStatus;
}

interface CreateTodoPayload {
  title: string;
}

interface DeleteTodoPayload {
  id: string;
}
interface ReorderTodosPayload {
  oldIndex: number;
  newIndex: number;
}
// 복잡한 값을 데이터를 초기화할 때는 타입 단언보단 처음부터 변수를 만들어서

const filters: Filters = [
  { label: "All", name: "all" },
  { label: "Todos", name: "todo" },
  { label: "Completed", name: "done" },
];

const currentTodo: Todo = {
  id: "",
  order: 0,
  title: "",
  done: false,
  createdAt: "",
  updatedAt: "",
};

export const useTodosStore = defineStore("todos", {
  state: () => ({
    todos: [] as Todos,
    filterdStatus: "all" as FilterStatus,
    filters,
    currentTodo,
    loading: false,
  }),
  getters: {
    filteredTodos({ todos, filterdStatus }) {
      return todos.filter((todo) => {
        switch (filterdStatus) {
          case "todo":
            return !todo.done;
          case "done":
            return todo.done;
          case "all":
          default:
            return true;
        }
      });
    },
  },
  actions: {
    async fetchTodos() {
      if (this.loading) return;
      this.loading = true;
      try {
        const { data } = await axios.post("/api/todos");
        this.todos = data;
      } catch (error) {
        console.error("fetchTodos:", error);
      } finally {
        this.loading = false;
      }
    },
    async createTodo({ title }: CreateTodoPayload) {
      // vercel serverless 함수와의 통신에선 post를 사용해야함
      if (this.loading) return;
      this.loading = true;
      try {
        const { data: createdTodo } = await axios.post("/api/todos", {
          method: "POST",
          data: {
            title,
          },
        });
        this.todos.unshift(createdTodo);
      } catch (error) {
        console.error("createTodo: ", error);
      } finally {
        this.loading = false;
      }
    },
    async updateTodo(todo: Todo) {
      const foundTodo = this.todos.find((t) => t.id === todo.id);
      if (!foundTodo) return;
      const backedUpTodo = { ...foundTodo };
      Object.assign(foundTodo, todo);
      try {
        const { id: path, title, done } = todo;
        const { data: updatedTodo } = await axios.post("/api/todos", {
          method: "PUT",
          path,
          data: {
            title,
            done,
          },
        });
        foundTodo.updatedAt = updatedTodo.updatedAt;
      } catch (error) {
        console.log(error);
        Object.assign(foundTodo, backedUpTodo);
      }
    },
    updateCheckboxes(done: boolean) {
      this.todos.forEach((todo) => {
        this.updateTodo({
          ...todo,
          done,
        });
      });
    },

    async deleteTodo({ id }: DeleteTodoPayload) {
      try {
        await axios.post("/api/todos", {
          method: "DELETE",
          path: id,
        });
        this.todos = this.todos.filter((todo) => todo.id !== id);
      } catch (error) {
        console.error(error);
      }
    },
    async deleteDoneTodos() {
      const todoIds = this.todos
        .filter((todo) => todo.done)
        .map((todo) => todo.id);

      if (!todoIds.length) return;
      this.loading = true;
      try {
        await axios.post("/api/todos", {
          method: "DELETE",
          path: "deletions",
          data: {
            todoIds,
          },
        });
        this.todos = this.todos.filter((todo) => !todoIds.includes(todo.id));
      } catch (error) {
        console.error("deleteDoneTodos:", error);
      } finally {
        this.loading = false;
      }
    },
    async reoderTodos({ oldIndex, newIndex }: ReorderTodosPayload) {
      if (oldIndex === newIndex) return;
      this.loading = true;
      const movedTodo = this.todos.splice(oldIndex, 1)[0];
      this.todos.splice(newIndex, 0, movedTodo);

      const todoIds = this.todos.map((todo) => todo.id);

      try {
        await axios.post("/api/todos", {
          method: "PUT",
          path: "reorder",
          data: { todoIds },
        });
      } catch (error) {
        console.error("reorderTodos:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
