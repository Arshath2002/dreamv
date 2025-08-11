<!--
 * @Description: dsfDesignerDialog样式一模一样
 * 1.因为不需要传入很多不必要的参数还有等一些功能所以提取出来
 * @Author: shenah
 * @Date: 2024-12-26 10:35:23
 * @LastEditors: shenah
 * @LastEditTime: 2024-12-26 11:07:37
-->

<template>
  <div
    @click="clickHandler"
    class="data-view-dialog-btn"
  >
    <div class="text">
      <el-badge :is-dot="!!hasValue" type="primary" class="common-property-badge button-badge">
        {{currentConfig.buttonText}}
      </el-badge>
    </div>
    <i
      class="dialog-icon el-icon-s-tools"
      :style="{ color: !!hasValue ? 'var(--t--normal)' : 'inherit' }"
    >
    </i>
  </div>
</template>
<script>
import propertyMixin from "./propertyMixin.js";
export default {
  name: "dsfButtonDialog",
  components: {},
  mixins: [propertyMixin],
  props: {
    value: {
      type: Object,
    },
    config: {
      type: Object,
    },
    hasValue: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultConfig: {
        buttonText: "设置",
      },
      currentData: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initData();
  },
  methods: {
    initData() {},
    clickHandler() {
      this.$emit("click");
    },
  },
};
</script>
<style lang="scss">
</style>
