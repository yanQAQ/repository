<template>
  <div id="app">
    <!-- <HelloWorld msg="TypeScript App"/> -->
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
@Component({
  components: {
    HelloWorld
  }
})
export default class App extends Vue {
  created() {
    document.title = "源の空间";
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
#app::after {
  content: "";
  background: url("./assets/background/01.jpeg");
  opacity: 0.2;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
}
</style>
