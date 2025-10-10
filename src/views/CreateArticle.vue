<template>
  <v-container fluid class="pa-0 create-post-container" style="background-color: #f5f5f5;">
    <v-row justify="center" class="ma-0 fill-height">
      <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
        <v-card class="create-post-card" flat>
          <!-- 상단 헤더 -->
          <v-card-title class="d-flex align-center pa-4 border-b" style="background-color: white;">
            <v-btn icon variant="text" @click="goBack" class="mr-2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <h2 class="text-h6 font-weight-bold">새 게시물 작성</h2>
            <v-spacer></v-spacer>
          </v-card-title>


          <!-- 작성 영역 -->
          <div class="post-content-area" style="background-color: white;">
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
                placeholder="무슨 생각을 하고 계신가요?"
                variant="plain"
                hide-details
                auto-grow
                rows="4"
                max-rows="8"
                class="text-body-2 content-input"
              ></v-textarea>
            </div>

            <!-- 태그 선택 (임시 숨김) -->
            <!--
            <div class="pa-4 pt-0">
              <v-select
                v-model="selectedTag"
                :items="availableTags"
                placeholder="태그 선택"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-pound"
                hide-details
                class="mb-3"
                @update:model-value="addSelectedTag"
                clearable
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :title="`#${item.raw}`"></v-list-item>
                </template>
                <template v-slot:selection="{ item }">
                  #{{ item.raw }}
                </template>
              </v-select>

              <div class="d-flex flex-wrap ga-2" v-if="tags.length > 0">
                <v-chip
                  v-for="(tag, index) in tags"
                  :key="index"
                  size="small"
                  closable
                  @click:close="removeTag(index)"
                  color="primary"
                  variant="flat"
                  style="border-radius: 16px;"
                >
                  #{{ tag }}
                </v-chip>
              </div>
            </div>
            -->

          </div>

          <!-- 하단 버튼 영역 -->
          <div class="fixed-bottom-actions">
            <div class="d-flex justify-space-between align-center pa-4" style="background-color: white; border-top: 1px solid #e0e0e0;">
              <v-btn variant="text" color="grey-darken-1" @click="saveDraft">
                임시저장
              </v-btn>
              <v-btn
                color="primary"
                @click="publishPost"
                :disabled="!canPublish"
                style="border-radius: 20px;"
              >
                작성하기
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
  name: 'CreateArticle',
  data() {
    return {
      title: '',
      content: '',
      selectedTag: null,
      tags: [],
      selectedVisibility: '전체 공개',
      visibilityOptions: ['전체 공개', '친구만', '비공개'],
      availableTags: [
        'JavaScript',
        'Python',
        'Java',
        'React',
        'Vue',
        'Spring',
        'Node.js',
        'TypeScript',
        'CSS',
        'HTML',
        'MySQL',
        'MongoDB',
        'AWS',
        'Docker',
        'Git',
        '알고리즘',
        '코딩테스트',
        '면접준비',
        '프론트엔드',
        '백엔드',
        '풀스택',
        '데이터베이스',
        '서버',
        '배포',
        '최적화'
      ]
    }
  },
  computed: {
    canPublish() {
      return this.title.trim() && this.content.trim();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    addSelectedTag(selectedTag) {
      if (selectedTag && !this.tags.includes(selectedTag)) {
        this.tags.push(selectedTag);
        this.selectedTag = null;
      }
    },
    removeTag(index) {
      this.tags.splice(index, 1);
    },
    toggleVisibilityOptions() {
      const currentIndex = this.visibilityOptions.indexOf(this.selectedVisibility);
      this.selectedVisibility = this.visibilityOptions[(currentIndex + 1) % this.visibilityOptions.length];
    },
    async saveDraft() {
      try {
        const token = localStorage.getItem('token');

        const draftData = {
          title: this.title,
          content: this.content,
          tags: this.tags,
          visibility: this.selectedVisibility,
          isDraft: true
        };

        console.log('임시저장 요청:', draftData);

        const response = await axios.post('/articles/draft', draftData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'
        });

        console.log('임시저장 성공:', response.data);
        alert('임시저장되었습니다.');

      } catch (error) {
        console.error('임시저장 실패:', error);

        if (error.response?.status === 401) {
          localStorage.clear();
          this.$router.push('/login');
        } else {
          alert('임시저장에 실패했습니다.');
        }
      }
    },
    async publishPost() {
      if (!this.canPublish) return;

      try {
        // 로딩 상태 표시 (선택사항)
        const token = localStorage.getItem('token');

        const requestData = {
          title: this.title,
          content: this.content,
          tags: this.tags,
          visibility: this.selectedVisibility
        };

        console.log('게시물 작성 요청:', requestData);

        const response = await axios.post('/articles', requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'
        });

        console.log('게시물 작성 성공:', response.data);

        // 성공 시 홈으로 이동
        this.$router.push('/');

      } catch (error) {
        console.error('게시물 작성 실패:', error);

        if (error.response?.status === 401) {
          // 인증 실패 시 로그인 페이지로 이동
          localStorage.clear();
          this.$router.push('/login');
        } else {
          // 다른 에러는 사용자에게 알림
          alert('게시물 작성에 실패했습니다. 다시 시도해주세요.');
        }
      }
    }
  }
}
</script>

<style scoped>
/* CreateArticle 컨테이너 - 화면 높이에 맞춤 */
.create-post-container {
  height: 100vh;
  overflow: hidden;
}

.create-post-card {
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

.border-t {
  border-top: 1px solid #e0e0e0;
}

/* 작성 영역 스크롤 */
.post-content-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 하단 고정 버튼 */
.fixed-bottom-actions {
  position: sticky;
  bottom: 0;
  z-index: 10;
}

/* 스크롤바 숨기기 */
.post-content-area::-webkit-scrollbar {
  display: none;
}

.post-content-area {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 제목 입력 필드 패딩 제거 */
.title-input :deep(.v-field__field) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.title-input :deep(.v-field__input) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

/* 내용 입력 필드 패딩만 조정 */
.content-input :deep(.v-field__field) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.content-input :deep(.v-field__input) {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  min-height: 60px !important;
}

/* 그라데이션 효과 제거 */
.content-input :deep(.v-field__input),
.content-input :deep(textarea),
.content-input :deep(.v-field__field) {
  mask: none !important;
  -webkit-mask: none !important;
  -webkit-mask-image: none !important;
  mask-image: none !important;
}

.content-input :deep(textarea) {
  background: transparent !important;
  color: rgba(0, 0, 0, 0.87) !important;
  -webkit-text-fill-color: rgba(0, 0, 0, 0.87) !important;
  text-shadow: none !important;
  filter: none !important;
  opacity: 1 !important;
}

/* 제목과 내용 색상 통일 */
.title-input :deep(.v-field__input input),
.content-input :deep(.v-field__input textarea) {
  color: rgba(0, 0, 0, 0.87) !important;
  -webkit-text-fill-color: rgba(0, 0, 0, 0.87) !important;
}

/* 추가적인 그라데이션 방지 */
.content-input :deep(*::before),
.content-input :deep(*::after) {
  background: none !important;
  background-image: none !important;
  mask: none !important;
  -webkit-mask: none !important;
}
</style>