# asdadsad

## aaa

# 1

:::demo 测试备注

```html
<template>
    <div class="abc">123</div>
    <h1>789</h1>
    {{ state }}
    <button @click="click">click</button>
</template>
<script>
import { defineComponent, reactive } from "vue"
export default defineComponent({
  setup(){
      const state = reactive({
          count: 0
      })

      const click = () => {
          state.count++;
      }

      return {
          state,
          click
      }
  }
})
</script>
<style>
    .abc{
        color: red;
    }
</style>
```
:::

# 2

:::demo 测试备注2

```html
<template>
    <div class="abc">456</div>
    <h1>456</h1>
    {{ state }}
    <button @click="click">click</button>
</template>
<script>
import { defineComponent, reactive } from "vue"
export default defineComponent({
  setup(){
      const state = reactive({
          count: 0
      })

      const click = () => {
          state.count++;
      }

      return {
          state,
          click
      }
  }
})
</script>
<style>
    .abc{
        color: green;
    }
</style>
```
:::

# 3

:::demo 测试备注3

```html
<template>
    <div class="abc">
        789
        <h1>123</h1>
    </div>
    {{ state }}
    <button @click="click">click</button>
</template>
<script>
import { defineComponent, reactive } from "vue"
export default defineComponent({
  setup(){
      const state = reactive({
          count: 0
      })

      const click = () => {
          state.count++;
      }

      return {
          state,
          click
      }
  }
})
</script>
<style lang="less">
    .abc {
        color: #0088ff;
        h1 {
            color: red;
        }
    }
</style>
```
:::

asdasdsd

|asdasda|asdadad|
|-------|-------|
|1|2|
|3|43|

> hello world

>> aasdasda

>>> 3333


`hello`

_hello_

__hello__


[aaaa](https://www.baidu.com/)

ASDASD

### 自定义显示内容
:::demo 备注测试 vscdoe

```html
<template>
  <div class="hello-wrap">
    hello world vscode {{ input }} {{state.a}}
  </div>
</template>
<script>
import { defineComponent, ref, reactive} from 'vue'
export default defineComponent ({
  setup() {
    const state = reactive({
      a: 1
    })
    return {
      input: ref('666'),
      state
    }
  }
})
</script>
```
:::