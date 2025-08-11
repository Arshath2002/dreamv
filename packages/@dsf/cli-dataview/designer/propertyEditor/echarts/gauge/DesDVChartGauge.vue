<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-10 11:16:18
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:37:33
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">仪表盘半径<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }" :value="series.radius | valueFilter" @change="changeValue($event + '%', series, 'radius')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">开始角度<span>： </span></div>
      <DesDVNumber :config="{ unit: 'deg' }" :value="series.startAngle" @change="changeValue($event, series, 'startAngle')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">结束<span>： </span></div>
      <DesDVNumber :config="{ unit: 'deg' }" :value="series.endAngle" @change="changeValue($event, series, 'endAngle')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">最小值<span>： </span></div>
      <DesDVNumber :config="{ unit: '' }" :value="series.min" @change="changeValue($event, series, 'min')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">最大值<span>： </span></div>
      <DesDVNumber :config="{ unit: '' }" :value="series.max" @change="changeValue($event, series, 'max')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标题<span>： </span></div>
      <DesDVSwitch v-model="series.title.show" @change="changeValue($event, series.title, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.title.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item ml30 float-one-row" v-if="series.title.show">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVNumber class="min" :config="{ unit: '%' }" :value="series.title.offsetCenter[0] | valueFilter" @change="changeValue($event + '%', series.title.offsetCenter, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row" v-if="series.title.show">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVNumber class="min" :config="{ unit: '%' }" :value="series.title.offsetCenter[1] | valueFilter" @change="changeValue($event + '%', series.title.offsetCenter, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">指针<span>： </span></div>
      <DesDVSwitch :value="series.pointer.show" @change="changeValue($event, series.pointer, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml50 float-one-row" v-if="series.pointer.show">
      <div class="property-item-name">长<span>： </span></div>
      <DesDVNumber :config="{ min: 1, unit: '%' }" :value="series.pointer.length | valueFilter" @change="changeValue($event + '%', series.pointer, 'length')" />
    </div>
    <div class="ds-designer-property property-item float-one-row" v-if="series.pointer.show">
      <div class="property-item-name">宽<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '' }" :value="series.pointer.width" @change="changeValue($event, series.pointer, 'width')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.pointer.show">
      <div class="property-item-name">颜色<span>： </span></div>
      <DesDVColorPicker v-model="series.pointer.itemStyle.color" :config="colorConfig" @change="changeValue($event, series.pointer.itemStyle, 'color')"></DesDVColorPicker>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">指针值<span>： </span></div>
      <DesDVSwitch :value="series.detail.show" @change="changeValue($event, series.detail, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.detail.show">
      <div class="property-item-name">内容<span>： </span></div>
      <el-input size="small" v-model="series.detail.formatterHtml" @change="changeValue($event, series.detail, 'formatterHtml')" class="data-view-text"></el-input>
      <DesDVToolTipsIcon
        :data="{
          desc: '@[value]-值，括号里面可取返回数据字段',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.detail.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="valueTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item ml30 float-one-row" v-if="series.detail.show">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVNumber class="min" :config="{ unit: '%' }" :value="series.detail.offsetCenter[0] | valueFilter" @change="changeValue($event + '%', series.detail.offsetCenter, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row" v-if="series.detail.show">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVNumber class="min" :config="{ unit: '%' }" :value="series.detail.offsetCenter[1] | valueFilter" @change="changeValue($event + '%', series.detail.offsetCenter, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">轴线<span>： </span></div>
      <DesDVSwitch :value="series.axisLine.show" @change="changeValue($event, series.axisLine, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.axisLine.show">
      <div class="property-item-name">宽度<span>： </span></div>
      <DesDVNumber :config="{ min: 1, unit: '' }" :value="series.axisLine.lineStyle.width" @change="changeValue($event, series.axisLine.lineStyle, 'width')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.axisLine.show">
      <div class="property-item-name">色值<span>： </span></div>
    </div>
    <template v-if="series.axisLine.show">
      <div class="ds-designer-property property-item ml20" v-for="(item, index) in lineColors" :key="index">
        <div class="property-item-name"></div>
        <div class="des-dv-gauge-piecewise">
          <DesDVNumber class="min" :config="{ min: 0, unit: '', step: 0.1 }" :value="item[0]" @change="changeValue($event, item, 0)" />
          <DesDVColorPicker v-model="item[1]" :config="colorLineConfig" @change="changeValue($event, item, 1)"></DesDVColorPicker>
          <div v-if="!index" class="des-dv-icon-add" @click="addColor">
            <i class="add-btn el-icon-plus"></i>
          </div>
          <div v-else class="des-dv-icon-add" @click="removeColor(index)">
            <i class="add-btn el-icon-minus"></i>
          </div>
        </div>
      </div>
    </template>
    <template v-if="series.progress">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">进度条<span>： </span></div>
        <DesDVSwitch :value="series.progress.show" @change="changeValue($event, series.progress, 'show')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="series.progress.show">
        <div class="property-item-name">宽度<span>： </span></div>
        <DesDVNumber class="min" :config="{ min: 1, unit: '' }" :value="series.progress.width" @change="changeValue($event, series.progress, 'width')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="series.progress.show">
        <div class="property-item-name">颜色<span>： </span></div>
        <DesDVColorPicker v-model="series.progress.itemStyle.color" :config="colorConfig" @change="changeValue($event, series.progress.itemStyle, 'color')"></DesDVColorPicker>
      </div>
    </template>
    
    <div class="ds-designer-property property-item">
      <div class="property-item-name">分割线<span>： </span></div>
      <DesDVSwitch :value="series.splitLine.show" @change="changeValue($event, series.splitLine, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml50 float-one-row" v-if="series.splitLine.show">
      <div class="property-item-name">长<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1, unit: '' }" :value="series.splitLine.length" @change="changeValue($event, series.splitLine, 'length')" />
    </div>
    <div class="ds-designer-property property-item ml50 float-one-row" v-if="series.splitLine.show">
      <div class="property-item-name">宽<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1, unit: '' }" :value="series.splitLine.lineStyle.width" @change="changeValue($event, series.splitLine.lineStyle, 'width')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.splitLine.show">
      <div class="property-item-name">颜色<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="splitLineColor" @change="changeSplitColor($event, series.splitLine.lineStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.splitLine.show && splitLineColor == 'custom'">
      <div class="property-item-name"></div>
      <DesDVColorPicker v-model="series.splitLine.lineStyle.color" :config="colorConfig" @change="changeValue($event, series.splitLine.lineStyle, 'color')"></DesDVColorPicker>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">刻度线<span>： </span></div>
      <DesDVSwitch :value="series.axisTick.show" @change="changeValue($event, series.axisTick, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml40 float-one-row" v-if="series.axisTick.show">
      <div class="property-item-name">长<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1, unit: '' }" :value="series.axisTick.length" @change="changeValue($event, series.axisTick, 'length')" />
    </div>
    <div class="ds-designer-property property-item float-one-row" v-if="series.axisTick.show">
      <div class="property-item-name">宽<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1, unit: '' }" :value="series.axisTick.lineStyle.width" @change="changeValue($event, series.axisTick.lineStyle, 'width')" />
    </div>
    <div class="ds-designer-property property-item ml10" v-if="series.axisTick.show">
      <div class="property-item-name">份数<span>： </span></div>
      <DesDVNumber :config="{ min: 1, unit: '' }" :value="series.axisTick.splitNumber" @change="changeValue($event, series.axisTick, 'splitNumber')" />
    </div>
    <div class="ds-designer-property property-item ml10" v-if="series.axisTick.show">
      <div class="property-item-name">颜色<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="axisTickColor" @change="changeSplitColor($event, series.axisTick.lineStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.axisTick.show && axisTickColor == 'custom'">
      <div class="property-item-name"></div>
      <DesDVColorPicker v-model="series.axisTick.lineStyle.color" :config="colorConfig" @change="changeValue($event, series.axisTick.lineStyle, 'color')"></DesDVColorPicker>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">刻度值<span>： </span></div>
      <DesDVSwitch :value="series.axisLabel.show" @change="changeValue($event, series.axisLabel, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.axisLabel.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="labelTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin.js";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";

import gauge from "_dataview/output/chartDefault/gauge.js";
export default {
  name: "DesDVChartGauge",
  mixins: [mixin, commonMixin],

  filters: {
    valueFilter(val) {
      return (val + "").replace(/%/g, "");
    },
  },
  computed: {
    series() {
      return this.chart.series[0];
    },
    lineColors: {
      get() {
        return this.chart.series[0].axisLine.lineStyle.color;
      },
    },
    labelTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.series.axisLabel;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.series.axisLabel, v);
        this._updateChart();
      },
    },
    nameTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.series.title;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.series.title, v);
        this._updateChart();
      },
    },
    valueTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.series.detail;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.series.detail, v);
        this._updateChart();
      },
    },
    splitLineColor() {
      return this.series.splitLine.lineStyle.color != "auto" ? "custom" : "auto";
    },
    axisTickColor() {
      return this.series.axisTick.lineStyle.color != "auto" ? "custom" : "auto";
    },
  },
  data() {
    return {
      dictionary: [
        {
          text: "自动",
          value: "auto",
        },
        {
          text: "自定义",
          value: "custom",
        },
      ],
      colorConfig: {
        type: "color",
      },
      colorLineConfig: {
        type: "color",
        noArrow: true, // 是否显示箭头图标
        noInput: true, // 是否显示输入框
      },
    };
  },
  created() {
    this.chart.series.forEach((it) => {
      it.axisLine.lineStyle = it.axisLine.lineStyle || dsf.mix(true, {}, gauge.series[0].axisLine.lineStyle);
      const colors = it.axisLine.lineStyle.color;
      const color = Array.isArray(colors) ? colors[colors.length - 1][1] : colors;
      it.pointer = it.pointer
        ? dsf.mix(
            true,
            {
              itemStyle: {
                color,
              },
            },
            it.pointer
          )
        : {
            itemStyle: {
              color,
            },
          };
    });
    this._updateChart();
  },
  methods: {
    addColor() {
      this.lineColors.push([1, this.randColor()]);
      this._updateChart();
    },
    removeColor(index) {
      this.lineColors.splice(index, 1);
      this._updateChart();
    },
    // 随机rgb颜色
    randColor() {
      return "#" + Math.random().toString(16).slice(-6);
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this._updateChart();
    },
    changeSplitColor(val, item, key) {
      if (val === "auto") {
        this.$set(item, key, val);
      } else {
        this.$set(item, key, this.randColor());
      }
      this._updateChart();
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
