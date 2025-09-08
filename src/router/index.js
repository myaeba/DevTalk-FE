import LoginPage from "@/components/LoginPage.vue";
import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;