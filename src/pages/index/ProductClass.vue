<template>
  <div class="class">
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="classname" autocomplete="off" placeholder="分类名称"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subFrom">确 定</el-button>
      </div>
    </el-dialog>
    <div class="top">
      <p>商品分类</p>
      <el-button type="primary" @click="dialogFormVisible = true">添加分类</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="序号" width="180"></el-table-column>
      <el-table-column  label="分类名称" width="180" >
      <template slot-scope="scope">
        <p v-if="editFlag[scope.$index].flag"> {{scope.row.cateName}}</p>
        <input class="class_input" type="text" v-model="scope.row.cateName"  v-if="!editFlag[scope.$index].flag">
      </template>
      </el-table-column>
      <el-table-column prop="state" label="是否启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="editFlag[scope.$index].flag"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="small"
            v-if="editFlag[scope.$index].flag"
            @click="clickEdit(scope.row,scope.$index)"
          >编辑</el-button>
          <el-button
            type="success"
            v-if="!editFlag[scope.$index].flag"
            size="small"
            @click="clickPre(scope.row,scope.$index)"
          >保存</el-button>
          <el-button type="danger" size="small" @click="clickDel(scope.row.id)" v-if="editFlag[scope.$index].flag">删除</el-button>
          <el-button
            v-if="!editFlag[scope.$index].flag"
            size="small"
            @click="clickCancel(scope.$index)"
          >取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 3, 4, 5]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import {
  API_GOODS_CATELIST,
  API_GOODS_ACCCATE,
  API_GOODS_DELCATE,
  API_GOODS_EDITCATE
} from "@/api/apis";
export default {
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.Rendering();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.Rendering();
      // console.log(`当前页: ${val}`);
    },
    // 封装一个渲染函数
    Rendering() {
      API_GOODS_CATELIST(this.currentPage, this.pageSize).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
        // console.log(res.data);
      });
    },
    // 确认添加分类
    subFrom() {
      if (this.classname.length == 0)
        return this.$message({
          showClose: true,
          message: "请填写分类",
          type: "error"
        });
      API_GOODS_ACCCATE(this.classname, JSON.stringify(this.value)).then(
        res => {
          if (res.data.code == 0)
            this.$message({
              showClose: true,
              message: "添加分类成功",
              type: "success"
            });
          this.dialogFormVisible = false;
          this.classname = "";
         this.Rendering()
         this.value=true

        }
      );
    },
    // 删除分类
    clickDel(id) {
      this.$confirm("此操作将永久删除此分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if(this.tableData.length==1) 
          this.currentPage--
          API_GOODS_DELCATE(id).then(res => {
            if (res.data.code == 0)
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.Rendering()
          });
        })
        .catch(() => {});
    },
    // 编辑分类
    clickEdit(row,index) {
      // this.editFlag[index].flag=!this.editFlag[index].flag
      this.oldName=row.cateName
      this.oldValue=row.state
      for(let i in this.editFlag){
        this.editFlag[i].flag=true
        if(i==index) 
        this.editFlag[index].flag=false
      }
    },
    // 取消编辑
    clickCancel(index){
      this.editFlag[index].flag=!this.editFlag[index].flag
    },
    // 保存分类
    clickPre(row,index){
      if(this.oldName==row.cateName&&this.oldValue==row.state)  return this.$message({
            showClose: true,
            message: "您还未修改",
            type: "error"
          });
       this.state=row.state==1?true:false
      API_GOODS_EDITCATE(row.id,row.cateName,JSON.stringify(this.state)).then(res=>{
        this.editFlag[index].flag=!this.editFlag[index].flag
        if (res.data.code == 0)
              this.$message({
                type: "success",
                message: "修改商品分类成功"
              });
              this.Rendering()
      })
    },
    
  },
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      classname: "",
      value: true,
      formLabelWidth: "120px",
      pageSize: 5,
      currentPage: 1,
      total: 0,
      editFlag: [],
    };
  },
  created() {
    API_GOODS_CATELIST(this.currentPage, this.pageSize).then(res => {
      this.tableData = res.data.data;
      this.total = res.data.total;
      // console.log(this.tableData);
      for (let i = 1; i <= this.tableData.length; i++) {
        let a = "";
        a = { flag: true };
        this.editFlag.push(a);
      }
      // console.log(this.editFlag);
    });
  },
};
</script>

<style lang="less" scoped>
.class {
  background-color: #fff;
  margin: 10px;
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
.class_input{
  border: none;
  border:1px solid #ccc;
  padding: 5px 0;
  border-radius: 3px;
  text-indent: 10px;
}
</style>