<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0" style="background-color: #f5f5f5;">
        <v-row justify="center" class="ma-0">
          <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
            <v-card class="fill-height" flat>
              
              <!-- 상단 헤더 -->
              <v-card-title class="d-flex align-center pa-4 border-b" style="background-color: white;">
                <div @click="goBack" class="back-button">
                  &lt;
                </div>
                <v-avatar size="40" class="mr-3" color="grey-lighten-2">
                  <v-img v-if="chatInfo.avatar" :src="chatInfo.avatar" alt="프로필">
                    <template v-slot:placeholder>
                      <v-icon>mdi-account</v-icon>
                    </template>
                  </v-img>
                  <v-icon v-else color="grey-darken-1">mdi-account</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <!-- 닉네임이 있으면 닉네임, 없으면 이메일의 @ 앞부분을 닉네임으로 -->
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ displayName }}
                  </div>
                  <!-- 닉네임이 있을 때만 이메일을 아래에 표시 -->
                  <div class="text-caption text-grey-darken-2" v-if="chatInfo.nickname && chatInfo.nickname.trim() && chatInfo.email">
                    {{ chatInfo.email }}
                  </div>
                </div>
                <v-btn icon variant="text" size="small">
                  <v-icon>mdi-phone</v-icon>
                </v-btn>
                <v-btn icon variant="text" size="small">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-card-title>

              <!-- 메시지 목록 -->
              <div class="messages-container" ref="messagesContainer">
                <div
                  v-for="(message, index) in messages"
                  :key="index"
                  class="message-wrapper"
                  :class="{ 'my-message': message.senderEmail === currentUserId }"
                >
                  <div class="message-bubble" :class="message.senderEmail === currentUserId ? 'sent' : 'received'">
                    <div class="message-content">{{ message.content || message.message }}</div>
                    <div class="message-time">{{ formatMessageTime(message.timestamp) }}</div>
                  </div>
                </div>
              </div>

              <!-- 메시지 입력 -->
              <div class="message-input-container">
                <v-card flat class="border-t">
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center">
                      <v-btn icon variant="text" size="small" class="mr-2">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-text-field
                        v-model="newMessage"
                        placeholder="메시지를 입력하세요..."
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="flex-grow-1"
                        @keyup.enter="sendMessage"
                        :disabled="!stompClient || !stompClient.connected"
                      ></v-text-field>
                      <v-btn 
                        icon 
                        variant="text" 
                        size="small" 
                        class="ml-2" 
                        @click="sendMessage"
                        :disabled="!newMessage.trim() || !stompClient || !stompClient.connected"
                        color="primary"
                      >
                        <v-icon>mdi-send</v-icon>
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
// import axios from 'axios'

export default {
  name: 'ChatRoom',
  data() {
    return {
      ws: null,
      messages: [],
      newMessage: "",
      stompClient: null,
      token: "",
      senderEmail: null,
      roomId: null,
      currentUserId: localStorage.getItem('email'),
      chatInfo: {
        nickname: '',
        email: '',
        avatar: null
      }
    }
  },

  computed: {
    displayName() {
      // 1. 닉네임이 있으면 닉네임 사용
      if (this.chatInfo.nickname && this.chatInfo.nickname.trim()) {
        return this.chatInfo.nickname;
      }

      // 2. 닉네임이 없고 이메일이 있으면 이메일의 @ 앞부분 사용
      if (this.chatInfo.email && this.chatInfo.email.trim()) {
        return this.chatInfo.email.split('@')[0];
      }

      // 3. 둘 다 없으면 기본값
      return '사용자';
    }
  },

  async created() {
    this.senderEmail = localStorage.getItem("email")
    this.roomId = this.$route.params.roomId

    // 채팅방 정보 로드
    await this.loadChatInfo()

    // 채팅 히스토리 로드
    await this.loadChatHistory()

    // WebSocket 연결
    this.connectWebsocket()
  },
  
  beforeRouteLeave(to, from, next) {
    this.disconnectWebSocket()
    next()
  },
  
  beforeUnmount() {
    this.disconnectWebSocket()
  },
  
  methods: {
    // 채팅방 정보 로드
    async loadChatInfo() {
      try {
        // router state에서 상대방 정보 가져오기 (URL에 노출되지 않음)
        const targetInfo = history.state?.targetInfo;

        console.log('전달받은 상대방 정보:', targetInfo); // 디버깅용

        if (targetInfo) {
          // state로 전달받은 정보 사용
          this.chatInfo = {
            nickname: targetInfo.nickname,
            email: targetInfo.email,
            avatar: null
          };
        } else {
          // state 정보가 없으면 API로 채팅방 정보 조회
          await this.loadChatInfoFromAPI();
        }

        console.log('채팅방 정보 로드:', this.chatInfo);
      } catch (error) {
        console.error('채팅방 정보 로드 실패:', error);
      }
    },

    // API로 채팅방 정보 조회 (fallback)
    async loadChatInfoFromAPI() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/chat/room/${this.roomId}/info`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const roomInfo = await response.json();
          this.chatInfo = {
            nickname: roomInfo.otherMemberNickname,
            email: roomInfo.otherMemberEmail,
            avatar: roomInfo.otherMemberAvatar
          };
        } else {
          // API 실패 시 기본값
          this.chatInfo = {
            nickname: '채팅 상대방',
            email: 'user@example.com',
            avatar: null
          };
        }
      } catch (error) {
        console.error('API로 채팅방 정보 조회 실패:', error);
        this.chatInfo = {
          nickname: '채팅 상대방',
          email: 'user@example.com',
          avatar: null
        };
      }
    },

    // 채팅 히스토리 로드
    async loadChatHistory() {
      try {
        console.log(`채팅방 ${this.roomId} 히스토리 로드 중...`);

        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/chat/history/${this.roomId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const messageHistory = await response.json();
          console.log('로드된 채팅 히스토리:', messageHistory);

          // MessageDto 배열을 messages 배열로 설정
          this.messages = messageHistory;

          // 히스토리 로드 후 스크롤을 맨 아래로
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        } else {
          console.error('채팅 히스토리 로드 실패:', response.status);
          // 히스토리 로드 실패해도 빈 배열로 초기화
          this.messages = [];
        }
      } catch (error) {
        console.error('채팅 히스토리 로드 에러:', error);
        this.messages = [];
      }
    },

    connectWebsocket() {
      if (this.stompClient && this.stompClient.connected) return
      
      // sockjs는 websocket을 내장한 향상된 js 라이브러리. http엔드포인트 사용.
      const sockJs = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/ws`)
      this.stompClient = Stomp.over(sockJs)
      this.token = localStorage.getItem("token")
      
      this.stompClient.connect({
        Authorization: `Bearer ${this.token}`
      },
      () => {
        console.log('WebSocket 연결 성공')
        this.stompClient.subscribe(`/sub/${this.roomId}`, (message) => {
          const parseMessage = JSON.parse(message.body)
          console.log('받은 메시지:', parseMessage)
          this.messages.push(parseMessage)
          this.scrollToBottom()
        }, { Authorization: `Bearer ${this.token}` })
      },
      (error) => {
        console.error('WebSocket 연결 실패:', error)
      })
    },
    
    sendMessage() {
      if (this.newMessage.trim() === "") return

      const message = {
        roomId: this.roomId,
        content: this.newMessage,
        senderEmail: this.senderEmail
      }

      console.log('전송할 메시지:', message)

      this.stompClient.send(`/pub/${this.roomId}`, JSON.stringify(message))
      this.newMessage = ""
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        const messagesContainer = this.$refs.messagesContainer
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight
        }
      })
    },
    
    async disconnectWebSocket() {
      // await axios.post(`${process.env.VUE_APP_API_BASE_URL}/chat/room/${this.roomId}/read`)
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.unsubscribe(`/sub/${this.roomId}`)
        console.log("구독취소")
        this.stompClient.disconnect()
      }
    },
    
    formatMessageTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    },
    
    // 뒤로가기
    goBack() {
      // WebSocket 연결 해제
      this.disconnectWebSocket();

      // 채팅 목록으로 이동 (더 안전한 방법)
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        // 히스토리가 없으면 채팅 목록으로
        this.$router.push('/chat');
      }
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.border-b {
  border-bottom: 1px solid #e0e0e0;
}

.border-t {
  border-top: 1px solid #e0e0e0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px; /* 입력창 공간 확보 */
  min-height: calc(100vh - 200px);
  background-color: white;
}

.message-wrapper {
  margin-bottom: 12px;
  display: flex;
}

.message-wrapper.my-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message-bubble.sent {
  background-color: #1976d2;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble.received {
  background-color: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
  border: 1px solid #e0e0e0;
}

.message-content {
  line-height: 1.4;
  margin-bottom: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
}

.message-bubble.received .message-time {
  text-align: left;
}

.message-input-container {
  background-color: white;
  position: sticky;
  bottom: 0; /* 맨 하단으로 이동 */
  z-index: 10;
}

/* 뒤로가기 버튼 (테두리 완전 제거) */
.back-button {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  margin-right: 12px;
  padding: 4px;
  user-select: none;
}

.back-button:hover {
  color: #1976d2;
}
</style>