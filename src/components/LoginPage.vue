<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height pa-0" style="background-color: #f5f5f5;">
        <v-row justify="center" class="fill-height ma-0">
          <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
            <v-card class="fill-height" flat>
              <!-- Login Form -->
              <v-card-text v-if="currentPage === 'login'" class="pa-8">
                <div class="text-center mb-8">
                  <h1 class="text-h4 font-weight-bold text--primary">
                    DevConnect
                  </h1>
                </div>
                
                <v-form @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="loginForm.email"
                    label="이메일"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    variant="outlined"
                    color="primary"
                    class="mb-4"
                    required
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="loginForm.password"
                    label="비밀번호"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    variant="outlined"
                    color="primary"
                    class="mb-6"
                    required
                  ></v-text-field>
                  
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    class="mb-6"
                  >
                    로그인
                  </v-btn>
                </v-form>
                
                <div class="text-center">
                  <p class="text-body-2 text-medium-emphasis">
                    계정이 없으신가요?
                    <v-btn
                      @click="currentPage = 'signup'"
                      variant="text"
                      color="primary"
                      class="pa-0"
                      size="small"
                    >
                      회원가입
                    </v-btn>
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DevConnectLogin',
  data() {
    return {
      currentPage: 'login',
      loginForm: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    handleLogin() {
      
      console.log('Login attempt:', this.loginForm);
      
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>