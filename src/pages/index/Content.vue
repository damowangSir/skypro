<template>
  <div>
    <el-row :span="16" class="bgc">
      <div id="order">
        <div class="content">
          <span class="el-icon-document"></span>
          <div>
            <p>总订单</p>
            <p>{{totalOrder}}</p>
          </div>
        </div>
        <div class="content">
          <span class="el-icon-coin"></span>
          <div>
            <p>总销售额</p>
            <p>{{totalAmount}}</p>
          </div>
        </div>
        <div class="content">
          <span class="el-icon-s-order"></span>
          <div>
            <p>今日订单</p>
            <p>{{todayOrder}}</p>
          </div>
        </div>
        <div class="content">
          <span class="el-icon-sunny"></span>
          <div>
            <p>今日销售总额</p>
            <p>{{totayAmount}}</p>
          </div>
        </div>
      </div>
      <div id="echarts"></div>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
import { API_ORDER_TOTALDATA } from "@/api/apis";
export default {
  data() {
    return {
      todayOrder: 0, //今日订单
      totalAmount: 0, //总销售额
      totalOrder: 0, //总订单
      totayAmount: 0 //今日销售额
    };
  },
  mounted() {
    // 初始化DOM容器
    var myecharts = echarts.init(document.getElementById("echarts"));
    //开启loading
    myecharts.showLoading();

    setTimeout(() => {
      API_ORDER_TOTALDATA().then(res => {
        let {
          amountData,
          orderData,
          todayOrder,
          totalAmount,
          totalOrder,
          totayAmount,
          xData
        } = res.data;
        this.totalOrder = totalOrder;
        this.totalAmount = totalAmount;
        this.totayAmount = totayAmount;
        this.todayOrder = todayOrder;
        // 配置表格对象
        let option = {
          title: {
            text: "数据统计"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["订单", "销售额"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          // X轴
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xData
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "订单",
              type: "line",
              stack: "总量",
              data: orderData
            },
            {
              name: "销售额",
              type: "line",
              stack: "总量",
              data: amountData
            }
          ]
        };
        myecharts.setOption(option);
        myecharts.hideLoading();
      });
    },1000);
  }
};
</script>

<style lang="less" scoped>
#order {
  padding: 5px;
  display: flex;
  .content {
    background-color: #fff;
    margin: 15px;
    flex: 1;
    display: flex;
    justify-content: space-between;
    // line-height: 50px;
    padding: 12px 5px;
    &:nth-child(1) {
      span {
        color: #1296db;
      }
    }
    &:nth-child(2) {
      span {
        color: #d4237a;
      }
    }
    &:nth-child(3) {
      span {
        color: #1296db;
      }
    }
    &:nth-child(4) {
      span {
        color: #1afa29;
      }
    }

    span {
      display: block;
      font-size: 70px;
    }
    p {
      margin: 10px;
      text-align: center;
      &:nth-child(1) {
        color: #d1d1d1;
        font-size: 16px;
      }
      &:nth-child(2) {
        color: #333333;
        font-size: 15px;
        font-weight: bold;
      }
    }
  }
}
#echarts {
  width: 1163px;
  margin: 20px;
  padding: 20px;
  height: 400px;
  background-color: #fff;
}
</style>