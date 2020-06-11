<template>
  <div class="login_div">
    <el-card class="box-card">
      <h3>大魔王外卖后台管理系统</h3>
      <el-input v-model="acc" placeholder="请输入用户名" class="pwd_input"></el-input>
      <el-input v-model="pwd" placeholder="请输入密码" type="password" class="pwd_input"></el-input>
      <el-button @click="clickLogin" type="primary" class="btn">登录</el-button>
    </el-card>
  </div>
</template>

<script>
import { API_LOGIN } from "../api/apis";
export default {
  data() {
    return {
      acc: "",
      pwd: "",
      isclick: true
    };
  },
  methods: {
    clickLogin() {
      // 防抖节流
      if (this.isclick == false) return;
      this.isclick = false;
      //  发送登录请求
      API_LOGIN(this.acc, this.pwd).then(res => {
        if (res.data.code == 0) {
          localStorage.id = res.data.id;
          // 登录成功把token写入浏览器中
          localStorage.token=res.data.token
          localStorage.acc=this.acc
          localStorage.role=res.data.role
          this.$message({
            showClose: true,
            message: "恭喜你,登录成功",
            type: "success"
          });
          setTimeout(() => {
            this.$router.push("/index/");
          }, 1500);
        } else {
          this.$message({
            showClose: true,
            message: "登录失败,用户名或密码错误",
            type: "error"
          });
        }
      });

      //  定时器
      setTimeout(() => {
        this.isclick = true;
      }, 3000);
      // this.$router.push("/index")
    }
  }
};
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}
.login_div {
  height: 100%;
  background-color: #304156;
  display: flex;
  justify-content: center;
  align-items: center;
  .box-card {
    text-align: center;
    width: 400px;
    height: 265px;
    .pwd_input {
      margin-top: 25px;
      width: 300px;
    }
    .btn {
      width: 300px;
      margin-top: 25px;
    }
  }
}
</style>