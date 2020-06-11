<template>
  <div class="sum">
    <div class="top">
      <p>时间范围</p>
      <el-date-picker
        v-model="value"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="data"
      ></el-date-picker>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div id="echarts"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { API_ORDER_ORDERTOTAL } from "@/api/apis";
export default {
  data() {
    return {
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
      value: [new Date(2020, 5, 1, 10, 10), new Date(2020, 5, 20, 10, 10)],
      data: ""
    };
  },
  methods: {
    // 时间转换函数
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
    // 封装一个渲染函数
    Rendering() {
      this.data = JSON.stringify(
        this.value.map(item => this.resolvingDate(item))
      );
      // 初始化DOM容器
      var myecharts = echarts.init(document.getElementById("echarts"));
      //开启loading
      myecharts.showLoading();
      setTimeout(() => {
        API_ORDER_ORDERTOTAL(this.data).then(res => {
          let orderTime = res.data.data.map(item =>
            this.resolvingDate(item.orderTime)
          );
          let orderAmount = res.data.data.map(item => item.orderAmount);
          // 配置表格
          let option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999"
                }
              }
            },
            toolbox: {
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            legend: {
              data: ["订单金额"]
            },
            xAxis: [
              {
                type: "category",
                name: "下单时间",
                data: orderTime,
                axisPointer: {
                  type: "shadow"
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "价格",
                min: 0,
                max: 120,
                interval: 10,
                axisLabel: {
                  formatter: "{value} 元"
                }
              }
            ],
            series: [
              {
                name: "订单金额",
                type: "bar",
                data: orderAmount
              }
            ]
          };
          myecharts.hideLoading();
          myecharts.setOption(option);
        });
      }, 1000);
    },
    search() {
      this.Rendering();
    }
  },
  mounted() {
    this.Rendering();
  }
};
</script>

<style lang="less" scoped>
.sum {
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    justify-content: left;
    padding: 10px;
    margin: 10px;
    .data {
      width: 460px;
      margin: 0 15px;
    }
    button {
      height: 40px;
    }
    p {
      line-height: 40px;
    }
  }

  #echarts {
    width: 1163px;
    margin: 20px;
    padding: 20px;
    height: 400px;
    background-color: #fff;
  }
}
</style>