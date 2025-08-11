<!--
 * @Description: 公用提示组件
 * @Author: shenah
 * @Date: 2024-04-26 17:34:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:55:58
-->



<template>
  <el-tooltip effect="light" placement="bottom" popper-class="dsf-tool-tips-icon">
    <div slot="content">
      <div v-html="dsf.safe.xss(data.desc)"></div>
    </div>
    <DsfIcon
      :class="[descStriking && 'desc-striking']"
      style="margin-left: 5px; cursor: pointer"
      name="bangzhuzhongxin"
    ></DsfIcon>
  </el-tooltip>
</template>
<script>
import propertyMixin from "./propertyMixin";
export default {
  name: "DesDVToolTipsIcon",
  mixins: [propertyMixin],
  props: {
    config: {
      type: Object,
    },
    data: {
      type: Object,
    },
    descStriking: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultConfig: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {},
};
</script>
<style lang="scss">
</style>