import { Plugin } from "vite"
import { markdownComplier } from "./markdown-complier"

const MDMAP = /\.md$/

export default function createVueMarkDownPlugin(): Plugin {

  return {
    name: "vite-md-compiler",

    handleHotUpdate: (ctx) => {
      const { modules } = ctx
      if(MDMAP.test(ctx.file)) {
        return modules
      }
      return modules
    },

    load(id) {
      console.log(id)
      return null
    },

    transform(_, id) {
      if (MDMAP.test(id)) {
        const vueComponent = markdownComplier(id)

        return {
          code: vueComponent,
          map: undefined
        }
      }
    },
  }
}
