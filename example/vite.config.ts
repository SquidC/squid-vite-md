import { UserConfig } from "vite"
import { resolve } from "path"
import vueMd from "../src/index"
import vuePlugins from "@vitejs/plugin-vue"

function pathResolve(dir: string) {
  return resolve(__dirname, dir)
}

const viteConfig: UserConfig = {
  alias: {
    "@": pathResolve("./src/"),
  },
  plugins: [
    vueMd(),
    vuePlugins(),
  ],
  optimizeDeps: {
    include: ["element-plus", "highlight.js"],
  },
}

export default viteConfig
