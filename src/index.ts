import { Plugin } from "vite"
import { markdownComplier } from "./markdown-complier"

export default function createVueMarkDownPlugin(): Plugin {
  return {
    name: "vuedoc",
    configureServer: (server) => {
      const { app, moduleGraph } = server
      app.use((req, res, next) => {
        // console.log(req)
      })
      return
    },
    handleHotUpdate: () => {
      return
    },
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
