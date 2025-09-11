<template>
  <v-app>
    <v-main>
      <!-- 홈 피드 화면 -->
      <v-container fluid class="pa-0" style="background-color: #f5f5f5;">
        <v-row justify="center" class="ma-0">
          <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
            <v-card class="fill-height" flat>
              <!-- 상단 헤더 -->
              <v-card-title class="d-flex align-center pa-4 border-b" style="background-color: white;">
                <h2 class="text-h6 font-weight-bold">DevConnect</h2>
                <v-spacer></v-spacer>
                <v-btn icon variant="text" size="small">
                  <v-icon size="20">mdi-chat-outline</v-icon>
                </v-btn>
                <v-btn icon variant="text" size="small">
                  <v-icon size="20">mdi-bell-outline</v-icon>
                </v-btn>
              </v-card-title>

              <!-- 검색창 -->
              <v-card-text class="pa-4" style="background-color: white;">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="태그나 사용자를 검색하세요..."
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  hide-details
                  class="mb-4"
                  style="border-radius: 8px;"
                ></v-text-field>

                <!-- 필터 옵션 -->
                <div class="d-flex overflow-x-auto pb-2">
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
              </v-card-text>

              <!-- 게시물 피드 -->
              <div class="pa-4" style="background-color: white;">
                <v-card
                  v-for="post in posts"
                  :key="post.id"
                  class="mb-4"
                  elevation="0"
                  style="border: 1px solid #e0e0e0; border-radius: 8px;"
                  hover
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

                    <!-- 태그 -->
                    <div class="d-flex flex-wrap mb-3">
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
              </div>

              <!-- 하단 네비게이션 -->
              <BottomNavigation :activeTab="activeTab" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import BottomNavigation from '@/components/common/BottomNavigation.vue'

export default {
  name: 'HomePage',
  components: {
    BottomNavigation
  },
  data() {
    return {
      searchQuery: '',
      activeTab: 'home',
      filters: [
        { name: '전체', active: true },
        { name: 'JavaScript', active: false },
        { name: 'Python', active: false },
        { name: 'Java', active: false },
        { name: 'React', active: false },
        { name: 'Spring', active: false }
      ],
      posts: [
        {
          id: 1,
          author: '김민수',
          role: '시니어 개발자',
          time: '2시간 전',
          title: 'React Hook 사용법 완벽 정리 - useEffect 심화편',
          tags: ['#React', '#JavaScript', '#Frontend'],
          likes: 142,
          comments: 23,
          views: 1205,
          avatar: null
        },
        {
          id: 2,
          author: '박지영',
          role: '백엔드 개발자',
          time: '4시간 전',
          title: 'Spring Boot JPA 연관관계 매핑 실전 가이드',
          tags: ['#Spring', '#JPA', '#Backend', '#Java'],
          likes: 89,
          comments: 15,
          views: 892,
          avatar: null
        },
        {
          id: 3,
          author: '이승호',
          role: '주니어 개발자',
          time: '6시간 전',
          title: '코딩테스트 알고리즘 문제 해결 전략 공유',
          tags: ['#알고리즘', '#코딩테스트', '#면접준비'],
          likes: 256,
          comments: 42,
          views: 2103,
          avatar: null
        }
      ]
    }
  },
  methods: {
    selectFilter(index) {
      this.filters.forEach((filter, i) => {
        filter.active = i === index;
      });
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
.fill-height {
  min-height: 100vh;
  padding-bottom: 80px; /* 하단 네비게이션 공간 확보 */
}

.border-b {
  border-bottom: 1px solid #e0e0e0;
}

.border-t {
  border-top: 1px solid #e0e0e0;
}

/* 스크롤바 숨기기 */
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}

.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>