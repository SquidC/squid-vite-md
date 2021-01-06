
import fs from "fs-extra"
import md from "./create"
import {
  genInlineComponentText,
  stripScript,
  stripTemplate
} from "./utils";

/**
 * markdown 解析器 输入md文件路径 解释成demo-vue组件 生成.vue
 * @param path md文件路径
 * @returns 返回处理后的md文件内容
 */
export function markdownComplier(path: string): string {
  const fileContent = fs.readFileSync(path).toString()
  // markdown-it编译成html
  // 实例代码做了两个处理
  //    - 高亮实例代码
  //    - 注释掉实例组件代码  -> 找出注释代码 sfc编译成组件
  const content = md.render(fileContent)

  const startTag = "<!--element-demo:";
  const startTagLen = startTag.length;
  const endTag = ":element-demo-->";
  const endTagLen = endTag.length;

  let componenetsString = "";
  let id = 0; // demo 的 id
  const output = []; // 输出的内容
  let start = 0; // 字符串开始位置

  let commentStart = content.indexOf(startTag);
  let commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  while (commentStart !== -1 && commentEnd !== -1) {
    output.push(content.slice(start, commentStart));

    const commentContent = content.slice(
      commentStart + startTagLen,
      commentEnd
    );
    // 获取 <template> <script>
    const html = stripTemplate(commentContent);
    const script = stripScript(commentContent);
    const demoComponentContent = genInlineComponentText(path, html, script);
    const demoComponentName = `element-demo${id}`;
    // 生成函数式组件 渲染代码块的组件
    output.push(`<template #source><${demoComponentName} /></template>`);
    componenetsString += `${demoComponentName}: ${demoComponentContent},`;

    // 重新计算下一次的位置
    id++;
    start = commentEnd + endTagLen;
    commentStart = content.indexOf(startTag, start);
    commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  }

  // 仅允许在 demo 不存在时，才可以在 Markdown 中写 script 标签
  // let pageScript = "";
  // if (componenetsString) {
  //   pageScript = `<script>
  //     import * as Vue from 'vue';
  //     export default {
  //       name: 'component-doc',
  //       components: {
  //         ${componenetsString}
  //       }
  //     }
  //   </script>`;
  // } else if (content.indexOf("<script>") === 0) {
  //   // 硬编码，有待改善
  //   start = content.indexOf("</script>") + "</script>".length;
  //   pageScript = content.slice(0, start);
  // }

  output.push(content.slice(start));
  const pageTemplate = `
  <template>
    <section class="content element-doc">
    ${output.join("")}
    </section>
  </template>`
  return genInlineComponentText(path, pageTemplate, componenetsString, false)
}
