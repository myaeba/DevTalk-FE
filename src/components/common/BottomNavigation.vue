<template>
  <v-bottom-navigation color="primary" class="border-t">
    <v-btn 
      value="home"
      @click="handleNavigation('home')"
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
      color="primary"
      @click="handleNavigation('chat')"
    >
      <v-icon>mdi-chat</v-icon>
      <span>채팅</span>
    </v-btn>
    <v-btn 
      value="profile"
      @click="handleNavigation('profile')"
    >
      <v-icon>mdi-account</v-icon>
      <span>프로필</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'BottomNavigation',
  props: {
    activeTab: {
      type: String,
      default: 'chat'
    }
  },
  methods: {
    handleNavigation(tab) {
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