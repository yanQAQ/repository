<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 修改分类名称 -->
      <el-dialog
        title="添加分类"
        :visible.sync="editDialog"
        @close="$refs.editFormRef.resetFields()"
        width="50%"
      >
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="edit()">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加分类弹框-->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialog"
        @close="$refs.addFormRef.resetFields()"
        width="50%"
      >
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>

          <el-form-item label="分类上级" prop="selectTwoCat">
            <el-cascader
              v-model="addForm.selectTwoCat"
              :options="catListTwo"
              :props="{
            expandTrigger: 'hover',
            value:'cat_id',
            label:'cat_name',
            checkStrictly:true
        }"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="addCat()">确 定</el-button>
        </span>
      </el-dialog>
      <el-button type="primary" @click="showAddDialog()">添加分类</el-button>
      <el-table :data="catList" style="width: 98%" border row-key="cat_id">
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="等级" prop="cat_level">
          <template slot-scope="stData">
            <el-tag v-if="stData.row.cat_level===0">一级</el-tag>
            <el-tag v-else-if="stData.row.cat_level===1" type="success">二级</el-tag>
            <el-tag v-else type="danger">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editCate(info.row.cat_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="delCate(info.row.cat_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top:20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querycdt.pagenum"
          :page-sizes="[5,10,15]"
          :page-size="querycdt.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tot"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  created () {
    this.getCatlist()
  },
  data () {
    return {
      /** 添加分类1 */
      addDialog: false, // 控制弹框是否显示
      editDialog: false,
      // 表单对象部分，只有前3个是后端接口需要的，selectTwoCat放到该对象中以便可以做表单重置效果
      addForm: {
        cat_name: '', // 分类名称
        cat_pid: 0, // 分类父级id
        cat_level: 0, // 分类的等级(0/1/2)
        selectTwoCat: [] // 接收已经选取好的分类信息，是一个数组
      },
      editForm: {
        cat_name: '',
        cat_id: ''
      },
      // 表单校验
      addFormRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      },
      editFormRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      },
      // 可供选取的前两个级别分类的信息
      catListTwo: [],
      /** 添加分类2 */
      catList: [],
      tot: 0,
      querycdt: {
        type: '',
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示数据条数
      }
    }
  },
  methods: {
    // 修改分类名称
    editCate (id) {
      this.editForm.cat_id = id
      this.editDialog = true
    },
    async edit () {
      const { data: res } = await this.$http.put(
        `categories/${this.editForm.cat_id}`,
        { cat_name: this.editForm.cat_name }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getCatlist()
      this.editDialog = false
    },
    // 删除分类
    delCate (id) {
      this.$confirm('确定要删除该分类么?', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // axios调用api删除数据
          const { data: res } = await this.$http.delete(`categories/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功：消息提示、刷新数据
          this.$message.success(res.meta.msg)
          this.getCatlist()
        })
        .catch(() => {})
    },
    /** 添加分类1 */
    // 收集数据存储
    addCat () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          var { data: dt } = await this.$http.post('categories', this.addForm)
          // 成功提示
          this.$message.success(dt.meta.msg)
          // 隐藏弹框
          this.addDialog = false
          // 页面刷新
          this.getCatlist()
          // 重置之前设置过的分类信息
          this.addForm.cat_pid = 0
          this.addForm.cat_level = 0
          this.addForm.selectTwoCat = []
        }
      })
    },

    // 展示添加分类的弹框
    async showAddDialog () {
      // 获取可供选取的分类信息(前两个级别)
      var { data: dt } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      this.catListTwo = dt.data
      this.addDialog = true
    },

    // 上级分类变化的回调处理
    handleChange () {
      var twocats = this.addForm.selectTwoCat
      if (twocats.length === 2) {
        // 3级分类
        this.addForm.cat_pid = twocats[1]
        this.addForm.cat_level = 2
      } else if (twocats.length === 1) {
        // 2级分类
        this.addForm.cat_pid = twocats[0]
        this.addForm.cat_level = 1
      } else {
        // 1级分类
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    /** 添加分类2 */
    async getCatlist () {
      const { data: res } = await this.$http.get('categories', {
        params: this.querycdt
      })
      this.tot = res.data.total
      this.catList = res.data.result
    },
    handleSizeChange (val) {
      this.querycdt.pagesize = val
      this.getCatlist()
    },
    handleCurrentChange (val) {
      this.querycdt.pagenum = val
      this.getCatlist()
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.el-card {
  margin-top: 20px;
}
</style>
