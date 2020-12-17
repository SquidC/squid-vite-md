import { UserConfig } from "vite"
import { resolve, join } from "path"
import vueMd from "../src"

function pathResolve(dir: string) {
  return resolve(__dirname, ".", dir)
}
const viteConfig: UserConfig = {
  port: 3050,
  // alias a path to a fs directory
  // 路径别名必须以斜杠开头斜杠结尾
  alias: {
    "/@/": pathResolve("."),
  },
  plugins: [
    vueMd(),
  ],
  optimizeDeps: {
    include: ["fs-extra"],
  },
}

export default viteConfig
