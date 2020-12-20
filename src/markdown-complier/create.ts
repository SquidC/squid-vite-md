import MarkdownIt from "markdown-it"
import MarkdownItContainer from "markdown-it-container"
import {highlight, getLanguage} from "highlight.js"
import Token from "markdown-it/lib/token"
import { addFenceRule } from "./fence"


// 高亮html代码
const handleHighlight = (str: string, lang: string) => {
  if (!lang || !getLanguage(lang)) {
    return '<pre><code class="hljs">' + str + '</code></pre>'
  }
  const html = highlight(lang, str, true, undefined).value
  return `<pre><code class="hljs language-${lang}">${html}</code></pre>`
}

const md =  new MarkdownIt({
  html: true,
  highlight: handleHighlight
})

// 使用md插件,让md支持 :::demo 这样的语法
md.use(MarkdownItContainer, "demo", {
  validate(params: string) {
    return params.trim().match(/^demo\s*(.*)$/)
  },
  render(tokens: Token[], idx: number) {
    const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
    if (tokens[idx].nesting === 1) {
      const description = m && m.length > 1 ? m[1] : ""
      const content = tokens[idx + 1].type === "fence" ? tokens[idx + 1].content : ""
      return `<demo-block>
      ${description ? `<div>${md.render(description)}</div>` : ""}
      <!--element-demo: ${content}:element-demo-->
      `
    }
    return "</demo-block>"
  },
})
md.use(MarkdownItContainer, "tip");
md.use(MarkdownItContainer, "warning");
addFenceRule(md)

export default md
