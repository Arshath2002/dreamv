<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-09 09:42:11
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:08:30
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">提示框展示<span>： </span></div>
      <DesDVSwitch v-model="tooltip.enabled" @change="changeValue($event, tooltip, 'enabled')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="tooltip.enabled">
      <div class="property-item-name">内容<span>： </span></div>
      <el-input size="small" :value="tooltip.pointFormat" @input="changeValue($event, tooltip, 'pointFormat')" class="data-view-text"></el-input>
      <DesDVToolTipsIcon
        :data="{
          desc: '{point.color}=颜色;{point.name}=数据名; {point.y}=数据值; {point.b}=百分比',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="tooltip.enabled">
      <div class="property-item-name">风格<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="tooltip.styleType" @change="changeStyle($event, tooltip, 'styleType')" />
    </div>
    <template v-if="tooltip.styleType == 'custom' && tooltip.enabled">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">字体<span>： </span></div>
        <DesDVNumber :config="{ min: 12, unit: 'px' }" :value="tooltip.style.fontSize" @change="changeValue($event, tooltip.style, 'fontSize')" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name"></div>
        <DesDVColorPicker :config="colorConfig" :value="tooltip.style.color" @change="changeValue($event, tooltip.style, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">边框颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" :value="tooltip.borderColor" @change="changeValue($event, tooltip, 'borderColor')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">边框宽度<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="tooltip.borderWidth" @change="changeValue($event, tooltip, 'borderWidth')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">背景颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" :value="tooltip.backgroundColor" @change="changeValue($event, tooltip, 'backgroundColor')" />
      </div>
      <div class="ds-designer-property property-item" v-if="tooltip.enabled">
        <div class="property-item-name flex-center">内边距<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="tooltip.padding" @change="changeValue($event, tooltip, 'padding')" />
      </div>
    </template>
  </div>
</template>
<script>
import mixin from "./mixin";
export default {
  name: "DesDVChartHighTooltip",
  mixins: [mixin],
  computed: {
    tooltip() {
      return this.chart.tooltip;
    },
  },
  data() {
    return {
      colorConfig: {
        type: "color",
      },
      dictionary: [
        {
          text: "浅色",
          value: "0",
        },
        {
          text: "深色",
          value: "1",
        },
        {
          text: "自定义",
          value: "custom",
        },
      ],
      styleOptions: [
        {
          text: "浅色",
          value: "0",
          config: {
            backgroundColor: "#ffffff",
            borderColor: "#ffffff",
            style: {
              color: "#333333",
              fontSize: 14,
            },
          },
        },
        {
          text: "深色",
          value: "1",
          config: {
            backgroundColor: "rgba(50,50,50,0.7)",
            borderColor: "#333333",
            style: {
              color: "#ffffff",
              fontSize: 14,
            },
          },
        },
      ],
      tooltipOptions: {
        enabled: true,
        backgroundColor: "#ffffff",
        borderColor: "#ffffff",
        borderWidth: 1,
        styleType: "0",
        padding: 8,
        headerFormat:"",
        pointFormat: "{point.name}: {point.y}",
        style: {
          align: "left",
          color: "#333",
          fontSize: 12,
          fontFamily: "Microsoft Yahei",
          fontWeight: "normal",
        },
      },
    };
  },
  created() {
    this.chart.tooltip = dsf.mix(true, {}, this.tooltipOptions, this.chart.tooltip);
    this._updateChart();
  },
  methods: {
    changeValue(val, item, key) {
      if (!_.isEqual(item[key], val)) {
        this.$set(item, key, val);
        this._updateChart();
      }
    },
    changeStyle(val, item, key) {
      let style = this.styleOptions.find((it) => it.value == val);
      this.$set(item, key, val);
      if (style) {
        const config = style.config;
        this.chart.tooltip = dsf.mix(true, {}, this.chart.tooltip, config);
      }
      this._updateChart();
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
