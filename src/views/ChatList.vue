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
                <v-btn icon variant="text" @click="startNewChat">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-card-title>

              <!-- 검색창 -->
              <v-card-text class="pa-4" style="background-color: white;">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="채팅방 또는 사용자 검색"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-card-text>

              <!-- 채팅방 목록 -->
              <v-list style="background-color: white;">
                <ChatListItem
                  v-for="chat in chatList"
                  :key="chat.id"
                  :chat="chat"
                  @click="goToChat(chat.id)"
                />
              </v-list>

              <!-- 하단 네비게이션 -->
              <BottomNavigation :activeTab="'chat'" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ChatListItem from '@/components/chat/ChatListItem.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

export default {
  name: 'ChatList',
  components: {
    ChatListItem,
    BottomNavigation
  },
  data() {
    return {
      searchQuery: '',
      stompClient: null,
      isConnected: false,
      chatList: [
        {
          id: '1',
          name: '김민수',
          lastMessage: 'React Hook 관련해서 질문이 있는데요...',
          time: '오후 2:30',
          unread: 1,
          isOnline: true
        },
        {
          id: '2',
          name: '박지영',
          lastMessage: 'Spring Boot 프로젝트 공유해드렸어요',
          time: '오후 1:15',
          unread: 0,
          isOnline: true
        },
        {
          id: '3',
          name: '이승호',
          lastMessage: '알고리즘 스터디 참여하실래요?',
          time: '오전 11:45',
          unread: 0,
          isOnline: false
        },
        {
          id: '4',
          name: '정우진',
          lastMessage: '코드 리뷰 감사했습니다!',
          time: '어제',
          unread: 0,
          isOnline: false
        },
        {
          id: '5',
          name: '최수연',
          lastMessage: 'Vue 3 프로젝트 진행 상황 공유드려요',
          time: '어제',
          unread: 1,
          isOnline: true
        },
        {
          id: '6',
          name: '강태현',
          lastMessage: 'Docker 설정 관련해서 도움 주셔서 감사해요',
          time: '2일 전',
          unread: 0,
          isOnline: false
        },
        {
          id: '7',
          name: '윤하영',
          lastMessage: 'TypeScript 관련 자료 공유해주세요',
          time: '3일 전',
          unread: 0,
          isOnline: false
        },
        {
          id: '8',
          name: '임동혁',
          lastMessage: '프로젝트 협업 제안드립니다',
          time: '1주 전',
          unread: 0,
          isOnline: false
        }
      ]
    }
  },

  async created() {
    this.connectWebSocket();
  },

  beforeRouteLeave(to, from, next) {
    // 채팅 관련 페이지가 아닌 곳으로 이동 시에만 연결 해제
    if (!to.path.startsWith('/chat/')) {
      console.log('채팅 영역을 벗어남. WebSocket 연결 해제')
      this.disconnectWebSocket()
      window.globalStompClient = null
    } else {
      // 채팅방으로 이동하는 경우 전역에 stompClient 저장
      window.globalStompClient = this.stompClient
    }
    next()
  },
  
  beforeUnmount() {
    this.disconnectWebSocket()
    window.globalStompClient = null
  },

  methods: {
    // WebSocket 연결
    connectWebSocket() {
      try {
        
        if (this.stompClient && this.stompClient.connected) {
          console.log("이미 WebSocket 연결됨");
          return;
        }
        const socket = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/ws`)
        this.stompClient = Stomp.over(socket);
        
        // 연결 설정
        this.stompClient.connect(
          (frame) => {
          console.log('WebSocket 연결 성공:', frame)
          this.isConnected = true
        },
        (error) => {
          console.error('WebSocket 연결 실패:', error)
          this.isConnected = false
        }      
        );
      } catch (error) {
        console.error('WebSocket 초기화 실패:', error);
      }
    },

    
    disconnectWebSocket() {
      if(this.stompClient && this.stompClient.connected){
        this.stompClient.disconnect()
        this.isConnected = false
        console.log("연결 해제")
      }
    },
    
    // 채팅방으로 이동
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
</style>