<template>
    <div class="sidebar">
        <div class="ml-8 mr-10">
            <div v-for="(link, ind) in navLinks"
                 :key="ind"
                 class="sidebar-link-wrpp mb-3">
                <RouterLink :to="{ name: link.to }"
                            class="sidebar-link grey--text text--darken-1 text-h6 text-decoration-none font-weight-bold"
                >{{ link.title }}
                </RouterLink>
            </div>
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
                to: 'PrimeNumbers',
            },
            {
                title: 'Спираль',
                to: 'Spiral',
            },
            {
                title: 'Фигуры Лиссажу',
                to: 'Lissajous',
            },
        ],
    }),
};
</script>

<style scoped>
.sidebar {
    width: 300px;
    flex-shrink: 0;
}

.sidebar > div {
    padding-top: 30px;
}

.sidebar-link-wrpp {
}

.sidebar-link-wrpp > .sidebar-link {
    display: block;
    height: 40px;
    width: 100%;
    padding-left: 20px;
    line-height: 40px;
    border-radius: 10px;
}

.sidebar-link-wrpp > .sidebar-link.router-link-active,
.sidebar-link-wrpp > .sidebar-link.router-link-active:hover {
    background-color: #fcefe1;
}

.sidebar-link-wrpp > .sidebar-link:hover {
    background-color: #fffaf5;
}
</style>