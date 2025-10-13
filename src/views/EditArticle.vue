<template>
  <v-container fluid class="pa-0 edit-post-container" style="background-color: #f5f5f5;">
    <v-row justify="center" class="ma-0 fill-height">
      <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
        <v-card class="edit-post-card" flat>
          <!-- 상단 헤더 -->
          <v-card-title class="d-flex align-center pa-4 border-b" style="background-color: white;">
            <v-btn icon variant="text" @click="goBack" class="mr-2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <h2 class="text-h6 font-weight-bold">게시물 수정</h2>
            <v-spacer></v-spacer>
          </v-card-title>

          <!-- 로딩 상태 -->
          <div v-if="loading" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p class="text-caption text-grey-darken-1 mt-2">게시글을 불러오는 중...</p>
          </div>

          <!-- 작성 영역 -->
          <div v-else class="post-content-area" style="background-color: white;">
            <!-- 제목 입력 -->
            <div class="px-4">
              <v-text-field
                v-model="title"
                placeholder="제목을 입력하세요"
                variant="plain"
                density="comfortable"
                hide-details
                class="text-h6 font-weight-medium title-input"
                style="font-size: 50px;"
              ></v-text-field>
            </div>

            <!-- 구분선 -->
            <v-divider></v-divider>

            <!-- 내용 입력 -->
            <div class="px-4 pt-1">
              <v-textarea
                v-model="content"
                placeholder="내용을 입력하세요"
                variant="plain"
                hide-details
                auto-grow
                rows="4"
                max-rows="8"
                class="text-body-2 content-input"
              ></v-textarea>
            </div>
          </div>

          <!-- 하단 버튼 영역 -->
          <div class="fixed-bottom-actions">
            <div class="d-flex justify-space-between align-center pa-4" style="background-color: white; border-top: 1px solid #e0e0e0;">
              <v-btn variant="text" color="grey-darken-1" @click="goBack">
                취소
              </v-btn>
              <v-btn
                color="primary"
                @click="updateArticle"
                :disabled="!canUpdate"
                style="border-radius: 20px;"
              >
                수정하기
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EditArticle',
  data() {
    return {
      loading: true,
      articleId: null,
      title: '',
      content: ''
    }
  },
  async mounted() {
    this.articleId = this.$route.params.articleId;
    await this.loadArticle();
  },
  computed: {
    canUpdate() {
      return this.title.trim() && this.content.trim();
    }
  },
  methods: {
    async loadArticle() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');

        console.log('수정할 게시글 로드 시작, articleId:', this.articleId);

        const response = await axios.get(`/articles/${this.articleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'
        });

        const article = response.data;
        this.title = article.title;
        this.content = article.content;

        console.log('게시글 로드 완료:', article);
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        if (error.response?.status === 401) {
          localStorage.clear();
          this.$router.push('/login');
        } else {
          alert('게시글을 불러올 수 없습니다.');
          this.goBack();
        }
      } finally {
        this.loading = false;
      }
    },

    async updateArticle() {
      if (!this.canUpdate) return;

      try {
        const token = localStorage.getItem('token');

        const updateData = {
          title: this.title,
          content: this.content
        };

        console.log('게시글 수정 요청:', updateData);

        const response = await axios.put(`/articles/${this.articleId}`, updateData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'
        });

        console.log('게시글 수정 성공:', response.data);
        alert('게시물이 수정되었습니다.');

        // 수정된 게시글로 이동
        this.$router.push(`/articles/${this.articleId}`);

      } catch (error) {
        console.error('게시글 수정 실패:', error);

        if (error.response?.status === 401) {
          localStorage.clear();
          this.$router.push('/login');
        } else {
          alert('게시글 수정에 실패했습니다.');
        }
      }
    },

    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
/* 전체 컨테이너 - 화면 높이에 맞춤 */
.edit-post-container {
  height: 100vh;
  overflow: hidden;
}

.edit-post-card {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.fill-height {
  height: 100vh;
}

.border-b {
  border-bottom: 1px solid #e0e0e0;
}

/* 작성 영역 */
.post-content-area {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; /* 하단 버튼 공간 확보 */
}

/* 하단 버튼 고정 */
.fixed-bottom-actions {
  position: sticky;
  bottom: 0;
  z-index: 10;
}

/* 제목 입력창 스타일 */
.title-input {
  font-size: 18px !important;
  font-weight: 600 !important;
}

/* 내용 입력창 스타일 */
.content-input {
  font-size: 14px !important;
  line-height: 1.6 !important;
}
</style>