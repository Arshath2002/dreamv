<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-10-12 14:41:38
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-28 10:30:41
-->
<template>
  <el-select v-model="dataValue" :multiple="true" style="width: 100%" placeholder="请选择">
    <el-option v-for="(option, $index) in fontList" :key="$index" :label="option.text" :value="option.value"></el-option>
  </el-select>
</template>
<script>
export default {
  name: "PropertyFontList",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    dataValue: {
      get() {
        return this.value.map((it) => it.value);
      },
      set(v) {
        const value = this.fontList.filter((it) => v.find((_) => it.value == _));
        this.$emit("input", value);
        this.$emit("change", value);
      },
    },
  },
  data() {
    return {
      fontList:  dsf.dataview.designer.fonts,
    };
  },
};
</script>
