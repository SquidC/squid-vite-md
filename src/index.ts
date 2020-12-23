import { Plugin } from "vite"
import { createBuildPlugin } from "./build"
import { createServerPlugin } from "./server"

export default function createVueMarkDownPlugin(): Plugin {
  return {
    configureServer: [createServerPlugin()],
    // @ts-ignore
    // 使用vue plugin 编译的文件
    rollupPluginVueOptions: {
      include: /\.(vue|md)$/
    },
    rollupInputOptions: {
      plugins: [createBuildPlugin()],
    },
  }
}
