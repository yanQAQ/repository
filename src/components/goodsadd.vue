<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="添加商品详情" type="info" center show-icon></el-alert>
      <el-steps :active="Number(activeName)" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px">
        <el-tabs
          v-model="activeName"
          tab-position="left"
          :before-leave="tabsBeforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_number">
              <el-cascader
                v-model="addForm.selectThreeCat"
                :options="catList"
                :props="{expandTrigger: 'hover',value:'cat_id',label:'cat_name'}"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="动态参数" name="1">
            <el-form-item v-for="item in manyParamList" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals_arr">
                <el-checkbox v-for="item2 in item.attr_vals_arr" :key="item2" :label="item2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="2">
            <el-form-item
              v-for="item in onlyParamList"
              :key="item.attr_id"
              :label="item.attr_name"
              label-width="150px"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:11333/api/private/v1/upload"
              :on-remove="uploadRemove"
              :on-success="uploadSuccess"
              list-type="picture"
              :headers="uploadHeaders"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quillEditor v-model="addForm.goods_introduce" ref="myQuillEditor"></quillEditor>
            <el-button type="primary" @click="addGoods()">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  created () {
    this.getCatList()
  },
  data () {
    return {
      // 设置请求头信息
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 表单数据对象
      onlyParamList: [],
      manyParamList: [],
      catList: [],
      // 接收选取好的第3级别分类的id信息
      selectCatId: 0,
      // 表单校验
      // 侧边栏 和 steps进度条 激活设定
      activeName: '0',
      /** 添加商品相关1 */
      // 表单数据对象
      addForm: {
        goods_cat: '', // 商品3级分类的全部id信息
        attrs: [], // 属性信息
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        selectThreeCat: [],
        pics: [],
        goods_introduce: ''
      },
      // 表单校验
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        selectThreeCat: [
          { required: true, message: '商品分类必选', trigger: 'change' }
        ]
      }
      /** 添加商品相关2 */
    }
  },
  components: {
    // 富文本编辑器组件
    quillEditor
  },
  methods: {
    addGoods () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 制作动态参数
          this.manyParamList.forEach(item => {
            var o = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals_arr.join(' ')
            }
            this.addForm.attrs.push(o)
          })
          // 静态参数
          this.onlyParamList.forEach(item2 => {
            var o2 = { attr_id: item2.attr_id, attr_value: item2.attr_vals }
            this.addForm.attrs.push(o2)
          })

          var { data: dt } = await this.$http.post('goods', this.addForm)
          this.$message.success(dt.meta.msg)
          this.$router.push('/goods')
        }
      })
    },
    // 删除图片回调处理
    uploadRemove (nowfile) {
      var i = this.addForm.pics.findIndex(v => {
        return v.pic === nowfile.response.data.tmp_path
      })
      this.addForm.pics.splice(i, 1)
    },
    // 图片上传成功的回调处理
    uploadSuccess (result) {
      var o = { pic: result.data.tmp_path }
      this.addForm.pics.push(o)
    },
    async tabClick () {
      if (this.activeName === '1') {
        var { data: dt } = await this.$http.get(
          'categories/' + this.selectCatId + '/attributes',
          { params: { sel: 'many' } }
        )
        dt.data.forEach(v => {
          v.attr_vals_arr = v.attr_vals.split(' ')
        })
        this.manyParamList = dt.data
      } else if (this.activeName === '2') {
        // 获取静态参数信息
        var { data: dt2 } = await this.$http.get(
          'categories/' + this.selectCatId + '/attributes',
          { params: { sel: 'only' } }
        )

        this.onlyParamList = dt2.data
      }
    },
    tabsBeforeLeave () {
      if (this.selectCatId === 0) {
        this.$message.error('请选取第3级别分类！')
        return false // 停止切换操作
      }
    },
    // 级联选取器 选取项目后的回调处理
    handleChange () {
      var len = this.addForm.selectThreeCat.length
      // 判断如果选取第3级别分类，就把其id值赋予给selectCatId
      if (len === 3) {
        this.selectCatId = this.addForm.selectThreeCat[2]
        this.addForm.goods_cat = this.addForm.selectThreeCat.join(',')
      } else {
        this.selectCatId = 0
        this.addForm.goods_cat = ''
      }
    },
    // 获取级联选取器对应的商品分类信息
    async getCatList () {
      var { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      this.catList = dt.data
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.el-steps,
.el-tabs {
  margin-top: 20px;
}
</style>
