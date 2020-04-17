<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-row>
        <el-col :span="1" class="right">
          <div class="demo-basic--circle">
            <div class="block">
              <el-avatar :size="30" :src="circleUrl"></el-avatar>
              <div class="name">aabb</div>
            </div>
          </div>
        </el-col>
        <el-col :span="1" class="right">
          <el-menu-item index="1">处理中心</el-menu-item>
        </el-col>
        <el-col :span="1" class="right">
          <el-menu-item index="3" disabled>消息中心</el-menu-item>
        </el-col>
      </el-row>
    </el-menu>
    <div class="line"></div>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">导航一</span>
        </template>
        <el-menu-item-group>
          <span slot="title">分组一</span>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <span slot="title">选项4</span>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class Navbar extends Vue {
  @Prop()
  activeIndex = "1";
  activeIndex2 = "1";
  isCollapse = false;
  circleUrl =
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
  sizeList = ["large", "medium", "small"];
  handleSelect(key, keyPath) {
    console.log(key, keyPath);
  }
  handleOpen(key, keyPath) {
    console.log(key, keyPath);
  }
  handleClose(key, keyPath) {
    console.log(key, keyPath);
  }
}
</script>
<style lang='less' scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.right {
  float: right;
}
.name {
  font-size: 12px;
  color: #aaa;
}
</style>