<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <!-- 로그인 화면 -->
        <v-row 
          v-if="!isLoggedIn" 
          justify="center" 
          align="center" 
          class="fill-height"
        >
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <v-card 
              class="mx-auto pa-8" 
              elevation="2" 
              rounded="lg"
              max-width="400"
            >
              <!-- 로고 및 환영 메시지 -->
              <div class="text-center mb-8">
                <v-card-title class="text-h4 font-weight-bold justify-center pa-0 mb-2">
                  DevConnect
                </v-card-title>
                <v-card-subtitle class="text-body-1 pa-0">
                  개발자들과 함께 성장하세요
                </v-card-subtitle>
              </div>

              <!-- 로그인 폼 -->
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="loginForm.email"
                  label="이메일"
                  type="email"
                  variant="filled"
                  prepend-inner-icon="mdi-email-outline"
                  class="mb-2"
                  :rules="emailRules"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="loginForm.password"
                  label="비밀번호"
                  type="password"
                  variant="filled"
                  prepend-inner-icon="mdi-lock-outline"
                  class="mb-4"
                  :rules="passwordRules"
                  required
                ></v-text-field>

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  class="mb-6"
                  :loading="loginLoading"
                >
                  로그인
                </v-btn>
              </v-form>

              <!-- 소셜 로그인 구분선 -->
              <v-divider class="my-6">
                <span class="text-body-2 text-medium-emphasis px-4">또는</span>
              </v-divider>

              <!-- 소셜 로그인 버튼 -->
              <v-btn
                @click="handleKakaoLogin"
                color="#FEE500"
                size="large"
                block
                class="mb-3 text-grey-darken-3"
                :loading="kakaoLoading"
              >
                <template v-slot:prepend>
                  <v-icon>mdi-chat</v-icon>
                </template>
                카카오로 계속하기
              </v-btn>

              <v-btn
                @click="handleGoogleLogin"
                variant="outlined"
                size="large"
                block
                class="mb-6"
                :loading="googleLoading"
              >
                <template v-slot:prepend>
                  <v-icon color="#4285f4">mdi-google</v-icon>
                </template>
                Google로 계속하기
              </v-btn>

              <!-- 회원가입 링크 -->
              <div class="text-center">
                <span class="text-body-2 text-medium-emphasis">
                  아직 계정이 없으신가요?
                </span>
                <v-btn
                  @click="showSignup = true"
                  variant="text"
                  color="primary"
                  size="small"
                  class="pa-1 ml-1"
                >
                  회원가입
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- 회원가입 다이얼로그 (예시) -->
    <v-dialog v-model="showSignup" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          회원가입
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="signupForm.name"
              label="이름"
              variant="outlined"
              class="mb-2"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="signupForm.email"
              label="이메일"
              type="email"
              variant="outlined"
              class="mb-2"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="signupForm.password"
              label="비밀번호"
              type="password"
              variant="outlined"
              class="mb-2"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="signupForm.confirmPassword"
              label="비밀번호 확인"
              type="password"
              variant="outlined"
              class="mb-2"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showSignup = false">
            취소
          </v-btn>
          <v-btn color="primary" variant="text" @click="handleSignup">
            가입하기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: 'DevConnectLogin',
  data() {
    return {
      isLoggedIn: false,
      showSignup: false,
      loginLoading: false,
      kakaoLoading: false,
      googleLoading: false,
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      emailRules: [
        v => !!v || '이메일을 입력해주세요',
        v => /.+@.+\..+/.test(v) || '올바른 이메일 형식이 아닙니다'
      ],
      passwordRules: [
        v => !!v || '비밀번호를 입력해주세요',
        v => (v && v.length >= 6) || '비밀번호는 6자 이상이어야 합니다'
      ]
    }
  },
  methods: {
    async handleLogin() {
      this.loginLoading = true;
      try {
        // 로그인 로직 구현
        console.log('로그인:', this.loginForm);
        // 임시로 2초 후 로그인 완료
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.isLoggedIn = true;
      } catch (error) {
        console.error('로그인 실패:', error);
      } finally {
        this.loginLoading = false;
      }
    },
    
    async handleKakaoLogin() {
      this.kakaoLoading = true;
      try {
        // 카카오 로그인 로직 구현
        console.log('카카오 로그인');
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.isLoggedIn = true;
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
      } finally {
        this.kakaoLoading = false;
      }
    },
    
    async handleGoogleLogin() {
      this.googleLoading = true;
      try {
        // 구글 로그인 로직 구현
        console.log('구글 로그인');
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.isLoggedIn = true;
      } catch (error) {
        console.error('구글 로그인 실패:', error);
      } finally {
        this.googleLoading = false;
      }
    },
    
    handleSignup() {
      // 회원가입 로직 구현
      console.log('회원가입:', this.signupForm);
      this.showSignup = false;
      // 회원가입 완료 후 로그인 페이지로 돌아가거나 자동 로그인
    }
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}

.v-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

/* 카카오 버튼 커스텀 스타일 */
.v-btn--color-\#FEE500 {
  background-color: #FEE500 !important;
}

.v-btn--color-\#FEE500:hover {
  background-color: #FDD800 !important;
}
</style>