<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item class="first">
        <el-radio-group v-model="form.resource">
          <el-radio label="药品"></el-radio>
          <el-radio label="耗材"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="form.region" placeholder="选择区县">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="form.region2" placeholder="医药机构名称">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-input v-model="form.name" placeholder="机构项目名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-input v-model="form.name2" placeholder="医保项目名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-date-picker
              type="date"
              placeholder="开始日期"
              v-model="form.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-date-picker
              type="date"
              placeholder="结束日期"
              v-model="form.date2"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="warning" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="warning">导出明细</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  form = {
    name: "",
    name2: "",
    region: "",
    region2: "",
    date1: "",
    date2: "",
    delivery: false,
    type: [],
    resource: "",
    desc: ""
  };
  onSubmit() {
    console.log(this.form, "submit!");
  }
  resetForm(formName:String) {
    console.log(this.$refs[`${formName}`], "========");
    this.$data[`${formName}`] = {
      name: "",
      name2: "",
      region: "",
      region2: "",
      date1: "",
      date2: "",
      delivery: false,
      type: [],
      resource: "",
      desc: ""
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.first {
  text-align: left;
}
.second {
  display: flex;
}
</style>
