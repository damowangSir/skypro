<template>
  <div class="store">
    <div class="top">
      <p>店铺管理</p>
      <el-button type="primary" @click="shopEdit">保存</el-button>
    </div>
    <div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="店铺名称" class="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="店铺公告" class="notice">
          <el-input
            type="textarea"
            v-model="ruleForm.bulletin"
            :autosize="{ minRows: 4, maxRows: 8}"
          ></el-input>
        </el-form-item>
        <el-form-item label="商家头像" class="header">
          <el-upload
            class="avatar-uploader"
            :action="serverupload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="ruleForm.avatar" :src="servershopimg+ruleForm.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺图片">
          <el-upload
            :file-list="fileList"
            :action="serverupload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccessA"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="配送费" class="name">
          <el-input v-model="ruleForm.deliveryPrice"></el-input>
        </el-form-item>
        <el-form-item label="配送时间" class="name">
          <el-input v-model="ruleForm.deliveryTime"></el-input>
        </el-form-item>
        <el-form-item label="配送描述" class="notice">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="店铺评分" class="name">
          <el-input v-model="ruleForm.score"></el-input>
        </el-form-item>
        <el-form-item label="销量" class="name">
          <el-input v-model="ruleForm.sellCount"></el-input>
        </el-form-item>
        <el-form-item label="活动">
          <el-checkbox-group v-model="supports" class="name">
            <el-checkbox v-for="item in checkbox" :key='item' label="在线支付满28减5"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="营业时间">
          <el-time-picker
            is-range
            arrow-control
            v-model="value"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  API_SHOP_INFO,
  API_SHOP_EDIT,
  SERVE_UPLOAD,
  SERVE_SHOP_IMG
} from "@/api/apis";
export default {
  data() {
    return {
      ruleForm: {},
      urlObj: {},
      supports: [],
      dialogImageUrl: "",
      dialogVisible: false,
      value: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      imageUrl: "",
      serverupload: SERVE_UPLOAD, //服务器上传图片接口地址
      servershopimg: SERVE_SHOP_IMG, //服务器获取商店图片地址
      urlArr: [],
      fileList: [],
      newUrl: [],
      headflag: true,
      isclick: true,
      checkbox:['在线支付满28减5','VC无限橙果汁全场8折','单人精彩套餐','特价饮品八折抢购','单人特色套餐']
    };
  },
  methods: {
    // 日期格式转化
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
    },
    // 修改店铺
    shopEdit() {
      // 防抖节流
      if (this.isclick == false) return;
      this.isclick = false;
      let date = this.value.map(item => this.resolvingDate(item));
      // console.log(this.ruleForm, data, this.newUrl, this.supports);
      API_SHOP_EDIT(
        this.ruleForm.id,
        this.ruleForm.name,
        this.ruleForm.bulletin,
        this.ruleForm.avatar,
        this.ruleForm.deliveryPrice,
        this.ruleForm.deliveryTime,
        this.ruleForm.description,
        this.ruleForm.score,
        this.ruleForm.sellCount,
        JSON.stringify(this.supports),
        JSON.stringify(date),
        JSON.stringify(this.newUrl)
      ).then(res => {
        if (res.data.code == 0)
          this.$message({
            showClose: true,
            message: "店铺修改成功",
            type: "success"
          });
      });
      //  定时器
      setTimeout(() => {
        this.isclick = true;
      }, 4000);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //
    handleAvatarSuccess(res, file) {
      file;
      this.ruleForm.avatar = res.imgUrl;
      // console.log(this.ruleForm.avatar);
    },
    // 店铺图片移除
    handleRemove(file, fileList) {
      this.newUrl = [];
      for (let item of fileList) {
        this.newUrl.push(item.url.substr(item.url.lastIndexOf("/") + 1));
      }
      this.fileList = fileList;
      // console.log(this.newUrl);
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(res, file) {
      file;
      this.dialogImageUrl = this.servershopimg + res.imgUrl;
      this.dialogVisible = true;
    },
    // 店铺图片上传成功后
    handleSuccessA(res) {
      // 截取出需要传给后台的图片地址
      this.newUrl = [];
      this.fileList.push({ url: this.servershopimg + res.imgUrl });
      this.newUrl = this.fileList.map(item =>
        item.url.substr(item.url.lastIndexOf("/") + 1)
      );
    }
  },
  created() {
    API_SHOP_INFO().then(res => {
      this.ruleForm = { ...res.data.data };
      this.supports = [...res.data.data.supports];
      this.value = [...res.data.data.date];
      //遍历网址并拼接服务器地址插入this.fileList图片就可以展示出来了
      this.ruleForm.pics.forEach(val => {
        this.newUrl.push(val);
        this.urlObj.url = this.servershopimg + val;
        this.fileList.push(this.urlObj);
        this.urlObj = {};
      });
      // console.log(this.ruleForm);
      // console.log(this.ruleForm.avatar);
    });
  }
};
</script>

<style lang="less" scoped>
.store {
  background-color: #fff;
  margin: 5px;
  .shopimg {
    display: flex;
    justify-content: left;
    img {
      display: inline-block;
      padding: 1px;
      height: 146px;
      width: 146px;
    }
  }
  .name {
    width: 500px;
  }
  .notice {
    width: 500px;
  }
  .header {
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
      border: 1px solid #ccc;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  .top {
    height: 30px;
    line-height: 30px;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    button {
      margin-bottom: -10px;
    }
  }
}
</style>