import { UserConfig } from "vite"
import { resolve } from "path"
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
    include: ["element-plus"],
  },
}

export default viteConfig
