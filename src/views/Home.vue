<template>
  <div class="home">
    <el-container>
      <el-header>
        <img src="../assets/img/heima.png" alt />
        <span>电商后台管理系统</span>
        <el-button type="info" @click="logout()">退出</el-button>
      </el-header>
      <el-container>
        <el-radio-group v-model="isCollapse" style="display: none;"></el-radio-group>
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          router
        >
          <div class="openKey" @click="keyF()">| | |</div>
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id+''">
            <template slot="title">
              <i :class="iconList[item.path]"></i>
              <span slot="title">{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="item2 in item.children" :key="item2.id" :index="item2.path">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  created () {
    this.getMenuList()
  },
  data () {
    return {
      isCollapse: false,
      menuList: [],
      iconList: {
        users: 'el-icon-s-custom',
        rights: 'el-icon-s-management',
        goods: 'el-icon-s-goods',
        orders: 'el-icon-s-order',
        reports: 'el-icon-s-marketing'
      }
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    keyF () {
      this.isCollapse = !this.isCollapse
    },
    async getMenuList () {
      // 利用axios请求具体的url地址，获得对应的数据
      var { data: dt } = await this.$http.get('menus')
      // 数据获取失败处理
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获得好的菜单数据赋予给menuList成员
      this.menuList = dt.data
    },
    logout () {
      this.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          window.sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>
<style lang="less">
.el-header {
  background-color: #373d41;
  padding: 0;
  display: flex;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  span {
    font-size: 22px;
    color: #fff;
  }
  button {
    width: 70px;
    height: 40px;
    position: absolute;
    right: 20px;
    span {
      font-size: 14px;
    }
  }
}

.el-menu {
  position: static;
  flex-shrink: 0;
  .openKey {
    color: #fff;
    text-align: center;
    background-color: #4a5064;
    font-size: 12px;
    height: 25px;
    line-height: 25px;
  }
  background-color: #333744;
  height: 100%;
  color: #fff;
  .el-submenu__title {
    background-color: #333744;
    color: #fff;
    &:hover {
      color: #000;
      background-color: #ecf5ff;
    }
  }
  .el-menu-item {
    color: #fff;
    &.is-active {
      color: #000;
    }
    &:hover,
    &:focus {
      color: #000;
    }
  }
}
.el-main {
  background-color: #eaedf1;
}
html,
body,
.home,
.el-container {
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
