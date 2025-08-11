<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-30 16:31:28
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:34:01
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">相对位移X<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.center[0] | valueFilter" @change="changeValue($event + '%', series.center, 0)"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name">Y<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.center[1] | valueFilter" @change="changeValue($event + '%', series.center, 1)"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name">外环<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.radius[1] | valueFilter" @change="changeValue($event + '%', series.radius, 1)"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">内环<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.radius[0] | valueFilter" @change="changeValue($event + '%', series.radius, 0)"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">排列<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: clockwiseOptions }" v-model="series.clockwise" @change="changeValue($event, series, 'clockwise')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">节点点击<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }"  v-model="series.nodeClick" @change="changeValue($event, series, 'nodeClick')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">起始角度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'deg' }" :value="series.startAngle" @change="changeValue($event, series, 'startAngle')"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">边框宽度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.itemStyle.borderWidth" @change="changeValue($event, series.itemStyle, 'borderWidth')"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">边框颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="series.itemStyle.borderColor" @change="changeValue($event, series.itemStyle, 'borderColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签<span>： </span></div>
      <DesDVSwitch :value="series.label.show" @change="changeValue($event, series.label, 'show')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">标签旋转<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: rotateOptions }" v-model="series.label.rotate" @change="changeValue($event, series.label, 'rotate')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">对齐方式<span>： </span></div>
      <DesDVTextAlign
        :config="{
          isShowVAlign: false,
        }"
        v-model="series.label.align"
        @change="changeValue($event, series.label, 'align')"
      />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">最小显示角度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'deg' }" :value="series.label.minAngle" @change="changeValue($event, series.label, 'minAngle')"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle v-model="labelTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">层级颜色<span>： </span></div>
      <DesDVMoreModeColor
        ref="DesDVMoreModeColor"
        :config="{
          colors: chartColorList,
          type: 'both',
        }"
        v-model="singleData"
      />
    </div>
  </div>
</template>
<script>

import mixin from "../mixin.js";

import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "DesDVChartSunburstSeries",
  mixins: [mixin, commonMixin],

  filters: {
    valueFilter(val) {
      return +(val + "").replace(/%/g, "");
    },
  },
  data() {
    return {
      colorConfig: {
        type: "color",
      },
      dictionary: [
        {
          text: "下钻",
          value: "rootToNode",
        },
        {
          text: "无",
          value: "none",
        },
      ],
      clockwiseOptions: [
        {
          text: "顺时针",
          value: true,
        },
        {
          text: "逆时针",
          value: false,
        },
      ],
      rotateOptions: [
        {
          text: "径向旋转",
          value: "radial",
        },
        {
          text: "切向旋转",
          value: "tangential",
        },
      ],
    };
  },
  computed: {
    singleData: {
      get() {
        let res = [];
        let colorList = this.chart.color;
        let nowIndex = -1;
        this.series.levels.forEach((it) => {
          let color = it.itemStyle?.color;
          if (color) {
            res.push(dsf.dataview.utils.convertChartToCSSColor(color));
          } else {
            nowIndex += 1;
            res.push(colorList[nowIndex]);
          }
        });
        return res;
      },
      set(v) {
        const levels = this.series.levels;
        v.forEach((it, index) => {
          const color = dsf.dataview.utils.convertCSSToEChartsColor(it);
          const item = levels[index];
          if (item) {
            if (item.itemStyle) {
              this.$set(item.itemStyle, "color", color);
            } else {
              this.$set(item, "itemStyle", {
                color,
              });
            }
          } else {
            this.$set(levels, index, {
              itemStyle: {
                color,
              },
            });
          }
        });
        const res = levels.slice(0, v.length);
        this.$set(this.series, "levels", res);
        this._updateChart();
      },
    },
    series() {
      return this.chart.series[0];
    },
    chartColorList() {
      return this.chart.color;
    },
    labelTextStyle: {
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
        this._updateChart();
      },
    },
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
