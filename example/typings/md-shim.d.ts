declare module "*.md" {
  import { defineComponent } from "vue"
  const component: ReturnType<typeof defineComponent>
  export default component
}