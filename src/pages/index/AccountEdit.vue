<template>
  <div class="edit">
    <p>修改密码</p>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" class="oldpwd">
        <el-input type="password" v-model="ruleForm.oldpwd" @change="changeOldpwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass" class="pwd">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass" class="pwd">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { API_USERS_CHECKOLDPWD, API_USERS_EDITPWD } from "@/api/apis";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        oldpwd: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      oldflag: false
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // 判断旧密码和新密码是否都正确
        if (valid && this.oldflag) {
          API_USERS_EDITPWD(this.ruleForm.pass, this.id).then(() => {
            this.$message({
              showClose: true,
              message: "修改成功,请重新登录",
              type: "success"
            });
            localStorage.removeItem("id");
            setTimeout(() => {
              this.$router.push("/");
            }, 1500);
          });
        } else {
          this.$message({
            showClose: true,
            message: "请按格式填写",
            type: "error"
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.oldpwd = "";
    },
    // 验证旧密码
    changeOldpwd() {
      // 判断密码为空时不发生axios请求
      if (this.ruleForm.oldpwd.length == 0) return;
      API_USERS_CHECKOLDPWD(this.ruleForm.oldpwd, this.id).then(res => {
        console.log(res)
        if (res.data.code == 1) {
          this.$message({
            showClose: true,
            message: "密码不正确",
            type: "error"
          });
        } else if(res.data.code == 5001){
          this.$message({
            showClose: true,
            message: "参数不正确",
            type: "error"
          });
        }
        else {
          this.oldflag = !this.oldflag;
        }
      });
    }
  },
  created() {
    this.id = localStorage.id;
  }
};
</script>

<style lang="less" scoped>
.edit {
  background-color: #fff;
  padding: 10px;
  margin: 10px;
  .oldpwd {
    margin-top: 15px;
    width: 333px;
  }
  .pwd {
    width: 333px;
  }
  p {
    height: 30px;
    line-height: 30px;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
  }
}
</style>