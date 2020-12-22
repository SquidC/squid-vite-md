<template>
  <div class="app">
    <testMD />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import testMD from "./testMD.md"

export default defineComponent({
  name: "App",
  components: {
    testMD,
  },
  setup(){
  }
})
</script>
