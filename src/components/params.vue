<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 编辑名称 -->
      <el-dialog title="编辑名称" :visible.sync="editdialog" width="30%">
        <el-form :rules="addcsRules" ref="editRef" label-width="120px">
          <el-form-item label="新的名称">
            <el-input v-model="name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialog = false">取 消</el-button>
          <el-button type="primary" @click="edit()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加动态参数 -->
      <el-dialog title="添加动态参数" :visible.sync="addcsdialog" width="30%">
        <el-form :rules="addcsRules" ref="addcsRef" label-width="120px">
          <el-form-item label="动态参数名称">
            <el-input v-model="name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addcsdialog = false">取 消</el-button>
          <el-button type="primary" @click="addcs()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加静态属性 -->
      <el-dialog title="添加静态属性" :visible.sync="addsxdialog" width="30%">
        <el-form :rules="addcsRules" ref="addsxRef" label-width="120px">
          <el-form-item label="动态参数名称">
            <el-input v-model="name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addsxdialog = false">取 消</el-button>
          <el-button type="primary" @click="addsx()">确 定</el-button>
        </span>
      </el-dialog>
      <!--  -->
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
          <el-button type="primary" size="mini" :disabled="disabled" @click="addcsdialog=true">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" size="mini" :disabled="disabled" @click="addsxdialog=true">添加属性</el-button>
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
                  @close="editParams(props.row.attr_vals,tag,props.row.attr_name,props.row.attr_id)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="handleInputConfirm(props.row.attr_vals,'add',props.row.attr_name,props.row.attr_id)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作" prop="desc">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdit(info.row.attr_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delparams(info.row.attr_id)"
            >删除</el-button>
          </template>
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
      editdialog: false,
      attrID: '',
      addcsRules: {
        name: [{ required: true, message: '用户名必填', trigger: 'blur' }]
      },
      addsxdialog: false,
      addcsdialog: false,
      disabled: true,
      inputVisible: false,
      inputValue: '',
      tableData: [],
      sel: 'only',
      name: '',
      activeName: 'second',
      value: [],
      options: []
    }
  },
  methods: {
    // 编辑新名称
    showEdit (id) {
      this.editdialog = true
      this.attrID = id
    },
    async edit () {
      const { data: res } = await this.$http.put(
        `categories/${this.value[2]}/attributes/${this.attrID}`,
        { attr_name: this.name, attr_sel: this.sel }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.editdialog = false
      this.name = ''
      this.getparams()
    },
    // 删除参数
    async delparams (id) {
      const { data: res } = await this.$http.delete(
        `categories/${this.value[2]}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getparams()
    },
    // 添加属性
    async addsx () {
      const { data: res } = await this.$http.post(
        `categories/${this.value[2]}/attributes`,
        { attr_name: this.name, attr_sel: this.sel }
      )
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.addsxdialog = false
      this.name = ''
      this.getparams()
    },
    // 添加参数
    async addcs () {
      const { data: res } = await this.$http.post(
        `categories/${this.value[2]}/attributes`,
        { attr_name: this.name, attr_sel: this.sel }
      )
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.addcsdialog = false
      this.name = ''
      this.getparams()
    },
    // 修改参数
    async editParams (vals, tag, aname, id) {
      if (tag !== 'add') {
        vals.splice(vals.indexOf(tag), 1)
      }
      if (this.sel === 'many') {
        vals = vals.join(',')
      } else {
        vals = vals.join(' ')
      }
      const { data: res } = await this.$http.put(
        `categories/${this.value[2]}/attributes/${id}`,
        { attr_name: aname, attr_vals: vals, attr_sel: this.sel }
      )
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    async getOptions () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.options = res.data
    },
    handleChange (value) {
      if (value.length === 3) {
        this.disabled = false
        this.getparams()
      }
    },
    handleClick (tab, event) {
      if (this.activeName === 'first') {
        this.sel = 'many'
        this.getparams()
      } else {
        this.sel = 'only'
        this.getparams()
      }
    },
    async getparams () {
      if (this.value.length === 3) {
        const { data: res } = await this.$http.get(
          `categories/${this.value[2]}/attributes?sel=${this.sel}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].attr_vals = res.data[i].attr_vals.split(' ')
        }
        this.tableData = res.data
      }
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm (vals, tag, aname, id) {
      let inputValue = this.inputValue
      if (inputValue) {
        vals.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
      this.editParams(vals, tag, aname, id)
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
