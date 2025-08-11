<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-06-06 13:54:20
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-23 11:03:40
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">线条类型<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }"  :value="series.lineStyle.type" @change="changeValue($event, 'lineStyle.type')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">是否平滑<span>： </span></div>
      <DesDVSwitch v-model="series.smooth" @change="changeValue($event, 'smooth')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">线条宽度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.lineStyle.width" @change="changeValue($event, 'lineStyle.width')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">线条颜色<span>： </span></div>
      <DesDVMoreModeColor ref="DesDVMoreModeColor" :config="bothConfig" v-model="singleData" />
    </div>
  </div>
</template>
<script>
import mixin from "../mixin.js";

export default {
  name: "DesDVParallelSeries",
  mixins: [mixin],
  computed: {
    series() {
      return this.chart.series[0];
    },
    singleData: {
      get() {
        const colors = [];
        if (this.chart.singleData && this.chart.singleData.length) {
          this.chart.singleData.forEach((it) => {
            colors.push(dsf.dataview.utils.convertChartToCSSColor(it.itemStyle.color));
          });
        }
        return colors;
      },
      set(v) {
        let singleData = [];
        v.forEach((it) => {
          const color = dsf.dataview.utils.convertCSSToEChartsColor(it);
          singleData.push({
            itemStyle: {
              color,
            },
          });
        });
        this.series.data.forEach((it, index) => {
          it.itemStyle = singleData[index % singleData.length].itemStyle;
        });
        this.chart.singleData = singleData;
        this._updateChart();
      },
    },
  },
  data() {
    const colors = this.owner.chart.color;
    return {
      colors: [],
      bothConfig: {
        colors: colors,
        type: "both",
      },
      dictionary: [
        {
          text: "实线",
          value: "solid",
        },
        {
          text: "虚线",
          value: "dashed",
        },
        {
          text: "点线",
          value: "dotted",
        },
      ],
    };
  },

  methods: {
    
    changeValue(val, props) {
      this.chart.series.forEach((it) => {
        const keys = props.split(".");
        let item = it;
        while (keys.length > 1) {
          const key = keys.shift();
          item = item[key];
        }
        item[keys[0]] = val;
      });
      this._updateChart();
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
