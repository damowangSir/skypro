<template>
  <div id="admin">
    <div>
      <div>管理员信息</div>
      <div>
        管理员ID：
        <span>{{id}}</span>
      </div>
      <div>
        账号：
        <span>{{acc}}</span>
      </div>
      <div>
        用户组：
        <span>{{group}}</span>
      </div>
      <div>
        创建时间：
        <span>{{resolvingDate(ctime)}}</span>
      </div>
      <div>
        管理员头像：
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/users/avatar_upload"
          :data="paramsData"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
//引入接口
import { API_USERS_ACCINFO } from "@/api/apis";
export default {
  data() {
    return {
      id: "",
      acc: "",
      group: "",
      ctime: "",
      imageUrl: "", 
    };
  },
  created() {
    API_USERS_ACCINFO(localStorage.id).then(res => {
      this.id = res.data.accountInfo.id;
      this.acc = res.data.accountInfo.account;
      this.group = res.data.accountInfo.userGroup;
      this.imageUrl = res.data.accountInfo.imgUrl;
      this.ctime = res.data.accountInfo.ctime;
    });
  },

  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      window.location.reload()
    },
    // 日期转化
    resolvingDate(date) {
      //date是传入的时间
      let d = new Date(date);

      let month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      let hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      let sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();

      let times =
        d.getFullYear() +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        min +
        ":" +
        sec;

      return times;
    }
  },
  computed: {
    paramsData: function() {
      let params = {
        id:localStorage.id
      };
      return params;
    }
  }
};
</script>

<style lang="less" scoped>
#admin {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  height: 100%;
  background: #f0f2f5;
  padding: 20px;
  box-sizing: border-box;
  & > div {
    background: white;
    padding: 20px;
    div {
      line-height: 50px;
      border-bottom: 1px solid #f0f2f5;
    }
  }
}
</style>