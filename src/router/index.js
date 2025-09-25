import LoginPage from "@/views/LoginPage.vue";
import SignUp from "@/views/SignUp.vue";
import ChatList from "@/views/ChatList.vue";
import ChatRoom from "@/views/ChatRoom.vue";
import Home from "@/views/Home.vue";
import MyPage from "@/views/MyPage.vue";
import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage,
        meta: { requiresAuth: false }
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp,
        meta: { requiresAuth: false }
    },
    {
        path: '/chat',
        name: 'ChatList',
        component: ChatList
    },
    {
        path: '/chat/room/:roomId',
        name: 'ChatRoom',
        component: ChatRoom,
    },
    {
        path: '/my',
        name: 'MyPage',
        component: MyPage
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 라우터 가드 추가
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  
  // 로그인/회원가입 페이지가 아닌데 토큰이 없으면 로그인으로
  if (to.meta.requiresAuth !== false && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/signup') && token) {
    // 이미 로그인된 상태면 홈으로
    next('/')
  } else {
    next()
  }
})

export default router;