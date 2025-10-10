<template>
  <!-- 홈 피드 화면 - 간소화된 구조 -->
  <div class="home-wrapper">
    <div class="home-content">
      <!-- 상단 헤더 -->
      <div class="header-section">
        <h2 class="text-h6 font-weight-bold">DevConnect</h2>
        <div class="header-actions">
          <v-btn icon variant="text" size="small">
            <v-icon size="20">mdi-chat-outline</v-icon>
          </v-btn>
          <v-btn icon variant="text" size="small">
            <v-icon size="20">mdi-bell-outline</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- 검색창 -->
      <div class="search-section">
        <v-text-field
          v-model="searchQuery"
          placeholder="태그나 사용자를 검색하세요..."
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          class="mb-3"
          style="border-radius: 8px;"
        ></v-text-field>

        <!-- 필터 옵션 -->
        <div class="filter-buttons">
          <v-btn
            v-for="(filter, index) in filters"
            :key="index"
            :color="filter.active ? 'primary' : 'default'"
            :variant="filter.active ? 'flat' : 'outlined'"
            size="small"
            class="mr-2 flex-shrink-0"
            style="border-radius: 20px; text-transform: none;"
            @click="selectFilter(index)"
          >
            {{ filter.name }}
          </v-btn>
        </div>
      </div>

      <!-- 게시물 피드 -->
      <div class="posts-section">
        <!-- 로딩 상태 -->
        <div v-if="loading" class="text-center pa-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="text-caption text-grey-darken-1 mt-2">게시글을 불러오는 중...</p>
        </div>

        <!-- 게시글이 없을 때 -->
        <div v-else-if="posts.length === 0" class="text-center pa-8">
          <v-icon size="48" color="grey-lighten-1">mdi-post-outline</v-icon>
          <p class="text-body-1 text-grey-darken-1 mt-2">아직 게시글이 없습니다.</p>
          <p class="text-caption text-grey-darken-1">첫 번째 게시글을 작성해보세요!</p>
        </div>

        <!-- 게시글 목록 -->
        <v-card
          v-else
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          elevation="0"
          hover
          @click="goToArticle(post.id)"
          style="cursor: pointer;"
        >
          <v-card-text class="pa-4">
            <!-- 사용자 정보 -->
            <div class="d-flex align-center mb-3">
              <v-avatar size="40" class="mr-3" color="grey-lighten-2">
                <v-img v-if="post.avatar" :src="post.avatar" alt="프로필"></v-img>
                <v-icon v-else color="grey-darken-1">mdi-account</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="d-flex align-center">
                  <span class="text-subtitle-2 font-weight-bold mr-2">{{ post.author }}</span>
                  <span class="text-caption text-grey-darken-1">{{ post.role }} • {{ post.time }}</span>
                </div>
              </div>
            </div>

            <!-- 게시물 제목 -->
            <h3 class="text-body-1 font-weight-bold mb-3" style="line-height: 1.4;">{{ post.title }}</h3>

            <!-- 태그 (태그가 있을 때만 표시) -->
            <div v-if="post.tags && post.tags.length > 0" class="d-flex flex-wrap mb-3">
              <v-chip
                v-for="tag in post.tags"
                :key="tag"
                size="small"
                variant="flat"
                class="mr-1 mb-1"
                :color="getTagColor(tag)"
                style="border-radius: 16px;"
              >
                {{ tag }}
              </v-chip>
            </div>

            <!-- 상호작용 버튼 -->
            <div class="d-flex align-center">
              <v-btn variant="text" size="small" class="mr-4 pa-0" style="min-width: auto;">
                <v-icon size="18" class="mr-1">mdi-heart-outline</v-icon>
                <span class="text-caption">{{ post.likes }}</span>
              </v-btn>
              <v-btn variant="text" size="small" class="mr-4 pa-0" style="min-width: auto;">
                <v-icon size="18" class="mr-1">mdi-comment-outline</v-icon>
                <span class="text-caption">{{ post.comments }}</span>
              </v-btn>
              <v-btn variant="text" size="small" class="pa-0" style="min-width: auto;">
                <v-icon size="18" class="mr-1">mdi-eye-outline</v-icon>
                <span class="text-caption">{{ post.views }}</span>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- 하단 여백 -->
        <div style="height: 80px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HomePage',
  data() {
    return {
      searchQuery: '',
      filters: [
        { name: '전체', active: true },
        { name: 'JavaScript', active: false },
        { name: 'Python', active: false },
        { name: 'Java', active: false },
        { name: 'React', active: false },
        { name: 'Spring', active: false }
      ],
      posts: [],
      loading: false
    }
  },
  async mounted() {
    await this.fetchArticles();
  },
  methods: {
    async fetchArticles() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');

        const response = await axios.get('/articles', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'
        });

        console.log('게시글 목록 조회 성공:', response.data);

        // 백엔드 데이터를 프론트엔드 형식으로 변환
        this.posts = response.data.map(article => ({
          id: article.id,
          author: article.authorNickname,
          role: '개발자', // 백엔드에서 role 정보가 없으므로 기본값
          time: this.formatTime(new Date()), // 현재는 기본값, 나중에 createdAt 추가 시 수정
          title: article.title,
          tags: [], // 백엔드에서 태그 정보가 없으므로 빈 배열
          likes: article.likeCount || 0,
          comments: 0, // 백엔드에서 댓글 수 정보가 없으므로 기본값
          views: article.viewCount || 0,
          avatar: null
        }));

      } catch (error) {
        console.error('게시글 목록 조회 실패:', error);

        if (error.response?.status === 401) {
          localStorage.clear();
          this.$router.push('/login');
        } else {
          // 에러 시 빈 배열로 유지
          this.posts = [];
        }
      } finally {
        this.loading = false;
      }
    },
    formatTime(date) {
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) return '방금 전';
      if (diffHours < 24) return `${diffHours}시간 전`;

      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}일 전`;
    },
    selectFilter(index) {
      this.filters.forEach((filter, i) => {
        filter.active = i === index;
      });
    },
    goToArticle(articleId) {
      this.$router.push(`/articles/${articleId}`);
    },
    getTagColor(tag) {
      const colors = {
        '#React': 'blue-lighten-4',
        '#JavaScript': 'green-lighten-4',
        '#Frontend': 'purple-lighten-4',
        '#Spring': 'red-lighten-4',
        '#JPA': 'blue-lighten-4',
        '#Backend': 'green-lighten-4',
        '#Java': 'orange-lighten-4',
        '#알고리즘': 'purple-lighten-4',
        '#코딩테스트': 'yellow-lighten-4',
        '#면접준비': 'blue-lighten-4'
      };
      return colors[tag] || 'grey-lighten-4';
    }
  }
}
</script>

<style scoped>
/* 전체 래퍼 - 반응형 레이아웃 */
.home-wrapper {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 0 16px;
}

/* 메인 콘텐츠 - 반응형 너비 */
.home-content {
  width: 100%;
  max-width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 반응형 너비 설정 */
@media (min-width: 600px) {
  .home-content {
    max-width: 50%;
  }
}

@media (min-width: 960px) {
  .home-content {
    max-width: 33.333333%;
  }
}

@media (min-width: 1264px) {
  .home-content {
    max-width: 25%;
  }
}

/* 헤더 섹션 */
.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: white;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 검색 섹션 */
.search-section {
  padding: 16px;
  background-color: white;
}

.filter-buttons {
  display: flex;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-buttons::-webkit-scrollbar {
  display: none;
}

/* 게시물 섹션 */
.posts-section {
  flex: 1;
  overflow-y: auto;
  background-color: white;
  padding: 8px 16px 0 16px;
  -webkit-overflow-scrolling: touch;
}

/* 스크롤바 숨기기 */
.posts-section::-webkit-scrollbar {
  display: none;
}

.posts-section {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.post-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>