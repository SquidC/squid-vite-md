import { UserConfig } from "vite"
import { resolve } from "path"
import vueMd from "../src"
import vuePlugins from "@vitejs/plugin-vue"

function pathResolve(dir: string) {
  return resolve(__dirname, dir)
}

const viteConfig: UserConfig = {
  alias: {
    "@": pathResolve("./src/"),
  },
  plugins: [
    vuePlugins(),
    vueMd(),
  ],
  optimizeDeps: {
    include: ["highlight.js"],
  },
}

export default viteConfig
