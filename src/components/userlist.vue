<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-dialog
        title="添加用户"
        :visible.sync="addUserDialog"
        width="30%"
        @close="$refs.addUserRef.resetFields()"
      >
        <el-form :rules="addUserRules" ref="addUserRef" :model="addUser" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUser.password"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addUser.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUser.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="tianjia()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改用户"
        :visible.sync="editUserDialog"
        width="50%"
        @close="$refs.editUserRef.resetFields()"
      >
        <el-form :rules="editUserRules" ref="editUserRef" :model="editUser" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUser.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editUser.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="xiugai()">确 定</el-button>
        </span>
      </el-dialog>
      <div class="text item">
        <div style="margin-bottom: 15px;" class="el-row">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            clearable
            @clear="getUserList()"
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </div>
        <el-table :data="userList" border stripe style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="mobile" label="手机号码" width="150"></el-table-column>
          <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
          <el-table-column prop="mg_state" label="状态" width="80">
            <el-switch
              v-model="info.row.mg_state"
              slot-scope="info"
              @change="changeState(info.row, info.row.mg_state)"
            ></el-switch>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="info">
              <el-button
                size="mini"
                type="primary"
                @click="showEditDialog(info.row.id)"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                @click="delUser(info.row.id)"
                icon="el-icon-delete"
              ></el-button>
              <el-tooltip content="分配角色" placement="top" :enterable="false">
                <el-button
                  size="mini"
                  type="warning"
                  @click="set(scope.$index, scope.row)"
                  icon="el-icon-setting"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top:20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querycdt.pagenum"
          :page-sizes="[2, 5,10,15]"
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
    this.getUserList()
  },
  data () {
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则：1开始,后接3|5|8|9|7,再后边跟9位数字
      // 正则表达式校验
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败(请给页面提示错误信息)
        return callback(new Error('手机号码格式不正确'))
      }
      // 校验成功，继续执行
      callback()
    }
    return {
      editUserDialog: false,
      // form表单需要的数据
      editUser: {
        username: '',
        email: '',
        mobile: ''
      },
      // 制作表单域校验的规则
      editUserRules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // 自定义校验手机号码规则
          // { validator: 校验函数, trigger: 'blur' }
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // 自定义校验手机号码规则
          // { validator: 校验函数, trigger: 'blur' }
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addUserDialog: false,
      userList: [],
      // 查询数据条件
      tot: 0,
      querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 2 // 每页显示数据条数
      }
    }
  },
  methods: {
    async changeState (user, state) {
      const { data: dt } = await this.$http.put(
        `users/${user.id}/state/${state}`
      )
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    },
    xiugai () {
      // 校验表单
      this.$refs.editUserRef.validate(async valid => {
        if (valid) {
          // 校验成功处理， 收集数据存储入库
          const { data: res } = await this.$http.put(
            'users/' + this.editUser.id,
            this.editUser
          )
          // 修改失败提示
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 修改成功：关闭对话框、成功提示、页面数据更新
          this.editUserDialog = false
          this.$message.success(res.meta.msg)
          this.getUserList()
        }
      })
    },
    async showEditDialog (id) {
      // 显示对话框
      this.editUserDialog = true
      // 根据id获得被修改用户的信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得到的用户信息 赋予 给editForm表单数据对象
      this.editUser = res.data
    },
    delUser (id) {
      this.$confirm('确定要删除该用户么?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // axios调用api删除数据
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功：消息提示、刷新数据
          this.$message.success(res.meta.msg)
          this.getUserList()
        })
        .catch(() => {})
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
    async getUserList () {
      // axios获得用于使用的数据列表
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tot = dt.data.total
      this.userList = dt.data.users // 把获取好的用户列表数据存储给userList成员
    },
    handleSizeChange (val) {
      this.querycdt.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.querycdt.pagenum = val
      this.getUserList()
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
