<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <div class="block">
        <span class="demonstration">选择商品分类：</span>
        <el-cascader
          v-model="value"
          :options="options"
          :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }"
          @change="handleChange"
        ></el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" size="mini">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" size="mini">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
      <el-table :data="tableData" style="width: 98%;" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item>
                <el-tag
                  :key="tag"
                  v-for="tag in props.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="props.row.attr_vals.splice(props.row.attr_vals.indexOf(tag), 1)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row.attr_vals)"
                  @blur="handleInputConfirm(props.row.attr_vals)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作" prop="desc">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  created () {
    this.getOptions()
  },
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      tableData: [],
      sel: 'only',
      activeName: 'second',
      value: [],
      options: []
    }
  },
  methods: {
    async getOptions () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.options = res.data
    },
    handleChange (value) {
      console.log(value)
      this.getparams()
    },
    handleClick (tab, event) {
      if (tab._uid === 30) {
        this.sel = 'many'
        this.getparams()
      } else {
        this.sel = 'only'
        this.getparams()
      }
    },
    async getparams () {
      const { data: res } = await this.$http.get(
        `categories/${this.value[2]}/attributes?sel=${this.sel}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].attr_vals = res.data[i].attr_vals.split(' ')
      }
      this.tableData = res.data
      console.log(res)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm (dynamicTags) {
      let inputValue = this.inputValue
      if (inputValue) {
        dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.block {
  margin-top: 20px;
}
.el-button {
  margin-bottom: 20px;
}
.el-tag {
  margin-right: 10px;
}
</style>
