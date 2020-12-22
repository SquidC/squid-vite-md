import fs from "fs-extra"
import { Plugin } from "rollup"
import { markdownComplier } from "./markdown-complier"


export function createBuildPlugin(): Plugin{
  // rollup options
  return {
    name: "mdComplier",
    resolveId(id){
      if(/^\.md/.test(id)) {
        return id
      }
      return null
    },
    load(id) {
      // 不是编译后的vue
      if (id.indexOf("?vue") === -1) {
        if (id.endsWith(".md")) {
          const component = markdownComplier(id)
          fs.writeFileSync(id+".vue", component)
          return component
        }
      }
      return null
    },
  }
}
