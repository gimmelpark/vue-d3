<template>
  <div class="flex-grow-1">
    <div class="content background1 px-5 py-4" v-if="showContent">
      <RouterView />
    </div>
  </div>
</template>

<script>

export default {
  name: "Content",
  computed: {
    showContent () {
      return this.$route.name !== null
    }
  },
}
</script>

<style>
.content {
  min-height: calc(100vh - 150px);
  margin: 30px 150px 0 10px;
  border-radius:  30px;
}
.svg-container{
  background-color: #ffffff;
  border-radius: 15px;
  margin: 10px;
  overflow: hidden;
}
</style>