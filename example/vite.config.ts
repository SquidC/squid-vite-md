import { UserConfig } from "vite"
import { resolve, join } from "path"
import vueMd from "../src"

function pathResolve(dir: string) {
  return resolve(__dirname, ".", dir)
}
const viteConfig: UserConfig = {
  port: 3050,
  alias: {
    "/@/": pathResolve("."),
  },
  plugins: [
    vueMd(),
  ],
  optimizeDeps: {
    include: ["lodash", "element-plus"],
  },
}

export default viteConfig
