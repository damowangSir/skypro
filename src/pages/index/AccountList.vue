<template>
  <div class="acc">
    <!-- 编辑模态框 -->
    <div class="edit" v-show="motalflag">
      <div class="editok">
        <el-form>
          <el-form-item label="账号" label-position="right">
            <el-input v-model="newuser.acc"></el-input>
          </el-form-item>
          <el-form-item label="用户组">
            <el-select v-model="newuser.group" placeholder="请选择用户组" class="user_selc">
              <el-option label="普通管理员" value="普通管理员"></el-option>
              <el-option label="超级管理员" value="超级管理员"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="okEdit">确定修改</el-button>
            <el-button @click="motalflag=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <p>账号列表</p>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="账号" width="180">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>
      <el-table-column prop="userGroup" label="用户组" width="130"></el-table-column>
      <el-table-column prop="ctime" label="创建时间" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="600">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="clickEdit(scope.row.id,scope.row.account,scope.row.userGroup)"
          >编辑</el-button>
          <el-button type="danger" size="small" @click="clickDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 5, 8, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin:20px 0"
    ></el-pagination>
    <div>
      <el-button type="danger" @click="clickDels">批量删除</el-button>
      <el-button type="primary" @click="toggleSelection()">取消选择</el-button>
    </div>
  </div>
</template>

<script>
import {
  API_USER_LIST,
  API_USER_DEL,
  API_USERS_BAT,
  API_USERS_EDIT
} from "@/api/apis";

export default {
  methods: {
    // 取消选中
    toggleSelection(rows) {
      this.ids = [];
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 监听选中的函数
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      this.ids = val.map(item => item.id);
      // console.log(this.ids)
    },
    // 监听当前页条数的函数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val;
      this.Rendering();
    },
    // 监听页码改变的函数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.Rendering();
    },
    // 删除
    clickDel(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.tableData.length == 1) this.currentPage--;
          API_USER_DEL(id).then(res => {
            this.Rendering();
            if (res.data.code == 0) {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    // 封装的渲染数据函数
    Rendering() {
      API_USER_LIST(this.currentPage, this.pageSize).then(res => {
        this.tableData = res.data.data;
        for (let item of this.tableData) {
          item.ctime = this.resolvingDate(item.ctime);
        }
        this.total = res.data.total;
      });
    },
    // 批量删除
    clickDels() {
      if (this.ids.length == 0)
        return this.$message({
          showClose: true,
          message: "请选择您要删除的数据",
          type: "warning"
        });
      if (confirm("您确定要删除这些数据吗")) {
        API_USERS_BAT(JSON.stringify(this.ids)).then(res => {
          // 如果删除后返回的数据为空，重新渲染
          API_USER_LIST(this.currentPage, this.pageSize).then(res => {
            this.tableData = res.data.data;
            for (let item of this.tableData) {
              item.ctime = this.resolvingDate(item.ctime);
            }
            this.total = res.data.total;
            if (this.tableData.length == 0) this.currentPage--;
            this.Rendering();
          });
          this.ids = [];
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
          }
        });
      }
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
    },
    // 编辑
    clickEdit(id, acc, group) {
      this.motalflag = true;
      this.newuser.id = id;
      this.newuser.acc = acc;
      this.newuser.group = group;
      // console.log(id, acc, group);
    },
    // 确认编辑
    okEdit() {
      API_USERS_EDIT(
        this.newuser.id,
        this.newuser.acc,
        this.newuser.group
      ).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          this.Rendering();
          this.motalflag = false;
        }
      });
      console.log(this.newuser);
    }
  },
  data() {
    return {
      tableData: [],
      total: 1,
      pageSize: 5,
      currentPage: 1,
      ids: [],
      motalflag: false,
      newuser: {
        acc: "",
        group: ""
      }
    };
  },
  created() {
    this.Rendering();
  }
};
</script>

<style lang="less" scoped>
.acc {
  background-color: #fff;
  padding: 10px;
  margin: 10px;
  width: auto;
  height: auto;
  .edit {
    width: 100%;
    height: 100%;
    background-color: rgba(155, 155, 155, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    .editok {
      width: 300px;
      height: 250px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 10px;
      padding: 10px;
      .user_selc {
        width: 300px;
      }
    }
  }
  p {
    height: 30px;
    line-height: 30px;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
  }
}
</style>