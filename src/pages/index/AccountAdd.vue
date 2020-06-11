<template>
  <div class="accadd">
    <p>添加账号</p>
    <el-form :model="user" ref="user" label-width="100px">
      <el-form-item label="账号" style="margin-top: 15px;">
        <el-input v-model="user.acc" clearable class="acc"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="user.pwd" show-password class="pwd"></el-input>
      </el-form-item>
      <el-form-item label="用户组">
        <el-select v-model="value" placeholder="请选择用户组">
          <el-option
            v-for="item in user.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">添加</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { API_USER_ADD } from "@/api/apis";
export default {
  data() {
    return {
      user: {
        acc: "",
        pwd: "",
        options: [
          {
            value: "普通管理员",
            label: "普通管理员"
          },
          {
            value: "超级管理员",
            label: "超级管理员"
          }
        ]
      },
      value: "",
      isclick: true
    };
  },
  methods: {
    resetForm() {
      this.user.acc = "";
      this.user.pwd = ""
    },
    submitForm() {
      if (this.isclick == false) return;
      this.isclick = false;

      if (this.user.acc && this.user.pwd && this.value) {
        API_USER_ADD(this.user.acc, this.user.pwd, this.value).then(() => {
          this.$message({
            showClose: true,
            message: "恭喜你,添加成功",
            type: "success"
          });
          this.user.acc = "";
          this.user.pwd = "";
          this.value = "";
        });
      } else {
        this.$message({
          showClose: true,
          message: "请填写完整",
          type: "error"
        });
      }
      //  定时器
      setTimeout(() => {
        this.isclick = true;
      }, 3000);
    }
  }
};
</script>

<style lang="less" scoped>
.accadd {
  background-color: #fff;
  padding: 10px;
  margin: 10px;
  .acc {
    width: 222px;
  }
  .pwd {
    width: 222px;
  }
  p {
    height: 30px;
    line-height: 30px;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
  }
}
</style>