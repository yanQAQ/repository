<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <template>
        <el-table :data="tableData" stripe border style="width: 100%">
          <el-table-column type="index" label="序号" width="180"></el-table-column>
          <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="level" label="等级">
            <template slot-scope="props">
              <el-tag v-if="+props.row.level===0">一级</el-tag>
              <el-tag type="success" v-if="+props.row.level===1">二级</el-tag>
              <el-tag type="warning" v-if="+props.row.level===2">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  created () {
    this.getRoleList()
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get(`rights/list`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res)
      this.tableData = res.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
