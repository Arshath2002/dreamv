<!--
 * @Description: 属性公用dv_select提取成公用
 * @Author: shenah
 * @Date: 2024-04-11 10:37:23
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:05:56
-->

<template>
  <el-select
    v-model="currentData"
    :multiple="currentConfig.multiple"
    :popper-append-to-body="true"
    :disabled="disabled"
    placeholder="请选择"
    @change="changeValue"
    class="data-view-select"
    :size="currentConfig.size"
  >
    <el-option v-for="(option, $index) in dictionary" :key="$index" :label="option[fieldMap.text]" :value="option[fieldMap.value]"></el-option>
  </el-select>
</template>
<script>
import propertyMixin from "./propertyMixin.js";
export default {
  name: "DesDVSelect",
  components: {},
  mixins: [propertyMixin],
  props: {
    value: {
      type: [Object, String, Number],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fieldMap: {
      type: Object,
      default: () => ({
        text: "text",
        value: "value",
      }),
    },
  },
  data() {
    return {
      defaultConfig: {
        multiple: false,
        size: undefined,
      },
      currentData: null,
    };
  },
  computed: {
    dictionary() {
      return this.data.dictionary;
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.currentData = this.value;
    },
    changeValue(val) {
      this.currentData = val;
      this.$emit("change", val);
      this.$emit("input", val);
    },
  },
};
</script>
<style lang="scss"></style>
