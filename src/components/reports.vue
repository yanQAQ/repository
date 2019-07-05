<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="tubiao" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  created () {
    this.gettubiao()
  },
  methods: {
    async gettubiao () {
      const { data: res } = await this.$http.get('reports/type/1')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      res.data.grid = {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
      res.data.title = {
        text: '用户来源'
      }
      res.data.tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      }
      res.data.xAxis[0].type = 'category'
      res.data.xAxis[0].boundaryGap = false
      var myChart = echarts.init(document.getElementById('tubiao'))
      // 绘制图表
      myChart.setOption(res.data)
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
</style>
