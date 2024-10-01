import "./assets/style.css";

import { createApp, ref } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App);

app.config.globalProperties.$sectionIsLoading = ref(false);

app.use(router);
app.use(store);
// app.use(routerGuards);

app.mount("#app");
