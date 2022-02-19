<template>
  <div class="user_register">
    <el-dialog
      v-model="props.registerShow"
      title="注册"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item label="账号" prop="userName">
          <el-input v-model="registerForm.userName" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <input type="file" @change="uploadFile">
          <img v-if="fileInfo.url" :src="fileInfo.url" alt="" style="width: 100px">
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">关闭</el-button>
          <el-button type="primary" @click="userRegister">注册</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, ref } from "vue"
import { ElMessage } from 'element-plus'
import axios from "../axios"
export default {
  props: {
    registerShow: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  setup(props, context) {
    const handleClose = () => {
      context.emit("update:registerShow")
    }
    const registerForm = reactive({
      userName: "",
      password: "",
      userImg: null
    });
    const registerRules = reactive({
      userName: [ { required: true, message: "该项必填", trigger: "blur" } ],
      password: [ { required: true, message: "该项必填", trigger: "blur" } ]
    })
    const registerFormRef = ref(null);
    const userRegister = () => {
      registerFormRef.value.validate((valid) => {
        if (valid) {
          const fd = new FormData();
          fd.append("userName", registerForm.userName);
          fd.append("password", registerForm.password);
          fd.append("userImg", fileInfo.file);
          const url = "/users/addNewUser";
          axios.post(url, fd).then(res => {
            const result = res.data;
            if(result.ok === "1") {
              ElMessage.success({ message: "登录成功", duration: 1000 });
              handleClose();
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

    const fileInfo = reactive({
      file: null,
      url: ""
    })
    const uploadFile = (e) => {
      fileInfo.file = e.target.files[0];
      fileInfo.url = window.URL.createObjectURL(fileInfo.file);
    }

    return { props, handleClose, registerForm, registerRules, registerFormRef, userRegister, uploadFile, fileInfo }
  }
}
</script>
<style lang="scss" scoped>

</style>