<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0" style="background-color: #f5f5f5;">
        <v-row justify="center" class="ma-0">
          <v-col cols="12" sm="6" md="4" lg="3" class="pa-0">
            <v-card class="fill-height" flat>
              
              <!-- 상단 헤더 -->
              <v-card-title class="d-flex align-center pa-4 border-b" style="background-color: white;">
                <v-btn icon variant="text" size="small" @click="goBack" class="mr-2">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-avatar size="36" class="mr-3" color="grey-lighten-2">
                  <v-img v-if="chatInfo.avatar" :src="chatInfo.avatar" alt="프로필"></v-img>
                  <v-icon v-else color="grey-darken-1">mdi-account</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <h3 class="text-subtitle-1 font-weight-bold">{{ chatInfo.name }}</h3>
                  <span class="text-caption text-grey-darken-1" v-if="chatInfo.isOnline">온라인</span>
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
                    <div class="message-content">{{ message.message }}</div>
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
      messages: [],
      newMessage: "",
      stompClient: null,
      token: "",
      senderEmail: null,
      roomId: null,
      currentUserId: localStorage.getItem('email'),
      chatInfo: {
        name: '김민수',
        isOnline: true,
        avatar: null
      }
    }
  },
  async created() {
    this.senderEmail = localStorage.getItem("email")
    this.roomId = this.$route.params.roomId
    
    // 채팅 히스토리 로드
    // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/chat/history/${this.roomId}`)
    // this.messages = response.data
    
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
        senderEmail: this.senderEmail,
        message: this.newMessage
      }
      
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
    
    goBack() {
      this.$router.go(-1)
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
  bottom: 0;
  z-index: 10;
}
</style>