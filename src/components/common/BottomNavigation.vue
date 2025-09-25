<template>
  <v-bottom-navigation 
    :model-value="activeTab"
    color="primary" 
    class="border-t"
    height="60"
    style="background-color: white;"
  >
    <v-btn
      value="home"
      @click="$router.push('/')"
    >
      <v-icon>mdi-home</v-icon>
      <span>홈</span>
    </v-btn>
    
    <v-btn
      value="search"
      @click="handleNavigation('search')"
    >
      <v-icon>mdi-magnify</v-icon>
      <span>탐색</span>
    </v-btn>
    
    <v-btn
      value="add"
      @click="handleNavigation('add')"
    >
      <v-icon>mdi-plus</v-icon>
      <span>작성</span>
    </v-btn>
    
    <v-btn
      value="chat"
      @click="$router.push('/chat')"
    >
      <v-icon>mdi-chat</v-icon>
      <span>채팅</span>
    </v-btn>
    
    <v-btn
      value="profile"
      @click="$router.push('/my')"
    >
      <v-icon>mdi-account</v-icon>
      <span>My</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'BottomNavigation',
  props: {
    activeTab: {
      type: String,
      default: 'home'
    }
  },
  methods: {
    handleNavigation(tab) {
      console.log(`${tab} 기능은 아직 구현되지 않았습니다.`);
      // 나중에 구현될 기능들 (탐색, 작성, 프로필)
      this.$emit('navigate', tab);
    }
  }
}
</script>

<style scoped>
.border-t {
  border-top: 1px solid #e0e0e0;
}
</style>