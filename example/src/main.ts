import { createApp } from "vue"
import App from "./App.vue"
import demoBlock from "../src/components/demo-block.vue";
import "highlight.js/styles/vs2015.css"

const app = createApp(App)

app.component("DemoBlock", demoBlock);
app.mount("#app")

export default app
