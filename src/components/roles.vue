<template>
  <div>
    <!-- 角色分配 -->
    <el-dialog title="角色分配" :visible.sync="RoledisDialog" width="30%">
      <el-tree
        :data="RoledisList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="idList"
        :props="defaultProps"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RoledisDialog = false">取 消</el-button>
        <el-button type="primary" @click="Roledis()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialog"
      width="30%"
      @close="$refs.addRolesRef.resetFields()"
    >
      <el-form :rules="addRolesRules" ref="addRolesRef" :model="addRoles" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addR()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="EditRolesDialog"
      width="30%"
      @close="$refs.EditRef.resetFields()"
    >
      <el-form :rules="EditRules" ref="EditRef" :model="Edit" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="Edit.roleName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="Edit.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="Editr()">确 定</el-button>
      </span>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRolesDialog=true">添加角色</el-button>
      <el-table :data="Roleslist" style="width:97%" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row v-for="item in props.row.children" :key="item.id">
                <el-col :span="5">
                  <el-tag
                    closable
                    type="primary"
                    @close="handleClose(props.row.id,item.id)"
                  >{{item.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="item2 in item.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag
                        closable
                        type="success"
                        @close="handleClose(props.row.id,item2.id)"
                      >{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        closable
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        @close="handleClose(props.row.id,item3.id)"
                      >{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="90"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="info">
            <el-button
              size="mini"
              type="primary"
              @click="showEditDialog(info.row.id)"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="delRole(info.row.id)"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              @click="showRoledisDialog(info.row.children,info.row.id)"
              icon="el-icon-setting"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  created () {
    this.getRolesList()
  },
  data () {
    return {
      roleid: '',
      idList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      RoledisList: [],
      RoledisDialog: false,
      addRolesDialog: false,
      addRoles: {
        roleName: '',
        roleDesc: ''
      },
      addRolesRules: {
        rolesname: [{ required: true, message: '角色名必填', trigger: 'blur' }],
        rolesdec: [{ required: true, message: '描述必填', trigger: 'blur' }]
      },
      EditRolesDialog: false,
      Edit: {
        roleName: '',
        roleDesc: ''
      },
      EditRules: {
        rolesname: [{ required: true, message: '角色名必填', trigger: 'blur' }],
        rolesdec: [{ required: true, message: '描述必填', trigger: 'blur' }]
      },
      tableData: [
        {
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }
      ],
      Roleslist: []
    }
  },
  methods: {
    async handleClose (roleId, rightsId) {
      const { data: res } = await this.$http.delete(
        `roles/${roleId}/rights/${rightsId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
    async Roledis () {
      const { data: res } = await this.$http.post(
        `roles/${this.roleid}/rights`,
        {
          rids: this.$refs.tree
            .getCheckedKeys()
            .concat(this.$refs.tree.getHalfCheckedKeys())
            .join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.RoledisDialog = false
    },
    async showRoledisDialog (obj, id) {
      // 显示对话框
      this.roleid = id
      this.RoledisDialog = true
      // 根据id获得被修改用户的信息
      const { data: res } = await this.$http.get(`rights/tree`)
      console.log(obj)
      this.idList = []
      for (let i = 0; i < obj.length; i++) {
        for (let a = 0; a < obj[i].children.length; a++) {
          for (let b = 0; b < obj[i].children[a].children.length; b++) {
            this.idList.push(obj[i].children[a].children[b].id)
          }
        }
      }
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得到的用户信息 赋予 给editForm表单数据对象
      this.RoledisList = res.data
    },
    async getRolesList () {
      // axios获得用于使用的数据列表
      const { data: dt } = await this.$http.get('roles')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.Roleslist = dt.data
    },
    addR () {
      this.$refs.addRolesRef.validate(async valid => {
        if (valid === true) {
          const { data: res } = await this.$http.post('roles', this.addRoles)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.addRolesDialog = false
          this.$message.success(res.meta.msg)
          this.getRolesList()
        }
      })
    },
    delRole (id) {
      this.$confirm('确定要删除该用户么?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // axios调用api删除数据
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功：消息提示、刷新数据
          this.$message.success(res.meta.msg)
          this.getRolesList()
        })
        .catch(() => {})
    },
    async showEditDialog (id) {
      // 显示对话框
      this.EditRolesDialog = true
      // 根据id获得被修改用户的信息
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得到的用户信息 赋予 给editForm表单数据对象
      this.Edit = res.data
    },
    Editr () {
      this.$refs.EditRef.validate(async valid => {
        if (valid === true) {
          const { data: res } = await this.$http.post('roles', this.Edit)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.EditRolesDialog = false
          this.$message.success(res.meta.msg)
          this.getRolesList()
        }
      })
    }
  }
}
</script>
<style lang="less">
.el-table {
  margin-top: 20px;
}
.el-breadcrumb {
  margin-bottom: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-card__body {
  width: 100%;
  overflow: auto;
}
.el-row {
  border-bottom: 1px solid rgb(235, 238, 245);
  text-align: center;
  vertical-align: middle;
  align-items: center;
  display: flex;
  &:first-of-type {
    border-top: 1px solid rgb(235, 238, 245);
  }
  .el-row {
    height: 60px;
    text-align: left;
    &:last-of-type {
      border: none;
    }
    &:first-of-type {
      border-top: none;
    }
  }
}
.el-tag {
  margin-right: 10px;
  font-size: 12px;
}
.el-icon-caret-right {
  font-size: 12px;
}
</style>
