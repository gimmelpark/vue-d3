<template>
<div class="sidebar">
  <div v-for="(link, ind) in navLinks"
       :key="ind"
       class="sidebar-link-wrpp">
    <RouterLink :to="link.to"
                class="sidebar-link blue-grey--text text--darken-3 text-h6 text-decoration-none"
    >{{link.title}}</RouterLink>
  </div>
</div>
</template>

<script>
export default {
  name: "Sidebar",
  data: () => ({
    navLinks: [
      {
        title: 'Простые числа',
        to: '/',
      },
      {
        title: 'Что-то еще',
        to: '/',
      },
      {
        title: 'И еще что-то',
        to: '/',
      },
    ],
  }),
};
</script>

<style scoped>
.sidebar {
  width: 250px;
}
.sidebar-link-wrpp {

}
.sidebar-link-wrpp > .sidebar-link {

}
</style>