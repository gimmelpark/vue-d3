<template>
  <div id="app">
    <v-app>
<!--      <v-app-bar dense-->
<!--                 absolute-->
<!--                 color="primary">-->
<!--      </v-app-bar>-->
      <div class="d-flex">
        <Sidebar />
        <Content />
      </div>
    </v-app>
  </div>
</template>

<script>

import Content from "./components/Content/Content";
import Sidebar from "./components/Sidebar/Sidebar";

export default {
  name: 'App',
  components: {
    Sidebar,
    Content,
  }
}
</script>

<style>
#app {

}
</style>
