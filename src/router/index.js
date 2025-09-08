import LoginPage from "@/views/LoginPage.vue";
import SignUp from "@/views/SignUp.vue";
import ChatList from "@/views/ChatList.vue";
import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/my/chat',
        name: 'ChatList',
        component: ChatList
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;