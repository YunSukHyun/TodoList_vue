import MainPage from "./MainPage.vue";
import TodoItemModal from "./TodoItemModal.vue";
import { createRouter, createWebHistory } from "vue-router";
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: MainPage,
      children: [{ path: "/:id", component: TodoItemModal }],
    },
  ],
});
