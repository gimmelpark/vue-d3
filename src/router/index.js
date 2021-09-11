import Vue from 'vue'
import VueRouter from 'vue-router'
import PrimeNumbers from "@/components/Content/PrimeNumbers/PrimeNumbers";
import Spiral from "@/components/Content/Spiral/Spiral";
import Lissajous from "@/components/Content/Lissajous/Lissajous";



Vue.use(VueRouter)

const routes = [
    {
        path: '/prime-numbers',
        name: 'PrimeNumbers',
        component: PrimeNumbers,
    },
    {
        path: '/spiral',
        name: 'Spiral',
        component: Spiral,
    },
    {
        path: '/lissajous',
        name: 'Lissajous',
        component: Lissajous,
    },
]

const router = new VueRouter({
    routes
})

export default router