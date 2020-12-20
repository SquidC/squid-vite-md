import { Plugin } from "rollup"


export function createBuildPlugin(): Plugin{
  console.log("执行build plugin", "aaa")

  // rollup options
  return {
    name: "mdComplier",
    resolveId(id){
      console.log("reslove:", id)
      return id
    },
    async load(id) {
      console.log("load", id)

      return null
    },
  }
}
