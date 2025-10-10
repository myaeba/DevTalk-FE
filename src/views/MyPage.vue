<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0 mypage-container" style="background-color: #f5f5f5;">
        <v-row justify="center" class="ma-0 fill-height">
          <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
            <v-card class="mypage-card" flat>

              <!-- 상단 헤더 -->
              <v-card-title class="d-flex align-center pa-4 border-b" style="background-color: white;">
                <h2 class="text-h6 font-weight-bold">My</h2>
                <v-spacer></v-spacer>
                <v-btn icon variant="text" @click="openSettings">
                  <v-icon color="grey-darken-1">mdi-cog</v-icon>
                </v-btn>
              </v-card-title>

              <!-- 프로필 섹션 -->
              <v-card-text class="text-center pa-6 border-b" style="background-color: white;">
                <div class="mb-4">
                  <v-avatar size="96" class="mb-4" @click="viewProfileImage" style="cursor: pointer;">
                    <v-img :src="profileImage" alt="프로필 사진">
                      <template v-slot:placeholder>
                        <v-icon size="48">mdi-account</v-icon>
                      </template>
                    </v-img>
                    <!-- 카메라 아이콘 -->
                    <div class="camera-icon">
                      <v-icon size="16" color="white">mdi-camera</v-icon>
                    </div>
                  </v-avatar>
                </div>

                <h2 class="text-h6 font-weight-bold mb-2">{{ userProfile.name }}</h2>
                <p class="text-body-2 text-grey-darken-1" @click="editStatusMessage" style="cursor: pointer;">
                  {{ userProfile.statusMessage }}
                </p>
              </v-card-text>

              <!-- 통계 섹션 -->
              <v-card-text class="pa-4 border-b" style="background-color: white;">
                <v-row class="text-center">
                  <v-col cols="2" @click="goToMyPosts" class="stats-item">
                    <div class="text-h6 font-weight-bold text-grey-darken-3">{{ stats.posts }}</div>
                    <div class="text-caption text-grey-darken-1">작성한 글</div>
                  </v-col>
                  <v-col cols="2" @click="goToMyComments" class="stats-item">
                    <div class="text-h6 font-weight-bold text-grey-darken-3">{{ stats.comments }}</div>
                    <div class="text-caption text-grey-darken-1">작성한 댓글</div>
                  </v-col>
                  <v-col cols="3" @click="goToFollowing" class="stats-item">
                    <div class="text-h6 font-weight-bold text-grey-darken-3">{{ stats.following }}</div>
                    <div class="text-caption text-grey-darken-1">팔로잉</div>
                  </v-col>
                  <v-col cols="3" @click="goToFollowers" class="stats-item">
                    <div class="text-h6 font-weight-bold text-grey-darken-3">{{ stats.followers }}</div>
                    <div class="text-caption text-grey-darken-1">팔로워</div>
                  </v-col>
                  <v-col cols="2" @click="goToScraps" class="stats-item">
                    <div class="text-h6 font-weight-bold text-grey-darken-3">{{ stats.scraps }}</div>
                    <div class="text-caption text-grey-darken-1">스크랩</div>
                  </v-col>
                </v-row>
              </v-card-text>

              <!-- 메뉴 리스트 -->
              <v-list style="background-color: white;">
                <!-- 개인정보 수정 -->
                <v-list-item @click="goToPersonalInfo" class="cursor-pointer">
                  <template v-slot:prepend>
                    <v-avatar size="40" color="green-lighten-4">
                      <v-icon color="green-darken-2">mdi-account-edit</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium">개인정보 수정</v-list-item-title>
                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>

                <v-divider></v-divider>

                <!-- 로그아웃 -->
                <v-list-item @click="logout" class="cursor-pointer">
                  <template v-slot:prepend>
                    <v-avatar size="40" color="red-lighten-4">
                      <v-icon color="red-darken-2">mdi-logout</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium text-red-darken-2">로그아웃</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- 상태 메시지 수정 다이얼로그 -->
    <v-dialog v-model="statusDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h6">상태 메시지 수정</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editedStatusMessage"
            label="상태 메시지"
            variant="outlined"
            density="compact"
            maxlength="50"
            counter
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="statusDialog = false">
            취소
          </v-btn>
          <v-btn color="primary" variant="text" @click="saveStatusMessage">
            저장
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 로그아웃 확인 다이얼로그 -->
    <v-dialog v-model="logoutDialog" max-width="300px">
      <v-card>
        <v-card-title class="text-h6">로그아웃</v-card-title>
        <v-card-text>로그아웃 하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="logoutDialog = false">
            취소
          </v-btn>
          <v-btn color="primary" variant="text" @click="confirmLogout">
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: 'MyPage',
  data() {
    return {
      statusDialog: false,
      logoutDialog: false,
      editedStatusMessage: '',

      // 사용자 프로필 정보
      userProfile: {
        name: '김개발',
        statusMessage: '열정적인 개발자입니다 🚀'
      },

      // 통계 데이터
      stats: {
        posts: 42,
        comments: 156,
        following: 128,
        followers: 256,
        scraps: 73
      },

      // 프로필 이미지
      profileImage: 'https://via.placeholder.com/96/4CAF50/FFFFFF?text=김'
    }
  },

  methods: {
    // 설정 버튼 클릭
    openSettings() {
      console.log('설정 열기');
    },

    // 프로필 이미지 보기
    viewProfileImage() {
      console.log('프로필 사진 확대 보기');
    },

    // 상태 메시지 수정
    editStatusMessage() {
      this.editedStatusMessage = this.userProfile.statusMessage;
      this.statusDialog = true;
    },

    // 상태 메시지 저장
    saveStatusMessage() {
      this.userProfile.statusMessage = this.editedStatusMessage;
      this.statusDialog = false;
      console.log('상태 메시지 저장:', this.editedStatusMessage);
    },

    // 통계 항목 클릭 이벤트들
    goToMyPosts() {
      console.log('작성한 글로 이동');
      // TODO: 라우팅 구현
    },

    goToMyComments() {
      console.log('작성한 댓글 목록으로 이동');
      // TODO: 라우팅 구현
    },

    goToFollowing() {
      console.log('팔로잉 목록으로 이동');
      // TODO: 라우팅 구현
    },

    goToFollowers() {
      console.log('팔로워 목록으로 이동');
      // TODO: 라우팅 구현
    },

    goToScraps() {
      console.log('스크랩 목록으로 이동');
      // TODO: 라우팅 구현
    },

    // 개인정보 수정
    goToPersonalInfo() {
      console.log('개인정보 수정으로 이동');
      // TODO: 라우팅 구현
    },

    // 로그아웃
    logout() {
      this.logoutDialog = true;
    },

    // 로그아웃 확인
    confirmLogout() {
      this.logoutDialog = false;
      this.doLogout();
    },

    // 로그아웃 처리
    doLogout() {
      console.log('로그아웃 처리');

      // 모든 localStorage 데이터 제거
      localStorage.clear();

      // 페이지 새로고침하여 완전히 초기화
      window.location.reload();
    }
  }
}
</script>

<style scoped>
/* MyPage 컨테이너 - 화면 높이에 맞춤 */
.mypage-container {
  height: 100vh;
  overflow: hidden;
}

.mypage-card {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px; /* 하단 네비게이션 공간 확보 (60px로 정확히 맞춤) */
}

.fill-height {
  height: 100vh;
}

.border-b {
  border-bottom: 1px solid #e0e0e0;
}

.cursor-pointer {
  cursor: pointer;
}

/* 통계 항목 호버 효과 */
.stats-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.stats-item:hover {
  background-color: #f5f5f5;
}

/* 프로필 이미지 카메라 아이콘 */
.camera-icon {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background-color: #1976d2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* 프로필 이미지 호버 효과 */
.v-avatar:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}

/* 텍스트 스타일 */
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>