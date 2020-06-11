<template>
  <div>
    <el-col :span="4">
      <div>
        <el-row class="tac">
          <el-col>
            <h5>外卖商家中心</h5>
            <el-menu
              :default-active="defaultActive"
              class="el-menu-vertical-demo"
              background-color="#304156"
              active-text-color="#399eff"
              router
              unique-opened
            >
              <div v-for="item in newList" :key="item.index">
                <!-- submenu: 可展开带二级选项卡 -->
                <el-submenu v-if="item.children" :index="item.index">
                  <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{ item.title }}</span>
                  </template>
                  <!-- 二级儿子标题 -->
                  <el-menu-item
                    v-for="child in item.children"
                    :key="child.index"
                    :index="child.index"
                  >
                    <i :class="child.icon"></i>
                    <span slot="title">{{ child.title }}</span>
                  </el-menu-item>
                </el-submenu>
                <!-- menu-item: 一级选项卡，不带展开 -->
                <el-menu-item v-else :index="item.index">
                  <i :class="item.icon"></i>
                  <span slot="title">{{ item.title }}</span>
                </el-menu-item>
              </div>
            </el-menu>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="20">
      <div id="right">
        <div class="top">
          <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="(item, index) in breadlist" :key="index">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div>
            <p v-html="user"></p>
            <router-link to="/index/person">
              <img :src="imgUrl" />
            </router-link>
          </div>
        </div>
        <div class="bgc">
          <router-view></router-view>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
import {API_USERS_CKECKTOKEN,API_USERS_ACCINFO} from '@/api/apis'
export default {
  data() {
    return {
      treelist: [
        {
          index: "/index/",
          icon: "el-icon-s-home",
          title: "后台首页",
          role:['super','normal']
        },
        {
          index: "/index/ordermanagement",
          icon: "el-icon-s-order",
          title: "订单管理",
          role:['super','normal']
        },
        {
          index: "3",
          icon: "el-icon-s-goods",
          title: "商品管理",
          role:['super','normal'],
          children: [
            {
              index: "/index/productlist",
              title: "商品列表"
            },
            {
              index: "/index/productadd",
              title: "商品添加"
            },
            {
              index: "/index/productclass",
              title: "商品分类"
            }
          ]
        },
        {
          index: "/index/storemanagement",
          icon: "el-icon-s-shop",
          title: "店铺管理",
          role:['super']
        },
        {
          index: "5",
          icon: "el-icon-user-solid",
          title: "账号管理",
          role:['super'],
          children: [
            {
              index: "/index/accountlist",
              title: "账号列表"
            },
            {
              index: "/index/accountadd",
              title: "添加账号"
            },
            {
              index: "/index/accountedit",
              title: "修改密码"
            }
          ]
        },
        {
          index: "6",
          icon: "el-icon-pie-chart",
          title: "销售统计",
          role:['super'],
          children: [
            {
              index: "/index/commoditysum",
              title: "商品统计"
            },
            {
              index: "/index/ordersum",
              title: "订单统计"
            }
          ]
        }
      ],
      breadlist: [""],
      defaultActive: "",
      user:"",
      role:"",
      imgUrl:""
    };
  },
  // 检测hash的变化
  watch: {
    $route: {
      handler: val => {
        window._this.changebreadlist(val.path);
      },
      // 深度监听
      deep: true
    }
  },
  methods: {
    changebreadlist(hash) {
      let arr = [];
      switch (hash) {
        case "/index/":
          arr = ["首页"];
          break;
        case "/index/ordermanagement":
          arr = ["订单管理"];
          break;
        case "/index/storemanagement":
          arr = ["店铺管理"];
          break;
        case "/index/accountadd":
          arr = ["账号管理", "添加账号"];
          break;
        case "/index/accountedit":
          arr = ["账号管理", "修改密码"];
          break;
        case "/index/accountlist":
          arr = ["账号管理", "账号列表"];
          break;
        case "/index/person":
          arr = ["账号管理", "管理员信息"];
          break;
        case "/index/productlist":
          arr = ["商品管理", "商品列表"];
          break;
        case "/index/productadd":
          arr = ["商品管理", "商品添加"];
          break;
        case "/index/productclass":
          arr = ["商品管理", "商品分类"];
          break;
        case "/index/commoditysum":
          arr = ["销售统计", "商品统计"];
          break;
        case "/index/ordersum":
          arr = ["销售统计", "订单统计"];
          break;
      }
      this.breadlist = arr;
    }
  },
  created() {
    let hash = this.$route.path;
    // 根据hash值改变默认选中
    this.defaultActive = hash;
    // 改变面包屑数组
    this.changebreadlist(hash);
    // 保存window全局
    window._this = this;
    // 发送请求验证token是否过期
    API_USERS_CKECKTOKEN(localStorage.token).then(res=>{
      if(res.data.code==1){
        this.user='<a href="#/">请登录</a>'
      }
      else{
        this.user=`欢迎您,${localStorage.acc}`
      }
    })
    this.role=localStorage.role
    // 获取用户头像
    API_USERS_ACCINFO(localStorage.id).then(res => {
      this.imgUrl = res.data.accountInfo.imgUrl;
      
    });
  },
  computed: {
    newList(){
      return this.treelist.filter(item=>item.role.includes(this.role))
    }
  },
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
#right {
  display: flex;
  flex-direction: column;
}
.top {
  display: flex;
  justify-content: space-between;
  line-height: 25px;
  height: 25px;
  margin: 15px 5px 10px 5px;
  p{
    a{
      text-decoration: none;
      color: #1296db;
    }
  }
  div {
    line-height: 40px;
    font-size: 14px;
    display: flex;
  }
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: -6px 30px 0 15px;
  }
}
.tac {
  a {
    text-decoration: none;
  }
  h5 {
    padding: 5px;
    text-align: center;
  }
  padding: 20px 0;
  height: 730px;
  background-color: #304156;
  color: #fff;
  .el-menu-item-group__title {
    padding: 0;
  }
  .el-submenu__title {
    span {
      color: #fff;
    }
  }
  .el-menu {
    border: none;
    background-color: #304156;
    color: #fff;
  }
  .el-submenu__title {
    background-color: #304156 !important;
    color: #fff !important;
  }
  .el-menu-item {
    min-width: 100px !important;
    background-color: #304156;
    color: #fff;
  }
}

.bgc {
  background-color: #f0f2f5;
  height: 680px;
  overflow-y: scroll;
}
</style>