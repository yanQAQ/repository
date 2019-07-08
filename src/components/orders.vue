<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 物流显示 -->
      <el-dialog title="物流信息" :visible.sync="showDialog" width="50%">
        <el-steps direction="vertical" :active="0">
          <div v-for="item in logInfo" :key="item.id">
            <el-step :title="item.time" :description="item.context"></el-step>
          </div>
        </el-steps>
      </el-dialog>
      <!-- 修改订单信息 -->
      <el-dialog title="订单信息修改" :visible.sync="orderDialog" width="50%">
        <div class="edit">
          <span>是否发货：</span>
          <el-radio v-model="radio" label="1">已发货</el-radio>
          <el-radio v-model="radio" label="0">未发货</el-radio>
        </div>
        <div class="edit">
          <span>是否付款：</span>
          <el-radio v-model="radio2" label="1" disabled>已付款</el-radio>
          <el-radio v-model="radio2" label="0" disabled>未付款</el-radio>
        </div>
        <div class="edit">
          <span>支付方式：</span>
          <el-radio v-model="orderPay" label="0">未支付</el-radio>
          <el-radio v-model="orderPay" label="1">支付宝</el-radio>
          <el-radio v-model="orderPay" label="2">微信</el-radio>
          <el-radio v-model="orderPay" label="3">银行卡</el-radio>
        </div>
        <div class="edit">
          <span>订单价格&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-input-number v-model="price" :min="1" :max="1000" label="描述文字" size="mini"></el-input-number>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="orderDialog = false">取 消</el-button>
          <el-button type="primary" @click="orderEdit()">确 定</el-button>
        </span>
      </el-dialog>
      <!--  -->
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
                @click="showEditDialog(info.row.order_id)"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                @click="showlog(info.row.order_id)"
                icon="el-icon-location"
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
      orderPay: '',
      price: '',
      radio: '',
      radio2: '',
      orderId: '',
      orderDialog: false,
      showDialog: false,
      OrdersList: [],
      logInfo: [],
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
    async showlog (id) {
      const { data: res } = await this.$http.get('/kuaidi/' + undefined)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.logInfo = res.data
      this.showDialog = true
    },
    // 修改订单
    async showEditDialog (id) {
      this.orderDialog = true
      this.orderId = id
      const { data: res } = await this.$http.get(`orders/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      if (res.data.is_send === '否') {
        this.radio = '0'
      } else {
        this.radio = '1'
      }
      this.price = res.data.order_price
      this.radio2 = res.data.pay_status
      this.orderPay = res.data.order_pay
    },
    async orderEdit () {
      console.log(this.orderId)
      const { data: res } = await this.$http.put(`orders/${+this.orderId}`, {
        is_send: this.radio,
        pay_status: this.radio2,
        order_price: this.price,
        order_pay: this.orderPay
      })
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getOrdersList()
      this.orderDialog = false
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
.edit {
  padding: 20px 10px;
  span {
    margin-right: 10px;
  }
}
</style>
