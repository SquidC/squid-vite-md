import { Plugin, ViteDevServer } from "vite"
import { markdownComplier } from "./markdown-complier"

function parseId(id: string) {
  const index = id.indexOf("?")
  if (index < 0)
    return id

  else
    return id.slice(0, index)
}

export interface Options {
  devServer?: ViteDevServer;
}

export default function createVueMarkDownPlugin(): Plugin {
  let options: Options = {
    devServer: undefined
  }
  return {
    name: "vite-md-compiler",
    configureServer(server) {
      if(server) {
        options.devServer = server
      }
    },
    transform(raw, id) {
      const path = parseId(id)
      if (!path.endsWith(".md")){
        return raw
      }
      const vueComponent = markdownComplier(path, options)
      return vueComponent

    },
  }
}
