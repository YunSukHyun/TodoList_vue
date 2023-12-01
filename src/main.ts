import App from "./App.vue";
import router from "./routes";
import { createApp } from "vue";
import { createPinia } from "pinia";
import "./main.scss";
createApp(App).use(createPinia()).use(router).mount("#app");
