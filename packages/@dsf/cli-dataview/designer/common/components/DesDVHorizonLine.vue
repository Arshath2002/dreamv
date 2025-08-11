<!--
 * @Description: 一根线
 * @Author: shenah
 * @Date: 2024-03-27 16:11:09
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 13:47:13
-->


<template>
  <div class="data-view-ds-one-line" :style="oneLineStyle"></div>
</template>
<script>
import propertyMixin from "./propertyMixin";
export default {
  name: "DesDVHorizonLine",
  mixins: [propertyMixin],
  props: {
    config: {
      type: Object,
    },
  },
  data() {
    return {
      defaultConfig: {
        space: 30, // 间距值
        spacingNumber: 1, // 间距份数
      },
    };
  },
  computed: {
    oneLineStyle() {
      let style = {
        marginLeft: `${this.calcSpace()}px`,
      };
      return style;
    },
  },
  watch: {},
  created() {},
  methods: {
    calcSpace() {
      return this.currentConfig.space * this.currentConfig.spacingNumber || 0;
    },
  },
};
</script>
<style lang="scss">
// 属性组件:一根线
.data-view-ds-one-line {
  width: 100%;
  height: 1px;
  background-color: var(--dv-des-input-border,#eee);
  box-sizing: border-box;
}
</style>