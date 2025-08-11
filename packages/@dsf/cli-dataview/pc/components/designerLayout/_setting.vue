<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-03-19 10:02:30
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-03-19 11:06:53
-->
<template>
  <el-form ref="form" label-width="120px">
    <el-form-item label="层级事件穿透">
      <el-switch :value="penetrate" @change="change"></el-switch>
    </el-form-item>
    <el-form-item label="内容超出展示">
      <el-radio-group :value="overflow" @input="input">
        <el-radio :label="'hidden'">隐藏</el-radio>
        <el-radio :label="'auto'">滚动</el-radio>
        <el-radio :label="'visible'">全显</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    form: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      penetrate: false,
      overflow: "hidden",
    };
  },
  created() {
    this.penetrate = this.form.penetrate
    this.overflow = this.form.overflow
  },
  methods: {
    change(v) {
      this.penetrate = v;
      this.form.penetrate = v;
    },
    input(v) {
      this.overflow = v;
      this.form.overflow = v;
    },
  },
};
</script>
