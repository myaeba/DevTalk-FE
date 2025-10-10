<template>
  <div class="bottom-nav-fixed">
    <v-container fluid class="pa-0" style="background-color: #f5f5f5;">
      <v-row justify="center" class="ma-0">
        <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
          <div class="custom-bottom-nav">
            <v-btn 
              :class="{ 'active-tab': activeTab === 'home' }"
              variant="text" 
              @click="$router.push('/')"
              class="nav-btn"
            >
              <v-icon>mdi-home</v-icon>
            </v-btn>

            <v-btn 
              :class="{ 'active-tab': activeTab === 'search' }"
              variant="text" 
              @click="handleNavigation('search')"
              class="nav-btn"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-btn
              :class="{ 'active-tab': activeTab === 'add' }"
              variant="text"
              @click="$router.push('/create')"
              class="nav-btn"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>

            <v-btn 
              :class="{ 'active-tab': activeTab === 'chat' }"
              variant="text" 
              @click="$router.push('/chat')"
              class="nav-btn"
            >
              <v-icon>mdi-chat</v-icon>
            </v-btn>

            <v-btn 
              :class="{ 'active-tab': activeTab === 'profile' }"
              variant="text" 
              @click="$router.push('/my')"
              class="nav-btn"
            >
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
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
      this.$emit('navigate', tab);
    }
  }
}
</script>

<style scoped>
.bottom-nav-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.custom-bottom-nav {
  background-color: white;
  height: 60px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.nav-btn {
  flex: 1;
  height: 60px !important;
  border-radius: 0 !important;
  min-width: auto !important;
}

.nav-btn .v-icon {
  font-size: 24px !important;
  color: #666 !important;
}

.nav-btn.active-tab .v-icon {
  color: #1976d2 !important;
}

.nav-btn:hover .v-icon {
  color: #1976d2 !important;
}
</style>