<template>
  <div class="add">
    <p>商品添加</p>
    <div class="product">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="form.name" class="name_input"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="form.cateName" placeholder="请选择商品分类">
            <el-option
              v-for="(item,index) in categories"
              :key="index"
              :label="item.cateName"
              :value="item.cateName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input-number v-model="form.price" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/goods/goods_img_upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form.img" :src="form.img" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input type="textarea" v-model="form.desc" class="desc_input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form)">添加商品</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { API_GOODS_CATEGORICE, API_GOODS_ADD } from "@/api/apis";
export default {
  data() {
    return {
      form: {
        name: "",
        cateName: "",
        price: "0",
        desc: "",
        img: ""
      },
      categories: [],
      dialogVisible: false,
      disabled: false
    };
  },
  methods: {
    onSubmit(form) {
      API_GOODS_ADD(
        form.name,
        form.cateName,
        form.price,
        this.imgUrl,
        form.desc
      ).then(res => {
        if (res.data.code == 0)
          this.$message({
            showClose: true,
            message: "商品添加成功",
            type: "success"
          });
        form.name = "";
        form.cateName = "";
        form.price = "";
        form.img = "";
        form.desc = "";
      });
    },
    handleAvatarSuccess(res, file) {
      this.form.img = URL.createObjectURL(file.raw);
      this.imgUrl = res.imgUrl;
    }
  },
  created() {
    API_GOODS_CATEGORICE().then(res => {
      this.categories = res.data.categories;
    });
  }
};
</script>

<style lang="less" scoped>
.add {
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
    border: 1px dashed #c0ccda;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  background-color: #fff;
  margin: 10px;
  .product {
    padding: 10px;
    .name_input {
      width: 400px;
    }
    .desc_input {
      width: 400px;
    }
    .ad,
    .dec {
      width: 40px;
      height: 40px;
      outline: none;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .price_input {
      width: 60px;
      border-radius: 0;
      input {
        text-align: center;
      }
    }
  }
  p {
    height: 3 0px;
    line-height: 30px;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
  }
}
</style>