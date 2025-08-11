<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-06-13 14:06:24
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 14:06:24
-->
<template>
  <div class="dataview-chart-color-single-wrapper">
    <el-color-picker 
      size="small" 
      v-model="pikColor" 
      @change="handleChange" 
      show-alpha
    ></el-color-picker>
    <!-- <span class="el-color-picker-title">{{ value }}</span> -->
  </div>
</template>
<script>
export default {
  name: "colorSingle",
  props: {
    value: {
      type: String,
      default: '#333333'
    }
  },
  computed:{
    pikColor: {
      get() {
        return this.value;
      },
      set() {
        
      }  
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value);
      this.$emit('change', value);
    }
  },
  
};
</script>
