<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-06-26 16:25:04
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-06-26 17:08:06
-->
<template>
  <el-form ref="form" label-width="60px" :model="form" :rules="rules">
    <el-form-item label="宽" prop="width">
      <el-input v-model="form.width" type="text" style="width: 250px" />
      &nbsp;&nbsp;{{ unit }}
    </el-form-item>
    <el-form-item label="高" prop="height">
      <el-input v-model="form.height" type="text" style="width: 250px" />
      &nbsp;&nbsp;{{ unit }}
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    width: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
    unit: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        width: this.width,
        height: this.height,
      },
      rules: {
        width: [
          { required: true, message: "宽度不能为空", trigger: "blur" },
          { type: "string", pattern: /^[1-9]\d*(\.[0-9]+)?$/, message: "格式不符合规范", trigger: "blur" },
        ],
        height: [
          { required: true, message: "高度不能为空", trigger: "blur" },
          { type: "string", pattern: /^[1-9]\d*(\.[0-9]+)?$/, message: "格式不符合规范", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    validated() {
      console.log("触发");
    },
    yes() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            return resolve(this.form);
          } else {
            return resolve(null);
          }
        });
      });
    },
  },
};
</script>
