<template>
  <div id="main">
    <!-- 查看模态框 -->
    <div class="see" v-show="seeFlag">
      <div class="seeinfo">
        <h3>订单详情</h3>
        <p>
          <span>id:</span>
          {{seeinfo.id}}
        </p>
        <p>
          <span>订单号:</span>
          {{seeinfo.orderNo}}
        </p>
        <p>
          <span>下单时间:</span>
          {{seeinfo.orderTime}}
        </p>
        <p>
          <span>联系电话:</span>
          {{seeinfo.phone}}
        </p>
        <p>
          <span>收货人:</span>
          {{seeinfo.consignee}}
        </p>
        <p>
          <span>送货地址:</span>
          {{seeinfo.deliverAddress}}
        </p>
        <p>
          <span>送达时间:</span>
          {{seeinfo.deliveryTime}}
        </p>
        <p>
          <span>备注:</span>
          {{seeinfo.remarks}}
        </p>
        <p>
          <span>订单金额:</span>
          {{seeinfo.orderAmount}}
        </p>
        <p>
          <span>订单状态:</span>
          {{seeinfo.orderState}}
        </p>
        <el-button plain @click="seeFlag=!seeFlag">关闭</el-button>
      </div>
    </div>
    <!-- 编辑模态框 -->
    <div class="edit" v-show="editFlag">
      <div class="editinfo">
        <el-form label-position="left" label-width="80px" :model="editinfo">
          <el-form-item label="id">
            <el-input v-model="editinfo.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="editinfo.orderNo"></el-input>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker v-model="editinfo.orderTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="editinfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="收货人">
            <el-input v-model="editinfo.consignee"></el-input>
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input v-model="editinfo.deliverAddress"></el-input>
          </el-form-item>
          <el-form-item label="送达时间">
            <el-date-picker v-model="editinfo.deliveryTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editinfo.remarks"></el-input>
          </el-form-item>
          <el-form-item label="订单金额">
            <el-input v-model="editinfo.orderAmount"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="editinfo.orderState">
              <el-option label="已受理" value="已受理"></el-option>
              <el-option label="待受理" value="待受理"></el-option>
              <el-option label="已完成" value="已完成"></el-option>
              <el-option label="派送中" value="派送中"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="onEdit">确定修改</el-button>
            <el-button @click="editFlag=!editFlag" size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="formInline.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="formInline.consignee" placeholder="收货人"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formInline.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="formInline.orderState" placeholder="订单状态">
            <el-option label="已受理" value="已受理"></el-option>
            <el-option label="待受理" value="待受理"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="派送中" value="派送中"></el-option>
          </el-select>
        </el-form-item>
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="orderNo" label="订单号" width="150"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" width="250"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
      <el-table-column prop="deliverAddress" label="配送地址" width="200"></el-table-column>
      <el-table-column prop="deliveryTime" label="送达时间" width="250"></el-table-column>
      <el-table-column prop="remarks" label="用户备注" width="120"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
      <el-table-column prop="orderState" label="订单状态" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="big">查看</el-button>
          <el-button @click="editClick(scope.row)" type="text" size="big">编辑</el-button>
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
import { API_ORDER_LIST, API_ORDER_SEARCH, API_ORDER_EDIT } from "@/api/apis";
export default {
  data() {
    return {
      formInline: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: ""
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: [new Date(2020, 5, 1, 10, 10), new Date(2020, 5, 20, 10, 10)],
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      editFlag: false,
      seeFlag: false,
      seeinfo: {},
      editinfo: {}
    };
  },
  methods: {
    // 查询
    onSubmit() {
      // 查询
      let data = this.value1.map(item => this.resolvingDate(item));
      API_ORDER_SEARCH(
        this.currentPage,
        this.pageSize,
        this.formInline.orderNo,
        this.formInline.consignee,
        this.formInline.phone,
        this.formInline.orderState,
        data
      ).then(res => {
        this.tableData = res.data.data;
        this.tableData.forEach(element => {
          element.deliveryTime = this.resolvingDate(element.deliveryTime);
          element.orderTime = this.resolvingDate(element.orderTime);
        });
      });
    },
    // 编辑
    editClick(row) {
      this.editFlag = !this.editFlag;
      this.editinfo = { ...row };
    },
    // 确认编辑
    onEdit() {
      API_ORDER_EDIT(
        this.editinfo.id,
        this.editinfo.orderNo,
        this.editinfo.orderTime,
        this.editinfo.phone,
        this.editinfo.consignee,
        this.editinfo.deliverAddress,
        this.editinfo.deliveryTime,
        this.editinfo.remarks,
        JSON.stringify(this.editinfo.orderAmount),
        this.editinfo.orderState
      ).then(res => {
        if (res.data.code == 0)
          this.$message({
            showClose: true,
            message: "订单修改成功",
            type: "success"
          });
        this.Rendering();
        this.editFlag = !this.editFlag;
      });
    },
    // 查看
    handleClick(row) {
      this.seeFlag = !this.seeFlag;
      this.seeinfo = { ...row };
    },
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
    // 封装一个渲染函数
    Rendering() {
      API_ORDER_LIST(this.currentPage, this.pageSize).then(res => {
        this.tableData = [...res.data.data];
        for (let item of this.tableData) {
          item.deliveryTime = this.resolvingDate(item.deliveryTime);
          item.orderTime = this.resolvingDate(item.orderTime);
        }
        this.total = res.data.total;
      });
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
    }
  },
  created() {
    this.Rendering();
  }
};
</script>

<style lang="less" scoped>
#main {
  background-color: #fff;
  margin: 20px;
  .see {
    width: 100%;
    height: 100%;
    background-color: rgba(155, 155, 155, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    .seeinfo {
      h3 {
        text-align: center;
      }
      width: 300px;
      height: 500px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 10px;
      padding: 10px;
      p {
        margin: 5px;
        border-top: 1px solid #ccc;
        padding: 6px;
        font-size: 18px;
      }
      button {
        margin-left: 225px;
        margin-top: 5px;
      }
    }
  }
  .edit {
    width: 100%;
    height: 100%;
    background-color: rgba(155, 155, 155, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    .editinfo {
      h3 {
        text-align: center;
      }
      width: 300px;
      height: 500px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 10px;
      padding: 10px;
      .el-form-item {
        margin-bottom: 5px;
      }
    }
  }
  .card {
    padding: 10px;
  }
}
</style>