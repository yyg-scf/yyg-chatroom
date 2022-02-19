<template>
  <div class="home">
    <div class="room_box">
      <div class="show_message">
        <div v-for="(item,index) in msgList" :key="index" :class="item.type">
          <div class="my_msg_content" v-if="item.type === 'userSelf'">
            <img :src="item.imgPath" alt="" style="width: 50px; height: 70px">
            <div class="content">
              <div>{{ item.nickname }}</div>
              <div style="color: #5fb878">{{ item.message }}</div>
            </div>
          </div>
          <div class="other_msg_content" v-else>
            <div>
              <div>{{ item.nickname }}</div>
              <div style="color: #ccc">{{ item.message }}</div>
            </div>
            <img :src="item.imgPath" alt="" style="width: 50px">
          </div>
        </div>
      </div>
      <div class="send_message">
        <el-input v-model="message" :rows="2" type="textarea" placeholder="说点什么呗" />
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive } from "vue"
export default {
  setup() {
    let message = ref(""); // 发送的信息
    const msgList = reactive([]); // 信息列表
    let socket = reactive({});
    const loginId = window.sessionStorage.getItem("loginId");

    const websocket = () => {
      socket = new WebSocket(`ws://172.16.90.226:3030?loginId=${loginId}`);
      socket.onopen = () => { 
        console.log("已建立连接");
      }
      socket.onmessage = (data) => {
        let value = JSON.parse(data.data);
        msgList.push(value)
      }
    }
    websocket();

    const sendMessage = () => {
      if(socket.readyState === WebSocket.OPEN && message) {
        socket.send(message.value);
        message.value = "";
      }
    }
    return { sendMessage, message, msgList, socket }
  }
}
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url("../assets/chat_bg.jpg");
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .room_box {
    width: 50%;
    height: 70%;
    border: 1px solid #ccc;
    .show_message {
      height: 66%;
      background-color: rgba($color: #ccc, $alpha: .5);
      border-bottom: 1px solid #ccc;
      padding: 4px 10px;
      box-sizing: border-box;
      overflow: auto;
      .userSelf, .user {
        width: 100%;
        display: flex;
        .my_msg_content {
          display: flex;
          .content {
            text-align: left;
            max-width: 400px;
            word-wrap: break-word;
          }
        }
        .other_msg_content {
          display: flex;
          justify-content: flex-end;
        }
      }
      .user {
        justify-content: flex-end;
      }
    }
    .send_message {
      height: calc(34% - 1px);
      :deep().el-textarea {
        height: calc(100% - 14px);
        .el-textarea__inner {
          height: 100%;
        }
      }
      :deep().el-button {
        width: 100%;
      }
    }
  }
}
</style>