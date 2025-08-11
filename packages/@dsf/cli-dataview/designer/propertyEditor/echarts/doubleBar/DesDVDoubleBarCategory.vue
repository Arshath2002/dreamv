<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-07 09:43:04
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:36:37
-->
<template>
  <div style="width: 100%" class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">字体样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">第1条轴线<span>： </span></div>
      <DesDVColorPicker v-model="getCategory[0].axisLine.lineStyle.color" :config="colorConfig" @change="changeValue($event, getCategory[0].axisLine.lineStyle, 'color')"></DesDVColorPicker>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">第2条轴线<span>： </span></div>
      <DesDVColorPicker v-model="getCategory[1].axisLine.lineStyle.color" :config="colorConfig" @change="changeValue($event, getCategory[1].axisLine.lineStyle, 'color')"></DesDVColorPicker>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";

export default {
  name: "DesDVDoubleBarCategory",
  mixins: [mixin, commonMixin],
  computed: {
    getCategory() {
      return this.chart.xAxis[0].type === "category" ? this.chart.xAxis : this.chart.yAxis;
    },
    axisLabel() {
      return this.owner.barDirection == "topDown" ? this.getCategory[0].axisLabel : this.getCategory[1].axisLabel;
    },
    nameTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.axisLabel;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.axisLabel, v);
        this._updateChart();
      },
    },
  },
  data() {
    return {
      colorConfig: {
        type: "color",
      },
    };
  },
  methods: {
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this._updateChart();
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
