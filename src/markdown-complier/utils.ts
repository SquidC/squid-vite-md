import { compileStyle, compileTemplate } from "@vue/compiler-sfc" 
import hash from "hash-sum"

type PreprocessLang = "less" | "sass" | "scss" | "styl" | "stylus";

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
export function stripStyle(content: string): {
  lang: PreprocessLang,
  code: string
} {
  const result = content.match(/<(style)\s*(lang="(less|sass|scss|styl|stylus)")?>([\s\S]+)<\/\1>/)
  return {
    lang: (result && result[3] ? result[3].trim() : "") as PreprocessLang,
    code: (result && result[4] ? result[4].trim() : "") 
  }
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


function _compileStyle(
  path: string,
  scopeId: string,
  style: string,
  styleLang?: PreprocessLang
) {
  if (style) {
    const compiledStyle = compileStyle({
      source: style!,
      filename: path,
      id: scopeId+"-s",
      scoped: true,
      preprocessLang: styleLang,
    })
    style = [
      `const id = "${path}?scope=${scopeId}"`,
      `import.meta.hot = createHotContext(id);`,
      `const css = ${JSON.stringify(compiledStyle.code)}`,
      `updateStyle(id, css)`,
      `import.meta.hot.accept()`,
      `import.meta.hot.prune(() => removeStyle(id))`
    ].join("\n")
  }
  return style
}

function _compileTemplate(path: string, source: string) {
  // https://github.com/vuejs/vue-loader/blob/423b8341ab368c2117931e909e2da9af74503635/lib/loaders/templateLoader.js#L46
  if (templateReplaceRegex.test(source)) {
    source = source.replace(templateReplaceRegex, "$1")
  }
  const compiled = compileTemplate({
    source: source,
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

  let template = compiled.code.replace("export function render", "function render")
  return template
}

function _compileScript(path: string, script: string) {
  script = script.trim()
  if (script) {
    script = script
      .replace(/export\s+default/, "const democomponentExport =")
      .replace(/import ({.*}) from 'vue'/g, (s, s1) => `const ${s1} = Vue`)
  } else {
    script = "const democomponentExport = {}"
  }
  return script
}

export function genInlineComponentText(
  path: string,
  template: string,
  script: string,
  style: string = "",
  styleLang?: PreprocessLang,
  genFun = false ) {
    
  const scopeId = hash(path+template+script+style)
  template = _compileTemplate(path, template)
  style = _compileStyle(path, scopeId, style, styleLang)
  script = _compileScript(path, script)

  if(genFun) {
    // 函数式组件
    return template = `(function() {
      ${template}
      ${script}
      ${style}
      return {
        render,
        __scopeId: "data-v-${scopeId}",
        ...democomponentExport
      }
    })()`
  }

  // 按照 element-demo${count} 分割script
  let scripts = script.split("element-demo")
  scripts.shift()
  scripts = scripts.map(script => script.replace(/\d: ([\s\S]+),/, (s, s1)=> s1))

  // 总页面编译成js
  template = template.replace(/_component_element_demo\d+ = (.*)/g, (s, s1) => {
    // 组件名称
    const componentName = s1.match(/_resolveComponent\(\"(.*)\"\)/)[1]
    // 引用vue代码
    const functionComponent = 
      scripts[componentName.match(/\d+/)[0]!] // 匹配代码
        .replace(/import ({.*}) from ["']vue['"]/g, (s, s1) => {
          if(s.includes("createVNode")){
            s1 = s1.replace(/ as/g, ":") // 结构没有as
            return `const ${s1} = Vue`
          }
          // 代码块内部引用
          return `const ${s1} = Vue`
        })

    return s.replace(s1, functionComponent)
  })

  // 返回渲染函数
  return [
    `import { updateStyle, removeStyle } from "/@vite/client";`,
    `import * as Vue from 'vue';`,
    `${template}`,
    `const __script = { render };`,
    `export default __script;`
  ].join("\n")
  
}
