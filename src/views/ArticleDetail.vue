<template>
  <v-container fluid class="pa-0 article-detail-container" style="background-color: #f5f5f5;">
    <v-row justify="center" class="ma-0 fill-height">
      <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
        <v-card class="article-detail-card" flat>
          <!-- 상단 헤더 -->
          <v-card-title class="d-flex align-center pa-4 border-b" style="background-color: white;">
            <v-btn icon variant="text" @click="goBack" class="mr-2">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-menu v-model="showDropdown" location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn icon variant="text" v-bind="props">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list>
                <!-- 자신의 글일 때만 수정하기, 삭제하기 표시 -->
                <v-list-item v-if="isOwnPost" @click="handleEdit">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>수정하기</v-list-item-title>
                </v-list-item>
                <v-list-item v-if="isOwnPost" @click="handleDelete">
                  <template v-slot:prepend>
                    <v-icon color="red">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title>삭제하기</v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleCopyLink">
                  <template v-slot:prepend>
                    <v-icon color="blue">mdi-link</v-icon>
                  </template>
                  <v-list-item-title>링크 복사</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>

          <!-- 로딩 상태 -->
          <div v-if="loading" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p class="text-caption text-grey-darken-1 mt-2">게시글을 불러오는 중...</p>
          </div>

          <!-- 게시글 내용 -->
          <div v-else-if="article" class="article-content" style="background-color: white;">
            <!-- 게시물 제목 및 메타 정보 -->
            <div class="pa-4 border-b">
              <h1 class="text-h5 font-weight-bold text-grey-darken-4 mb-3">{{ article.title }}</h1>
              <div class="d-flex align-center text-caption text-grey-darken-1">
                <span>{{ formatTime(article.createdAt) }}</span>
                <span class="mx-2">•</span>
                <span>조회 {{ article.viewCount || 0 }}</span>
              </div>
            </div>



            <!-- 좋아요 및 북마크 버튼 -->
            <div class="d-flex align-center justify-space-between pa-4 border-b">
              <div class="d-flex align-center ga-6">
                <v-btn variant="text" size="small" @click="toggleLike" class="pa-0" style="min-width: auto;">
                  <v-icon :color="isLiked ? 'red' : 'grey'" class="mr-1">
                    {{ isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
                  </v-icon>
                  <span class="text-caption">{{ likeCount }}</span>
                </v-btn>
                <v-btn variant="text" size="small" class="pa-0" style="min-width: auto;">
                  <v-icon color="grey" class="mr-1">mdi-comment-outline</v-icon>
                  <span class="text-caption">{{ comments.length }}</span>
                </v-btn>
                <v-btn variant="text" size="small" @click="toggleBookmark" class="pa-0" style="min-width: auto;">
                  <v-icon :color="isBookmarked ? 'yellow-darken-2' : 'grey'">
                    {{ isBookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}
                  </v-icon>
                </v-btn>
              </div>
              <v-btn variant="text" size="small" class="pa-0" style="min-width: auto;">
                <v-icon color="grey">mdi-share</v-icon>
              </v-btn>
            </div>

            <!-- 게시물 본문 -->
            <div class="pa-4 border-b article-body" style="min-height: 200px;">
              <div class="text-body-1 text-grey-darken-2" style="line-height: 1.6; white-space: pre-wrap; font-size: 15px;">{{ article.content }}</div>
            </div>

            <!-- 작성자 정보 (댓글 위) -->
            <div class="d-flex align-center justify-space-between pa-4 border-b">
              <div class="d-flex align-center">
                <v-avatar size="48" class="mr-3" color="grey-lighten-2">
                  <v-icon color="grey-darken-1">mdi-account</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold">{{ article.authorNickname }}</h3>
                  <p class="text-caption text-grey-darken-1">개발자</p>
                </div>
              </div>
              <v-btn color="primary" size="small" style="border-radius: 20px;">
                팔로우
              </v-btn>
            </div>

            <!-- 댓글 섹션 -->
            <div class="pa-4">
              <h3 class="text-h6 font-weight-bold mb-4">댓글 {{ comments.length }}개</h3>

              <div v-for="comment in comments" :key="comment.id" class="mb-4 pb-4 border-b-sm">
                <div class="d-flex align-start">
                  <v-avatar size="32" class="mr-3" color="grey-lighten-2">
                    <v-icon size="16" color="grey-darken-1">mdi-account</v-icon>
                  </v-avatar>
                  <div class="flex-1-1">
                    <div class="d-flex align-center mb-1">
                      <h4 class="text-subtitle-2 font-weight-medium mr-2">{{ comment.author }}</h4>
                      <span class="text-caption text-grey-darken-1">{{ comment.time }}</span>
                    </div>
                    <p class="text-body-2 text-grey-darken-2 mb-2">{{ comment.content }}</p>
                    <div class="d-flex align-center ga-4">
                      <v-btn variant="text" size="small" @click="toggleCommentLike(comment.id)" class="pa-0" style="min-width: auto;">
                        <v-icon size="14" :color="comment.isLiked ? 'red' : 'grey'" class="mr-1">
                          {{ comment.isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
                        </v-icon>
                        <span class="text-caption">{{ comment.likes }}</span>
                      </v-btn>
                      <v-btn variant="text" size="small" class="pa-0 text-caption" style="min-width: auto;">
                        답글
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 하단 여백 -->
            <div style="height: 100px;"></div>
          </div>

          <!-- 에러 상태 -->
          <div v-else class="text-center pa-8">
            <v-icon size="48" color="grey-lighten-1">mdi-alert-circle-outline</v-icon>
            <p class="text-body-1 text-grey-darken-1 mt-2">게시글을 불러올 수 없습니다.</p>
            <v-btn color="primary" variant="text" @click="fetchArticle" class="mt-2">
              다시 시도
            </v-btn>
          </div>

          <!-- 댓글 입력창 (고정) -->
          <div class="comment-input-fixed">
            <div class="d-flex align-center pa-4" style="background-color: white; border-top: 1px solid #e0e0e0;">
              <v-avatar size="32" class="mr-3" color="grey-lighten-2">
                <v-icon size="16" color="grey-darken-1">mdi-account</v-icon>
              </v-avatar>
              <v-text-field
                v-model="newComment"
                placeholder="댓글을 입력하세요..."
                variant="outlined"
                density="compact"
                hide-details
                class="flex-1-1 mr-2"
                @keydown.enter="addComment"
              ></v-text-field>
              <v-btn
                color="primary"
                size="small"
                :disabled="!newComment.trim()"
                @click="addComment"
                style="border-radius: 20px;"
              >
                전송
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
  name: 'ArticleDetail',
  data() {
    return {
      article: null,
      loading: false,
      showDropdown: false,
      isLiked: false,
      isBookmarked: false,
      likeCount: 142,
      newComment: '',
      comments: [
        {
          id: 1,
          author: '박지영',
          content: '정말 유용한 정보네요! useEffect 의존성 배열 부분이 특히 도움이 되었습니다. 감사합니다!',
          time: '1시간 전',
          likes: 5,
          isLiked: false
        },
        {
          id: 2,
          author: '이준호',
          content: '실무에서 자주 겪는 문제들을 잘 정리해주셨네요. 메모리 누수 방지 부분은 꼭 기억해둬야겠어요.',
          time: '30분 전',
          likes: 3,
          isLiked: false
        },
        {
          id: 3,
          author: '김수진',
          content: '코드 예제가 이해하기 쉽게 잘 작성되어 있어서 좋네요. 다음 편도 기대됩니다!',
          time: '15분 전',
          likes: 2,
          isLiked: false
        }
      ]
    }
  },
  async mounted() {
    await this.fetchArticle();
  },
  watch: {
    // 라우트 변경을 감지해서 게시글 새로고침
    '$route'(to, from) {
      console.log('라우트 변경 감지:', to.params.articleId, from.params.articleId);
      // 같은 게시글 페이지로 돌아온 경우에도 새로고침
      if (to.name === 'ArticleDetail') {
        this.fetchArticle();
      }
    }
  },
  // 페이지가 다시 활성화될 때 새로고침
  activated() {
    this.fetchArticle();
  },
  computed: {
    isOwnPost() {
      // 현재 로그인한 사용자의 닉네임과 글 작성자 닉네임 비교
      const currentUserNickname = localStorage.getItem('nickname');
      return this.article && this.article.authorNickname === currentUserNickname;
    }
  },
  methods: {
    async fetchArticle() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        const articleId = this.$route.params.articleId;

        console.log('게시글 상세 조회 시작:', articleId);

        const response = await axios.get(`/articles/${articleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'
        });

        console.log('게시글 상세 조회 성공:', response.data);
        this.article = response.data;
        this.likeCount = response.data.likeCount || 0;

      } catch (error) {
        console.error('게시글 상세 조회 실패:', error);

        if (error.response?.status === 401) {
          localStorage.clear();
          this.$router.push('/login');
        } else if (error.response?.status === 404) {
          alert('존재하지 않는 게시글입니다.');
          this.goBack();
        } else {
          this.article = null;
        }
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.$router.push('/');
    },
    formatTime(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) return '방금 전';
      if (diffHours < 24) return `${diffHours}시간 전`;

      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}일 전`;

      return date.toLocaleDateString('ko-KR');
    },
    getTagColor(tag) {
      const colors = {
        '#React': 'blue-lighten-4',
        '#JavaScript': 'green-lighten-4',
        '#Frontend': 'purple-lighten-4',
        '#Spring': 'red-lighten-4',
        '#JPA': 'blue-lighten-4',
        '#Backend': 'green-lighten-4',
        '#Java': 'orange-lighten-4'
      };
      return colors[tag] || 'grey-lighten-4';
    },
    toggleLike() {
      this.isLiked = !this.isLiked;
      this.likeCount += this.isLiked ? 1 : -1;
    },
    toggleBookmark() {
      this.isBookmarked = !this.isBookmarked;
    },
    toggleCommentLike(commentId) {
      const comment = this.comments.find(c => c.id === commentId);
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likes += comment.isLiked ? 1 : -1;
      }
    },
    addComment() {
      if (this.newComment.trim()) {
        const newCommentObj = {
          id: this.comments.length + 1,
          author: '나',
          content: this.newComment.trim(),
          time: '방금 전',
          likes: 0,
          isLiked: false
        };
        this.comments.push(newCommentObj);
        this.newComment = '';
      }
    },
    handleEdit() {
      this.showDropdown = false;
      console.log('수정하기 클릭됨');
      console.log('게시글 ID:', this.article.id);

      // 수정 전용 페이지로 이동
      this.$router.push(`/articles/${this.article.id}/edit`);
    },
    async handleDelete() {
      this.showDropdown = false;

      if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.delete(`/articles/${this.article.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'
          });

          if (response.status === 200) {
            alert('게시글이 삭제되었습니다.');
            this.$router.push('/'); // 홈으로 이동
          }
        } catch (error) {
          console.error('게시글 삭제 실패:', error);
          if (error.response?.status === 401) {
            localStorage.clear();
            this.$router.push('/login');
          } else {
            alert('게시글 삭제에 실패했습니다.');
          }
        }
      }
    },
    handleCopyLink() {
      this.showDropdown = false;
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다.');
    }
  }
}
</script>

<style scoped>
/* ArticleDetail 컨테이너 */
.article-detail-container {
  height: 100vh;
  overflow: hidden;
}

.article-detail-card {
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

.border-b-sm {
  border-bottom: 1px solid #f0f0f0;
}

/* 게시글 내용 스크롤 */
.article-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 댓글 입력창 고정 */
.comment-input-fixed {
  position: sticky;
  bottom: 0;
  z-index: 10;
}

/* 스크롤바 숨기기 */
.article-content::-webkit-scrollbar {
  display: none;
}

.article-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>