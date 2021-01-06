import { Plugin } from "vite"
import { markdownComplier } from "./markdown-complier"

function parseId(id: string) {
  const index = id.indexOf("?")
  if (index < 0)
    return id

  else
    return id.slice(0, index)
}

export default function createVueMarkDownPlugin(): Plugin {

  return {
    name: "vite-md-compiler",
    enforce: "pre",
    transform(raw, id) {
      
      const path = parseId(id)
      if (!path.endsWith(".md")){
        return raw
      }
      const vueComponent = markdownComplier(path)

      return vueComponent

    },
  }
}
