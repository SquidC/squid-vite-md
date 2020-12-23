import { Plugin } from "rollup"
import { markdownComplier } from "./markdown-complier"


export function createBuildPlugin(): Plugin{
  // rollup options
  return {
    name: "vuedoc",
    load(id) {
      // 不是编译后的vue
      if (id.indexOf("?vue") === -1) {
        if (id.endsWith(".md")) {
          const component = markdownComplier(id)
          return component
        }
      }
      return null
    },
  }
}
