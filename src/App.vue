<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    
  </v-app>
</template>

<script>


export default {
  name: 'App',
  components: {
    
    
  },
  computed: {
    shouldShowNavigation() {
      // 로그인과 회원가입 페이지에서는 네비게이션을 숨김
      const hideNavRoutes = ['/login', '/signup']
      return !hideNavRoutes.includes(this.$route.path)
    },
    currentTab() {
      // 현재 라우트에 따라 활성 탭 결정
      const path = this.$route.path
      if (path === '/') return 'home'
      if (path === '/chat') return 'chat'
      if (path.includes('/search')) return 'search'
      if (path.includes('/profile')) return 'profile'
      return 'home'
    }
  }
}
</script>

