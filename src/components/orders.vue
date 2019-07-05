<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="text item">
        <div style="margin-bottom: 15px;" class="el-row">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            clearable
            @clear="getOrdersList()"
            @keyup.enter.native="getOrdersList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList()"></el-button>
          </el-input>
        </div>
        <el-table :data="OrdersList" border stripe style="width: 100%">
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="order_number" label="订单编号"></el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
          <el-table-column prop="pay_status" label="是否付款" width="120">
            <template slot-scope="info">
              <el-tag type="danger" v-if="+info.row.pay_status===0">未付款</el-tag>
              <el-tag type="success" v-if="+info.row.pay_status===1">已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" width="120"></el-table-column>
          <el-table-column prop="create_time" label="下单时间" width="180"></el-table-column>
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
    this.getOrdersList()
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
      OrdersList: [],
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
    // 根据订单查询物流
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editGoods = res.data
      this.editGoodsDialog = true
    },
    // 修改订单
    EditOrders () {
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
          this.getOrdersList()
        }
      })
    },
    // 获取订单列表
    async getOrdersList () {
      const { data: dt } = await this.$http.get('orders', {
        params: this.querycdt
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tot = dt.data.total
      this.OrdersList = dt.data.goods
    },
    handleSizeChange (val) {
      this.querycdt.pagesize = val
      this.getOrdersList()
    },
    handleCurrentChange (val) {
      this.querycdt.pagenum = val
      this.getOrdersList()
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
