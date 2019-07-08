<template>
  <div id="login-container">
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/img/logo.png" alt />
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <i class="el-icon-user"></i>
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <i class="el-icon-lock"></i>
          <el-input v-model="loginForm.password" show-password></el-input>
        </el-form-item>
        <el-row>
          <el-col id="right">
            <el-button type="primary" @click="login()">登录</el-button>
            <el-button type="info" @click="$refs.loginFormRef.resetFields()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // valid===true 校验ok
        // valid===false 校验失败
        if (valid) {
          // 把用户名和密码交给axios，之后去服务器端做真实性校验
          // var {data:dt} 对象结构赋值重命名操作
          var { data: dt } = await this.$http.post('login', this.loginForm)

          // 登录失败判断
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }

          // 存储token到sessionStorage里边
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          window.sessionStorage.setItem('token', dt.data.token)
          // 页面跳转
          this.$router.push('/home')
        }
      })
    }
  },
  data () {
    return {
      // 用户登录表单数据对象(用户名、密码)
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 给 各个表单域 定义校验规则
      loginFormRules: {
        username: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="less">
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      input.el-input__inner {
        padding: 0px 40px;
      }
      .el-icon-user {
        font-size: 20px;
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 2;
      }
      .el-icon-lock {
        font-size: 20px;
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 2;
      }
    }
    #logo-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  #right {
    text-align: right;
  }
}
</style>
