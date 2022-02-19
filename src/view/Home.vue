<template>
  <div class="home">
    <header>
      <div class="header_left">放肆的聊天吧，没人知道嘿嘿</div>
      <div class="header_right">{{ timeState.nowTime }}</div>
    </header>
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

    <!-- 组件中心 -->
    <div class="component_list">
      <div class="list_item" v-for="item in navList" :key="item.id" @click="router.push({ name: item.routerName })">{{ item.name }}</div>
    </div>
  </div>
</template>
<script>
import { ref, onBeforeUnmount, reactive } from "vue"
import { useRouter } from "vue-router"
import moment from "moment"
export default {
  setup() {
    let message = ref(""); // 发送的信息
    const msgList = reactive([]); // 信息列表
    let socket = reactive({});
    const router = useRouter();
    const timeState = reactive({
      nowTime: "",
      timeId: null,
    });
    const getNowTime = () => {
      timeState.timeId = setInterval(() => {
        timeState.nowTime = moment().format("YYYY年MM月DD日 HH时mm分ss秒");
      }, 1000);
    };
    getNowTime();
    onBeforeUnmount(() => {
      clearInterval(timeState.timeId);
    })
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

    const navList = reactive([
      { name: "组件中心", id: "1", routerName: "componentCenter" },
      { name: "俞泳高的个人履历", id: "2", routerName: "resume" },
    ])
    return { timeState, sendMessage, message, msgList, socket, navList, router }
  }
}
</script>
<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url("../assets/chat_bg.jpg");
  background-size: 100% 100%;
  color: #fff;
  header {
    height: 60px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header_left {
      font-size: 26px;
      font-weight: 700;
    }
  }
  .room_box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 70%;
    transform: translate(-50%, -50%);
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
  .component_list {
    position: absolute;
    right: 20px;
    top: 50%;
    width: 200px;
    border: 1px solid #ccc;
    transform: translateY(-50%);
    .list_item {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
      &:nth-last-child(1) {
        border: none;
      }
      &:hover {
        background-color: #5fb878;
      }
    }
  }
}
</style>