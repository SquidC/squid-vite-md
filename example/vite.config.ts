import { UserConfig } from "vite"
import { resolve } from "path"
import vueMd from "../src/index"

function pathResolve(dir: string) {
  return resolve(__dirname, dir)
}
const viteConfig: UserConfig = {
  port: 3050,
  alias: {
    "/@/": pathResolve("./src/"),
  },
  plugins: [
    vueMd(),
  ],
  optimizeDeps: {
    include: ["element-plus", "highlight.js"],
  },
}

export default viteConfig
