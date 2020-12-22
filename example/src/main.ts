import { createApp } from "vue"
import App from "./App.vue"
import demoBlock from "./components/demo-block.vue";
const app = createApp(App)
app.component("DemoBlock", demoBlock);
app.mount("#app")

export default app
