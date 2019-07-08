<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 编辑商品的对话框 -->
      <el-dialog
        title="修改商品"
        :visible.sync="editGoodsDialog"
        width="50%"
        @close="$refs.editGoodsRef.resetFields()"
      >
        <el-form :rules="editGoodsRules" ref="editGoodsRef" :model="editGoods" label-width="80px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editGoods.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editGoods.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editGoods.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editGoods.goods_weight"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsDialog = false">取 消</el-button>
          <el-button type="primary" @click="EditGoods()">确 定</el-button>
        </span>
      </el-dialog>

      <div class="text item">
        <div style="margin-bottom: 15px;" class="el-row">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            clearable
            @clear="getGoodsList()"
            @keyup.enter.native="getGoodsList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
          </el-input>
          <el-button type="primary" @click="$router.push('goodsadd')">添加商品</el-button>
        </div>
        <el-table :data="goodsList" border stripe style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格（元）" width="120"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="120"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="info">
              <el-button
                size="mini"
                type="primary"
                @click="showEditDialog(info.row.goods_id)"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                @click="delGoods(info.row.goods_id)"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top:20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querycdt.pagenum"
          :page-sizes="[5, 10,15,20]"
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
    this.getGoodsList()
  },
  data () {
    return {
      // 修改商品数据
      editGoods: {},
      editGoodsDialog: false,
      editGoodsRules: {
        goods_name: [
          { required: true, message: '商品名称必填', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格必填', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量必填', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量必填', trigger: 'blur' }
        ]
      },
      goodsList: [],
      // 查询数据条件
      tot: 0,
      querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示数据条数
      }
    }
  },
  methods: {
    // 根据ID删除商品
    delGoods (id) {
      this.$confirm('确定要删除该商品么?', '删除商品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // axios调用api删除数据
          const { data: res } = await this.$http.delete('goods/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功：消息提示、刷新数据
          this.$message.success(res.meta.msg)
          this.getGoodsList()
        })
        .catch(() => {})
    },
    // 根据ID查询产品
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editGoods = res.data
      this.editGoodsDialog = true
    },
    EditGoods () {
      this.$refs.editGoodsRef.validate(async valid => {
        if (valid) {
          // 校验成功处理， 收集数据存储入库
          const { data: res } = await this.$http.put(
            'goods/' + this.editGoods.goods_id,
            this.editGoods
          )
          // 修改失败提示
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 修改成功：关闭对话框、成功提示、页面数据更新
          console.log(res)
          this.editGoodsDialog = false
          this.$message.success(res.meta.msg)
          this.getGoodsList()
        }
      })
    },
    tianjia () {
      this.$refs.addUserRef.validate(async valid => {
        if (valid === true) {
          const { data: res } = await this.$http.post('users', this.addUser)
          if (res.meta.status !== 201) {
            console.log(res)
            return this.$message.error(res.meta.msg)
          }
          this.addUserDialog = false
          this.$message.success(res.meta.msg)
          this.getUserList()
        }
      })
    },
    // 获取商品列表
    async getGoodsList () {
      const { data: dt } = await this.$http.get('goods', {
        params: this.querycdt
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tot = dt.data.total
      this.goodsList = dt.data.goods
    },
    handleSizeChange (val) {
      this.querycdt.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.querycdt.pagenum = val
      this.getGoodsList()
    }
  }
}
</script>
<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 0;
}

.box-card {
  width: 100%;
}
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-input {
  width: 30%;
  margin-right: 20px;
}
.el-dialog__body .el-input {
  width: 100%;
}
</style>
