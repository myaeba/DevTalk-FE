<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height pa-0" style="background-color: #f5f5f5;">
        <v-row justify="center" class="fill-height ma-0">
          <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
            <v-card class="fill-height" flat>
              <!-- Signup Form -->
              <v-card-text class="pa-8">
                <div class="text-center mb-8">
                  <h1 class="text-h4 font-weight-bold text--primary">
                    회원가입
                  </h1>
                </div>
                
                <v-form @submit.prevent="memberRegister">
                  <v-text-field
                    v-model="email"
                    label="이메일"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    variant="outlined"
                    color="primary"
                    class="mb-4"
                    required
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="nickname"
                    label="닉네임"
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    variant="outlined"
                    color="primary"
                    class="mb-4"
                    required
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="password"
                    label="비밀번호"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    variant="outlined"
                    color="primary"
                    class="mb-4"
                    required
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="checkPassword"
                    label="비밀번호 확인"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
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
                    가입하기
                  </v-btn>
                </v-form>
                
                <div class="text-center">
                  <p class="text-body-2 text-medium-emphasis">
                    이미 계정이 있으신가요?
                    <v-btn
                      @click="$router.push('/login')"
                      variant="text"
                      color="primary"
                      class="pa-0"
                      size="small"
                    >
                      로그인
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
import axios from 'axios';

export default {
  data() {
    return {
        email: '',
        nickname: '',
        password: '',
        checkPassword: ''
    }
  },
  methods: {
    async memberRegister() {
      // 비밀번호 확인 체크
      if (this.password !== this.checkPassword) {
        this.$toast?.error('비밀번호가 일치하지 않습니다.') || alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      
      // todo: 이메일 형식 체크
      
      // todo: 닉네임 길이 체크
      
      // todo: 비밀번호 길이 체크

      const data = {
        nickname : this.nickname,
        email : this.email,
        password : this.password
      }
      
      await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member/register`, data)
      this.$router.push("/")
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

/* Vuetify 커스터마이징 */
.v-text-field {
  margin-bottom: 8px;
}

/* 포커스 상태 강화 */
.v-text-field--focused .v-field__outline {
  border-width: 2px;
}

/* 반응형 조정 */
@media (max-width: 600px) {
  .v-card-text {
    padding: 24px 16px !important;
  }
}
</style>