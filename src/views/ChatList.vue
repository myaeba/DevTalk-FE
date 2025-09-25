<template>
  <v-app>
    <v-main>
      <!-- 채팅 목록 화면 -->
      <v-container fluid class="pa-0" style="background-color: #f5f5f5;">
        <v-row justify="center" class="ma-0">
          <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
            <v-card class="fill-height" flat>
              <!-- 상단 헤더 -->
              <v-card-title class="d-flex align-center pa-4 border-b" style="background-color: white;">
                <h2 class="text-h6 font-weight-bold">채팅</h2>
                <v-spacer></v-spacer>
                <v-btn icon variant="text" @click="openUserSearch" style="color: black;">
                  <v-icon size="24" color="black">mdi-plus</v-icon>
                </v-btn>
              </v-card-title>

              <!-- 검색창 -->
              <v-card-text class="pa-4" style="background-color: white;">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="닉네임으로 검색"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  hide-details
                  clearable
                ></v-text-field>
              </v-card-text>

              <!-- 검색 중일 때: 사용자 검색 결과만 표시 -->
              <v-list v-if="searchQuery" style="background-color: white;">
                <v-list-item
                  v-for="user in mainSearchResults"
                  :key="user.id"
                  @click="openChatConfirmModal(user)"
                  class="cursor-pointer"
                >
                  <template v-slot:prepend>
                    <v-avatar size="48">
                      <v-img :src="user.avatar" :alt="user.nickname + ' 프로필'">
                        <template v-slot:placeholder>
                          <v-icon>mdi-account</v-icon>
                        </template>
                      </v-img>
                    </v-avatar>
                  </template>

                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium">
                      {{ user.nickname }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ user.email }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>

                <!-- 검색 결과가 없을 때 -->
                <v-list-item v-if="mainSearchResults.length === 0">
                  <v-list-item-content>
                    <v-list-item-title class="text-center text-grey">
                      검색 결과가 없습니다
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <!-- 검색하지 않을 때: 기존 채팅방 목록 표시 -->
              <v-list v-else style="background-color: white;">
                <v-list-item
                  v-for="chat in chatList"
                  :key="chat.id"
                  @click="goToChat(chat.id)"
                  class="cursor-pointer"
                >
                  <template v-slot:prepend>
                    <v-avatar size="48">
                      <v-img :src="chat.avatar" :alt="chat.name + ' 프로필'">
                        <template v-slot:placeholder>
                          <v-icon>mdi-account</v-icon>
                        </template>
                      </v-img>
                      <!-- 온라인 상태 표시 -->
                      <div
                        :class="chat.isOnline ? 'bg-green-500' : 'bg-grey'"
                        class="online-status"
                      ></div>
                    </v-avatar>
                  </template>

                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium">
                      {{ chat.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-truncate">
                      {{ chat.lastMessage }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <template v-slot:append>
                    <div class="text-right">
                      <div class="text-caption text-grey">{{ chat.time }}</div>
                      <v-chip
                        v-if="chat.unread > 0"
                        size="x-small"
                        color="red"
                        text-color="white"
                        class="mt-1"
                      >
                        {{ chat.unread }}
                      </v-chip>
                    </div>
                  </template>
                </v-list-item>
              </v-list>

              <!-- 하단 네비게이션 -->
              <BottomNavigation :activeTab="'chat'" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- 사용자 검색 모달 -->
      <v-dialog v-model="showUserSearchModal" max-width="500px" persistent>
        <v-card>
          <v-card-title class="d-flex align-center pa-4">
            <span class="text-h6">채팅</span>
            <v-spacer></v-spacer>
            <v-btn icon variant="text" @click="closeUserSearchModal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- 사용자 검색 입력 -->
            <v-text-field
              v-model="userSearchQuery"
              placeholder="닉네임으로 검색"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              hide-details
              clearable
              autofocus
            ></v-text-field>

            <!-- 검색 결과 -->
            <div class="mt-4" v-if="userSearchQuery">
              <div v-if="searchResults.length === 0" class="text-center text-grey pa-4">
                검색 결과가 없습니다
              </div>
              <v-list v-else density="compact">
                <v-list-item
                  v-for="user in searchResults"
                  :key="user.id"
                  @click="openChatConfirmModal(user)"
                  class="cursor-pointer"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40">
                      <v-img :src="user.avatar" :alt="user.name + ' 프로필'">
                        <template v-slot:placeholder>
                          <v-icon>mdi-account</v-icon>
                        </template>
                      </v-img>
                    </v-avatar>
                  </template>

                  <v-list-item-content>
                    <v-list-item-title>{{ user.nickname }}</v-list-item-title>
                    <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- 채팅 시작 확인 모달 -->
      <v-dialog v-model="showChatConfirmModal" max-width="400px" persistent>
        <v-card>
          <v-card-text class="text-center pa-6">
            <v-avatar size="64" class="mb-4">
              <v-img :src="selectedUser?.avatar" :alt="selectedUser?.name + ' 프로필'">
                <template v-slot:placeholder>
                  <v-icon size="32">mdi-account</v-icon>
                </template>
              </v-img>
            </v-avatar>

            <h3 class="text-h6 mb-2">{{ selectedUser?.nickname }}</h3>
            <p class="text-body-2 text-grey mb-4">{{ selectedUser?.email }}</p>
            <p class="text-body-1 mb-6">{{ selectedUser?.nickname }}님과 채팅을 하시겠습니까?</p>
          </v-card-text>

          <v-card-actions class="justify-center pb-4">
            <v-btn
              variant="outlined"
              @click="closeChatConfirmModal"
              class="mr-2"
            >
              취소
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              @click="createNewChatRoom"
            >
              확인
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import BottomNavigation from '@/components/common/BottomNavigation.vue'

export default {
  name: 'ChatList',
  components: {
    BottomNavigation
  },
  data() {
    return {
      searchQuery: '',
      showUserSearchModal: false,
      showChatConfirmModal: false,
      userSearchQuery: '',
      searchResults: [],
      mainSearchResults: [], // 메인 화면 검색 결과
      selectedUser: null,

      // 메시지를 주고받은 채팅방 목록
      chatList: [
        {
          id: '1',
          name: '김민수',
          lastMessage: 'React Hook 관련해서 질문이 있는데요...',
          time: '오후 2:30',
          unread: 1,
          isOnline: true,
          avatar: 'https://via.placeholder.com/48/4CAF50/FFFFFF?text=김'
        },
        {
          id: '2',
          name: '박지영',
          lastMessage: 'Spring Boot 프로젝트 공유해드렸어요',
          time: '오후 1:15',
          unread: 0,
          isOnline: true,
          avatar: 'https://via.placeholder.com/48/2196F3/FFFFFF?text=박'
        },
        {
          id: '3',
          name: '이승호',
          lastMessage: '알고리즘 스터디 참여하실래요?',
          time: '오전 11:45',
          unread: 0,
          isOnline: false,
          avatar: 'https://via.placeholder.com/48/FF9800/FFFFFF?text=이'
        },
        {
          id: '4',
          name: '김민혁',
          lastMessage: '코드 리뷰 감사했습니다!',
          time: '어제',
          unread: 0,
          isOnline: false,
          avatar: 'https://via.placeholder.com/48/9C27B0/FFFFFF?text=정'
        }
      ],

      // 검색할 수 있는 전체 사용자 목록
      allUsers: [
        {
          id: 'user1',
          name: '김민수',
          nickname: '민수',
          avatar: 'https://via.placeholder.com/48/4CAF50/FFFFFF?text=김'
        },
        {
          id: 'user2',
          name: '김민혁',
          nickname: '민혁',
          avatar: 'https://via.placeholder.com/48/FF5722/FFFFFF?text=김'
        },
        {
          id: 'user3',
          name: '김민중',
          nickname: '민중',
          avatar: 'https://via.placeholder.com/48/607D8B/FFFFFF?text=김'
        },
        {
          id: 'user4',
          name: '최수연',
          nickname: '수연',
          avatar: 'https://via.placeholder.com/48/E91E63/FFFFFF?text=최'
        },
        {
          id: 'user5',
          name: '김민영',
          nickname: '태현',
          avatar: 'https://via.placeholder.com/48/795548/FFFFFF?text=강'
        },
        {
          id: 'user6',
          name: '윤하영',
          nickname: '하영',
          avatar: 'https://via.placeholder.com/48/3F51B5/FFFFFF?text=윤'
        },
        {
          id: 'user7',
          name: '김민혁',
          nickname: '동혁',
          avatar: 'https://via.placeholder.com/48/009688/FFFFFF?text=임'
        }
      ]
    }
  },


  watch: {
    // 메인 화면 검색어 변경 시 실시간 검색
    searchQuery() {
      this.searchMainUsers();
    },

    // 모달 내 사용자 검색어 변경 시 실시간 검색
    userSearchQuery() {
      this.searchUsers();
    }
  },

  methods: {
    // 메인 화면에서 사용자 검색
    async searchMainUsers() {
      if (!this.searchQuery.trim()) {
        this.mainSearchResults = [];
        return;
      }

      try {
        // 실제 API 연동
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/member/search/${encodeURIComponent(this.searchQuery)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          this.mainSearchResults = await response.json();
        } else {
          console.error('메인 검색 API 호출 실패:', response.status);
          this.mainSearchResults = [];
        }
      } catch (error) {
        console.error('메인 사용자 검색 실패:', error);
        // 에러 시 임시 데이터로 폴백
        const query = this.searchQuery.toLowerCase();
        this.mainSearchResults = this.allUsers.filter(user =>
          user.name.toLowerCase().includes(query) ||
          user.nickname.toLowerCase().includes(query)
        );
      }
    },

    // + 버튼 클릭 시 사용자 검색 모달 열기
    openUserSearch() {
      this.showUserSearchModal = true;
      this.userSearchQuery = '';
      this.searchResults = [];
    },

    // 사용자 검색 모달 닫기
    closeUserSearchModal() {
      this.showUserSearchModal = false;
      this.userSearchQuery = '';
      this.searchResults = [];
    },

    // 닉네임으로 사용자 검색
    async searchUsers() {
      if (!this.userSearchQuery.trim()) {
        this.searchResults = [];
        return;
      }

      try {
        // 실제 API 연동
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/member/search/${encodeURIComponent(this.userSearchQuery)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          this.searchResults = await response.json();
        } else {
          console.error('검색 API 호출 실패:', response.status);
          this.searchResults = [];
        }
      } catch (error) {
        console.error('사용자 검색 실패:', error);
        // 에러 시 임시 데이터로 폴백
        const query = this.userSearchQuery.toLowerCase();
        this.searchResults = this.allUsers.filter(user =>
          user.name.toLowerCase().includes(query) ||
          user.nickname.toLowerCase().includes(query)
        );
      }
    },

    // 검색 결과에서 사용자 선택 시 확인 모달 열기
    openChatConfirmModal(user) {
      this.selectedUser = user;
      this.showChatConfirmModal = true;
    },

    // 채팅 확인 모달 닫기
    closeChatConfirmModal() {
      this.showChatConfirmModal = false;
      this.selectedUser = null;
    },

    // 새 채팅방 생성 및 이동
    async createNewChatRoom() {
      try {
        if (!this.selectedUser) return;

        console.log('새 채팅방 생성:', this.selectedUser.nickname);

        // TODO: 실제 API로 새 채팅방 생성
        // const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/chat/rooms`, {
        //   targetMemberId: this.selectedUser.id
        // }, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });
        // const newRoomId = response.data.roomId;

        // 임시로 랜덤 채팅방 ID 생성
        const newRoomId = Math.random().toString(36).substring(2, 11);

        // 모달들 닫기
        this.closeChatConfirmModal();
        this.closeUserSearchModal();

        // 새 채팅방으로 이동
        this.$router.push({
          name: 'ChatRoom',
          params: { roomId: newRoomId }
        });
      } catch (error) {
        console.error('채팅방 생성 실패:', error);
        // 에러 처리 (토스트 메시지 등)
      }
    },

    // 기존 채팅방으로 이동
    goToChat(chatId) {
      console.log(`채팅방 ${chatId}로 이동`);
      this.$router.push({
        name: 'ChatRoom',
        params: { roomId: chatId }
      });
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

.cursor-pointer {
  cursor: pointer;
}

/* 온라인 상태 표시 */
.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border: 2px solid white;
  border-radius: 50%;
}

/* 배경색 헬퍼 클래스 */
.bg-green-500 {
  background-color: #4CAF50;
}

.bg-grey {
  background-color: #9E9E9E;
}

/* 텍스트 스타일 */
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>