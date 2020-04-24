<template>
  <div class="login">
    <div class="login-card">
      <el-card shadow="hover" class="card">
        <img class="avatar" :src="circleUrl" />
        <el-form
          ref="form"
          :rules="formRules"
          label-position="left"
          :model="form"
          label-width="0px"
        >
          <el-form-item prop="name">
            <el-input placeholder="手机号/邮箱/用户名" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item class="mb" prop="password">
            <el-input placeholder="密码" v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label class="xieyi">
            <el-checkbox v-model="checked" class="checkbox">下次自动登录</el-checkbox>
          </el-form-item>
          <el-form-item class="btn">
            <div class="dl">
              <el-button type="primary" native-type="submit" size="medium" @click="login">登录</el-button>
            </div>
            <!-- <div>
              <el-button size="medium">立即注册</el-button>
            </div>-->
          </el-form-item>
          <el-form-item class="btn">
            <el-link type="primary" class="left" :underline="false">忘记密码？</el-link>
            <el-link type="primary" class="right" :underline="false">短信快捷登录</el-link>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Login extends Vue {
  circleUrl =
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
  form = {
    name: "",
    password: ""
  };
  checked = true;
  formRules = {
    name: [
      { required: true, message: "请输入手机号/邮箱/用户名", trigger: "blur" }
    ],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }]
  };
  login() {
    this.$refs["form"].validate(valid => {
      if (valid) {
        console.log("发起请求");
        Cookies.set("token", "asdf123456", { expires: 7 });
        Cookies.set("account", `${this.form.name}`, { expires: 7 });
        this.$router.push("/nav");
      } else {
        alert("请输入正确的用户名或者密码");
      }
    });
  }
  created() {
    const token = Cookies.get("token");
    token && this.$router.push("/nav");
  }
}
</script>
<style lang='less' scoped>
.login {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  transform: translateY(-50%);
  transform: translateX(-50%);
}
.login-card {
  width: 350px;
}
.xieyi {
  text-align: left;
  margin-bottom: 5px;
  .checkbox {
    font-size: 12px !important;
    line-height: 12px;
  }
}
.btn {
  margin-bottom: 5px;
  .el-button {
    width: 100%;
  }
}
.card {
  padding: 0px 20px;
}
.avatar {
  margin-bottom: 20px;
  width: 60px;
}
.mb {
  margin-bottom: 5px;
}
.left {
  float: left;
  font-size: 12px;
}
.right {
  float: right;
  font-size: 12px;
}
// .dl {
//   margin-bottom: 10px;
// }
</style>