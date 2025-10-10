<template>
  <v-app>
    <v-main>
      <!-- 채팅 목록 화면 -->
      <v-container fluid class="pa-0 chat-list-container" style="background-color: #f5f5f5;">
        <v-row justify="center" class="ma-0 fill-height">
          <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
            <v-card class="chat-list-card" flat>
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
              <v-list v-if="searchQuery" class="chat-list-scroll" style="background-color: white;">
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
              <v-list v-else class="chat-list-scroll" style="background-color: white;">
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
                      {{ chat.nickname || chat.email.split('@')[0] }}
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
export default {
  name: 'ChatList',
  data() {
    return {
      searchQuery: '',
      showUserSearchModal: false,
      showChatConfirmModal: false,
      userSearchQuery: '',
      searchResults: [],
      mainSearchResults: [], // 메인 화면 검색 결과
      selectedUser: null,
      chatList: [], // 채팅방 목록

      // 검색할 수 있는 전체 사용자 목록
      allUsers: [

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

  async created() {
    // 채팅방 목록 로드
    await this.loadChatList();
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
    // 채팅방 목록 로드
    async loadChatList() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/chat/room/list`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const rooms = await response.json();

          console.log('API 응답 원본 데이터:', rooms);

          // 각 room 객체의 구조 확인
          if (rooms.length > 0) {
            console.log('첫 번째 room 데이터:', rooms[0]);
            console.log('targetNickname:', rooms[0].targetNickname);
            console.log('targetEmail:', rooms[0].targetEmail);
            console.log('마지막 메시지 필드 확인:', {
              lastMessage: rooms[0].lastMessage,
              lastContent: rooms[0].lastContent,
              recentMessage: rooms[0].recentMessage
            });
          }

          // RoomListRes를 chatList 형태로 변환

          this.chatList = rooms.map((room, index) => {
            console.log(`Room ${index} 매핑:`, {
              roomId: room.roomId,
              targetNickname: room.targetNickname,
              targetEmail: room.targetEmail,
              '닉네임이 있나?': !!room.targetNickname,
              '표시될 이름': room.targetNickname || room.targetEmail.split('@')[0]
            });

            return {
              id: room.roomId,
              name: room.targetNickname || room.targetEmail.split('@')[0], // 닉네임 우선, 없으면 이메일 앞부분
              nickname: room.targetNickname, // 실제 닉네임 저장
              email: room.targetEmail, // 실제 이메일 저장
              lastMessage: room.lastMessage || room.lastContent || '메시지를 시작해보세요', // 실제 마지막 메시지 사용
              time: '', // 시간도 별도 API 필요
              unread: 0, // 읽지 않은 메시지 수도 별도 API 필요
              isOnline: false, // 온라인 상태도 별도 API 필요
              avatar: `https://via.placeholder.com/48/4CAF50/FFFFFF?text=${(room.targetNickname || room.targetEmail).charAt(0)}`
            };
          });

          // 마지막 메시지가 없는 방들에 대해 실제 마지막 메시지 로드
          await this.loadLastMessagesForRooms();

          console.log('채팅방 목록 로드 완료:', this.chatList);
        } else {
          console.error('채팅방 목록 API 호출 실패:', response.status);
        }
      } catch (error) {
        console.error('채팅방 목록 로드 실패:', error);
      }
    },

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

    // 각 채팅방의 마지막 메시지 로드
    async loadLastMessagesForRooms() {
      console.log('각 채팅방의 마지막 메시지 로드 중...');

      // 병렬로 모든 방의 마지막 메시지 조회
      const promises = this.chatList.map(async (chat, index) => {
        // 이미 마지막 메시지가 있고 기본 메시지가 아닌 경우 스킵
        if (chat.lastMessage && chat.lastMessage !== '메시지를 시작해보세요') {
          return;
        }

        try {
          const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/chat/history/${chat.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const messages = await response.json();
            if (messages && messages.length > 0) {
              // 마지막 메시지 가져오기
              const lastMsg = messages[messages.length - 1];
              this.chatList[index].lastMessage = lastMsg.content || lastMsg.message || '메시지를 시작해보세요';

              console.log(`Room ${chat.id} 마지막 메시지:`, this.chatList[index].lastMessage);
            }
          }
        } catch (error) {
          console.error(`Room ${chat.id} 마지막 메시지 로드 실패:`, error);
        }
      });

      // 모든 요청 완료까지 대기
      await Promise.all(promises);
      console.log('모든 채팅방의 마지막 메시지 로드 완료');
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

        // 실제 API로 새 채팅방 생성
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/chat/room/create?targetMemberId=${this.selectedUser.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const roomData = await response.json(); // CreateRoomRes 객체

          // 모달들 닫기
          this.closeChatConfirmModal();
          this.closeUserSearchModal();

          // 상대방 정보와 함께 채팅방으로 이동 (state로 전달)
          this.$router.push({
            name: 'ChatRoom',
            params: { roomId: roomData.roomId },
            state: {
              targetInfo: {
                nickname: roomData.targetNickname,
                email: roomData.targetEmail,
                targetId: roomData.targetId
              }
            }
          });
        } else {
          console.error('채팅방 생성 API 호출 실패:', response.status);
          throw new Error('채팅방 생성에 실패했습니다.');
        }
      } catch (error) {
        console.error('채팅방 생성 실패:', error);
        // 에러 처리 - 사용자에게 알림
        alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
      }
    },

    // 기존 채팅방으로 이동
    goToChat(chatId) {
      console.log(`채팅방 ${chatId}로 이동`);

      // 해당 채팅방 정보 찾기
      const chatRoom = this.chatList.find(chat => chat.id == chatId);

      if (chatRoom) {
        // 상대방 정보와 함께 채팅방으로 이동
        this.$router.push({
          name: 'ChatRoom',
          params: { roomId: chatId },
          state: {
            targetInfo: {
              nickname: chatRoom.nickname, // 실제 닉네임 사용
              email: chatRoom.email, // 실제 이메일 사용
              targetId: null
            }
          }
        });
      } else {
        // 채팅방 정보가 없으면 기본 이동
        this.$router.push({
          name: 'ChatRoom',
          params: { roomId: chatId }
        });
      }
    }
  }
}
</script>

<style scoped>
/* 채팅 리스트 컨테이너 - 화면 높이에 맞춤 */
.chat-list-container {
  height: 100vh;
  overflow: hidden;
}

.chat-list-card {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px; /* 하단 네비게이션 공간 확보 (60px로 정확히 맞춤) */
}

.fill-height {
  height: 100vh;
}

/* 채팅 목록 스크롤 영역 */
.chat-list-scroll {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 180px); /* 헤더와 검색창, 하단 네비게이션 제외 */
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