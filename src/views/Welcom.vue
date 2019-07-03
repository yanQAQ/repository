<template>
  <div>
    <h4>Welconme 默认页面</h4>
    <el-card id="page">
      <UserList></UserList>
    </el-card>
    <el-card id="page2">
      <Roles></Roles>
    </el-card>
    <el-card id="page3">
      <Rights></Rights>
    </el-card>
    <el-card id="page4">
      <Goods></Goods>
    </el-card>
    <el-card id="page5">
      <Params></Params>
    </el-card>
    <el-card id="page6">
      <Categories></Categories>
    </el-card>
    <el-card id="page7">
      <Orders></Orders>
    </el-card>
    <el-card id="page8">
      <Reports></Reports>
    </el-card>
  </div>
</template>
<script>
import UserList from '../components/userlist.vue'
import Roles from '../components/roles.vue'
import Rights from '../components/rights.vue'
import Goods from '../components/goods.vue'
import Params from '../components/params.vue'
import Categories from '../components/categories.vue'
import Orders from '../components/orders.vue'
import Reports from '../components/reports.vue'

export default {
  components: {
    UserList,
    Roles,
    Rights,
    Goods,
    Params,
    Categories,
    Orders,
    Reports
  }
}
</script>
<style lang="less" scoped>
#page {
  width: 48%;
  height: 400px;
  float: left;
  margin-right: 10px;
  margin-bottom: 10px;
}
#page2 {
  width: 48%;
  height: 400px;
  float: left;
  margin-bottom: 10px;
}
#page3 {
  width: 48%;
  height: 400px;
  float: left;
  margin-bottom: 10px;
  margin-right: 10px;
}
#page4 {
  width: 48%;
  height: 400px;
  margin-bottom: 10px;
  float: left;
}
#page5 {
  width: 48%;
  height: 400px;
  margin-right: 10px;
  margin-bottom: 10px;
  float: left;
}
#page6 {
  width: 48%;
  height: 400px;
  margin-bottom: 10px;
  float: left;
}
#page7 {
  width: 48%;
  height: 400px;
  margin-right: 10px;
  margin-bottom: 10px;
  float: left;
}
#page8 {
  width: 48%;
  height: 400px;
  margin-bottom: 10px;
  float: left;
}
</style>
