<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>

    <!-- 하단 네비게이션 (로그인/회원가입 제외) -->
    <BottomNavigation v-if="shouldShowNavigation" :activeTab="currentTab" />
  </v-app>
</template>

<script>
import BottomNavigation from '@/components/common/BottomNavigation.vue'

export default {
  name: 'App',
  components: {
    BottomNavigation
  },
  computed: {
    shouldShowNavigation() {
      // 로그인, 회원가입, 게시글 작성 페이지에서는 네비게이션을 숨김
      const hideNavRoutes = ['/login', '/signup', '/create']
      return !hideNavRoutes.includes(this.$route.path)
    },
    currentTab() {
      // 현재 라우트에 따라 활성 탭 결정
      const path = this.$route.path
      if (path === '/') return 'home'
      if (path === '/chat' || path.startsWith('/chat/')) return 'chat'
      if (path === '/my' || path.startsWith('/my/')) return 'profile'
      if (path.includes('/search')) return 'search'
      if (path.includes('/add')) return 'add'
      return 'home'
    }
  }
}
</script>

<style>
/* 전역 스타일 - 하단 여백 완전 제거 */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  height: 100% !important;
  overflow-x: hidden !important;
}

#app {
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

.v-application {
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* v-main의 기본 패딩 제거 */
.v-main {
  padding: 0 !important;
  height: 100vh !important;
}
</style>

