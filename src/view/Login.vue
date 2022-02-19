<template>
  <div class="login">
    <header>
      <div class="header_left">欢迎来到俞泳高的聊天室</div>
      <div class="header_right">{{ timeState.nowTime }}</div>
    </header>
    <div class="login_box">
      <div class="box_header">登 录</div>
      <div class="box_form">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-width="80px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="账号" prop="userName">
            <el-input v-model="loginForm.userName" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="box_btn">
        <el-button type="primary" @click="userLogin">登录</el-button>
        <el-button type="info" @click="registerShow = true">注册</el-button>
      </div>
    </div>
    <user-register v-if="registerShow" :registerShow="registerShow" @update:registerShow="registerShow = false"></user-register>
  </div>
</template>
<script>
import { reactive, onBeforeUnmount, ref } from "vue"
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'
import moment from "moment"
import userRegister from "../components/userRegister.vue"
import axios from "../axios"
export default {
  components: { userRegister },
  setup() {
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

    const loginForm = reactive({
      userName: "",
      password: ""
    });
    const loginRules = reactive({
      userName: [ { required: true, message: "该项必填", trigger: "blur" } ],
      password: [ { required: true, message: "该项必填", trigger: "blur" } ]
    })
    const loginFormRef = ref(null);
    const userLogin = () => {
      loginFormRef.value?.validate((valid) => {
        if (valid) {
          const url = "/users/login";
          const fd = new FormData();
          fd.append("userName", loginForm.userName);
          fd.append("password", loginForm.password);
          axios.post(url, fd).then(res => {
            const result = res.data;
            if(result.ok === "1") {
              window.sessionStorage.setItem("loginId", result.message);
              ElMessage.success({ message: "登录成功", duration: 1000 });
              router.push({ name: "home" });
            } else {
              ElMessage.error({ message: "登录失败", duration: 1000 });
            }
          })
        } else {
          ElMessage.error({ message: "请填写完整后在登录", duration: 1000 });
          return false
        }
      });
    }
    
    const registerShow = ref(false);
    return { timeState, router, loginForm, loginRules, loginFormRef, userLogin, registerShow }
  }
}
</script>
<style lang="scss" scoped>
.login {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url("../assets/login.jpg");
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
  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30%;
    height: 30%;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 0 20px;
    box-sizing: border-box;
    .box_header {
      height: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 26px;
    }
    .box_form {
      height: 60%;
      :deep().el-form {
        height: 100%;
        .el-form-item {
          height: 30%;
          .el-form-item__label {
            color: #fff;
            font-size: 16px;
            display: flex;
            align-items: center;
          }
          .el-form-item__content {
            display: flex;
            justify-content: center;
            .el-input__inner {
              background-color: transparent;
            }
          }
        }
      }
    }
    .box_btn {
      height: 10%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      :deep().el-button {
        width: 45%;
      }
    }
  }
}
</style>