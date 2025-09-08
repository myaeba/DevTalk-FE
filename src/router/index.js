import LoginPage from "@/views/LoginPage.vue";
import SignUp from "@/views/SignUp.vue";
import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;