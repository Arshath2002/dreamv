<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-07 13:54:36
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-12 18:36:53
-->
<template>
  <div style="width: 100%">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体颜色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" v-model="itemColor" @change="changeColor($event, series.itemStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体宽度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.barWidth" @change="changeValue($event, series, 'barWidth')" />
    </div>
  </div>
</template>
<script>

import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "seriesItem",
  mixins: [commonMixin],
  inject: ["owner"],
  props: {
    series: {
      type: Object,
      require: true,
    },
  },

  data() {
    return {
      itemColor: "",
      colorConfig: {
        type: "color",
      },
      bothConfig: {
        type: "both",
      },
    };
  },
  computed: {
    nameTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.series.label;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.series.label, v);
        this.$emit("updateChart");
      },
    },
  },
  created() {
    this.styleChange();
    dsf.emit.$on("updateStyleChange", this.styleChange, this.owner.$children[0]);
  },
  beforeDestroy() {
    dsf.emit.$remove("updateStyleChange", this.owner.$children[0]);
  },
  methods: {
    styleChange() {
      const itemColor = this.series.itemStyle.color;
      this.itemColor = dsf.dataview.utils.convertChartToCSSColor(itemColor);
    },
    changeColor(val, item, key) {
      const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      if (!_.isEqual(item[key], color)) {
        this.$set(item, key, color);
        this.$emit("updateChart");
      }
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
  },
};
</script>
