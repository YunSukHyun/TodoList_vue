import MainPage from "./MainPage.vue";
import { createRouter, createWebHistory } from "vue-router";
export default createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", component: MainPage }],
});
