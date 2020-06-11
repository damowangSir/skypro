<template>
  <div class="list">
    <!-- 编辑模态框 -->
    <div class="edit" v-show="editflag">
      <div class="editok">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.name" class="name_input"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="form.category" placeholder="请选择商品分类">
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
              <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input type="textarea" v-model="form.goodsDesc" class="desc_input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="okEdit">确定修改</el-button>
            <el-button @click="editflag=!editflag">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <p>商品列表</p>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品ID">
              <span>{{ props.row.id}}</span>
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ props.row.name}}</span>
            </el-form-item>
            <el-form-item label="所属分类">
              <span>{{ props.row.category}}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{ props.row.price}}</span>
            </el-form-item>
            <el-form-item label="商品图片">
              <img class="img" :src="props.row.imgUrl" />
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.ctime}}</span>
            </el-form-item>
            <el-form-item label="商品评价">
              <span>{{ props.row.rating}}</span>
            </el-form-item>
            <el-form-item label="商品销量">
              <span>{{ props.row.sellCount}}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.goodsDesc}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="所属分类" prop="category"></el-table-column>
      <el-table-column label="商品价格" prop="price"></el-table-column>

      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <el-image :src="tableData[scope.$index].imgUrl" class="img"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="props">
          <el-button type="primary" size="small" @click="clickEdit(props.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="clickDel(props.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 3, 5, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import {
  API_GOODS_LIST,
  API_GOODS_DEL,
  API_GOODS_CATEGORICE,
  API_GOODS_EDIT
} from "@/api/apis";
export default {
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.Rendering();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.Rendering();
    },
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
    // 数据渲染函数
    Rendering() {
      API_GOODS_LIST(this.currentPage, this.pageSize).then(res => {
        this.total = res.data.total;
        res.data.data.forEach(item => {
          item.imgUrl =
            "http://127.0.0.1:5000/upload/imgs/goods_img/" + item.imgUrl;
          // 时间转换
          item.ctime = this.resolvingDate(item.ctime);
        });
        this.tableData = res.data.data;
      });
    },
    // 商品删除
    clickDel(id) {
      this.$confirm("此操作将永久删除此商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_GOODS_DEL(id).then(res => {
            if (res.data.code == 0)
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            this.Rendering();
          });
        })
        .catch(() => {});
    },
    // 商品编辑
    clickEdit(row) {
      this.editflag = !this.editflag;
      this.newUrl = row.imgUrl.substr(row.imgUrl.lastIndexOf("/") + 1);
      this.form = { ...row };
      // console.log(row);
      // console.log(this.newUrl);
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.form.imgUrl = URL.createObjectURL(file.raw);
      this.newUrl = res.imgUrl;
      // console.log(this.form, res, file);
    },
    // 确定修改
    okEdit() {
      API_GOODS_EDIT(
        this.form.name,
        this.form.category,
        this.form.price,
        this.newUrl,
        this.form.goodsDesc,
        this.form.id
      ).then(res => {
        if (res.data.code == 0)
          this.$message({
            showClose: true,
            message: "商品修改成功",
            type: "success"
          });
        this.editflag = !this.editflag;
        this.Rendering()
      });
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 3,
      total: 0,
      tableData: [],
      editflag: false,
      form: {},
      categories: []
    };
  },
  created() {
    this.Rendering();

    API_GOODS_CATEGORICE().then(res => {
      this.categories = res.data.categories;
    });
  }
};
</script>

<style lang="less" scoped>
.list {
  background-color: #fff;
  margin: 10px;
  .edit {
    width: 100%;
    height: 100%;
    background-color: rgba(155, 155, 155, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    .editok {
      width: 800px;

      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 10px;
      padding: 10px;
      .name_input {
        width: 400px;
      }
      .desc_input {
        width: 400px;
      }
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
    }
  }
  .img {
    width: 100px;
    height: 100px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  p {
    height: 3 0px;
    line-height: 30px;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
  }
  .el-pagination {
    padding-left: 10px;
    margin-top: 10px;
  }
  .el-table {
    padding-left: 10px;
  }
}
</style>