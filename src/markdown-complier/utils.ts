import { compileTemplate } from "@vue/compiler-sfc"
/**
 * 提交文本中script部分
 * @param content
 */
export function stripScript(content: string):string {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/)
  return result && result[2] ? result[2].trim() : ""
}

/**
 * 提交文本中style部分
 * @param content
 */
export function stripStyle(content: string):string {
  const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/)
  return result && result[2] ? result[2].trim() : ""
}

// 编写例子时不一定有 template。所以采取的方案是剔除其他的内容
export function stripTemplate(content: string):string {
  content = content.trim()
  if (!content) {
    return content
  }
  return content.replace(/<(script|style)[\s\S]+<\/\1>/g, "").trim()
}

function pad(source: string) {
  return source
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join("\n")
}

/**
 * template正则式
 */
const templateReplaceRegex = /<template>([\s\S]+)<\/template>/g

export function genInlineComponentText(path: string, template: string, script: string, fun=true) {
  // https://github.com/vuejs/vue-loader/blob/423b8341ab368c2117931e909e2da9af74503635/lib/loaders/templateLoader.js#L46
  let source = template
  if (templateReplaceRegex.test(source)) {
    source = source.replace(templateReplaceRegex, "$1")
  }
  const compiled = compileTemplate({
    source: `<div>${source}</div>`,
    filename: path,
    id: path,
    transformAssetUrls: false,
  })
  
  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      console.warn(tip)
    })
  }
  // errors
  if (compiled.errors && compiled.errors.length) {
    console.error(
      `\n  Error compiling template:\n${pad(compiled.source)}\n` +
        compiled.errors.map(e => `  - ${e}`).join("\n") +
        "\n",
    )
  }
  let demoComponentContent = compiled.code.replace("export function render", "function render")
  
  script = script.trim()
  if (script) {
    script = script
      .replace(/export\s+default/, "const democomponentExport =")
      .replace(/import ({.*}) from 'vue'/g, (s, s1) => `const ${s1} = Vue`)
  } else {
    script = "const democomponentExport = {}"
  }

  if(fun) {
    // 函数式组件
    return demoComponentContent = `(function() {
      ${demoComponentContent}
      ${script}
      return {
        render,
        ...democomponentExport
      }
    })()`
  }

  // 总页面编译成js
  demoComponentContent = demoComponentContent.replace(/_component_element_demo\d+ = (.*)/, (s, s1) => {
    // 组件名称
    const componentName = s1.match(/_resolveComponent\(\"(.*)\"\)/)[1]!
    const matchSFC = `${componentName}: \\([\\s\\S]+\\)`
    const functionComponent = 
    // 引用vue代码
    script.match(new RegExp(matchSFC))![0]
      .replace(`${componentName}:`, "")
      .replace(/import ({.*}) from ["']vue['"]/g, (s, s1) => {
        if(s.includes("createVNode")){
          // 结构没有as
          s1 = s1.replace(/ as/g, ":")
          return `const ${s1} = Vue`
        }
        // 代码块内部引用
        return `const ${s1} = Vue`
      })

    return s.replace(s1, functionComponent)
  })

  // 返回渲染函数
  return `
  import * as Vue from 'vue';
  ${demoComponentContent}
  const __script = { render };
  export default __script;
  `
}
