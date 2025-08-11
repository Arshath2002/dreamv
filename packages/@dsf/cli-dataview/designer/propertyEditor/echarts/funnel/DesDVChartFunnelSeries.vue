<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-08 10:15:01
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-23 13:38:27
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">系列颜色<span>： </span></div>
      <DesDVMoreModeColor ref="DesDVMoreModeColor" :config="modeColor" v-model="singleData" />
    </div>
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name">宽度<span>： </span></div>
      <DesDVPixel :options="options" :value="series.width" @change="changeValue($event, series, 'width')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">高度<span>： </span></div>
      <DesDVPixel :options="options" :value="series.height" @change="changeValue($event, series, 'height')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name flex-center">内边距<span>： </span></div>
      <DesDVMargins v-model="getPadding" :data="{ config: { type: 'text' } }" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">排序<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="series.sort" @change="changeValue($event, series, 'sort')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">排列<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: direction }" :value="series.orient" @change="changeValue($event, series, 'orient')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签展示<span>： </span></div>
      <DesDVSwitch v-model="series.label.show" @change="changeValue($event, series.label, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">位置<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: locations }" :value="series.label.position" @change="changeValue($event, series.label, 'position')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">内容<span>： </span></div>
      <el-input size="small" v-model="series.label.formatter" @change="changeValue($event, series.label, 'formatter')" class="data-view-text"></el-input>
      <DesDVToolTipsIcon
        :data="{
          desc: '{a}=系列名; {b}=数据名; {c}=数据值; {d}=百分比',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">
        边框
        <span>：</span>
      </div>
      <DesDVSwitch :value="borderFlag" @change="changeBorder($event, series.itemStyle, 'borderWidth')" />
    </div>
    <!-- 边框 -->
    <template v-if="borderFlag">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">类型<span>： </span></div>
        <DesDVRadioGroup
          :data="{ dictionary: borderTypeList }"
          :fieldMap="{
            text: 'label',
            value: 'value',
          }"
          v-model="series.itemStyle.borderType"
          @change="changeValue($event, series.itemStyle, 'borderType')"
        />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">线宽<span>： </span></div>
        <DesDVNumber :value="series.itemStyle.borderWidth" @change="changeValue($event, series.itemStyle, 'borderWidth')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">颜色<span>： </span></div>
        <DesDVColorPicker
          :config="{
            type: 'both',
          }"
          v-model="itemBorderColor"
          @change="changeItemColor($event, series.itemStyle, 'borderColor')"
        />
      </div>
    </template>
  </div>
</template>
<script>
import mixin from "../mixin.js";
import { borderTypeList } from "../attrConfig";
import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "DesDVChartFunnelSeries",
  mixins: [mixin, commonMixin],
  components: { Direction },
  computed: {
    borderFlag() {
      return this.series.itemStyle.borderWidth !== 0;
    },
    getPadding: {
      get() {
        let { top, right, bottom, left } = this.series;
        return [top, right, bottom, left];
      },
      set(v) {
        let [top, right, bottom, left] = v;
        this.$set(this.series, "top", top);
        this.$set(this.series, "right", right);
        this.$set(this.series, "bottom", bottom);
        this.$set(this.series, "left", left);

        this._updateChart();
      },
    },
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
        this._updateChart();
      },
    },
    series() {
      return this.chart.series[0];
    },
    singleData: {
      get() {
        let res = [];
        let defaultColor = this.series.itemStyle.color || "#" + Math.random().toString(16).slice(-6);
        if (this.series.singleData && this.series.singleData.length) {
          this.series.singleData.forEach((it) => {
            let color = it.itemStyle ? it.itemStyle.color : defaultColor;
            res.push(dsf.dataview.utils.convertChartToCSSColor(color));
          });
        } else {
          const colors = this.owner.chart.color;
          this.series.data.forEach((it, index) => {
            let color = it.itemStyle ? it.itemStyle.color : colors[index % colors.length];
            res.push(dsf.dataview.utils.convertChartToCSSColor(color));
          });
        }
        return res;
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
        this.series.singleData = singleData;
        this._updateChart();
      },
    },
  },
  created() {
    const itemBorderColor = this.series.itemStyle?.borderColor || "#fff";
    this.itemBorderColor = dsf.dataview.utils.convertChartToCSSColor(itemBorderColor);
  },

  data() {
    const colors = this.owner.chart.color;
    return {
      borderTypeList,
      itemBorderColor: "",
      colorConfig: {
        type: "color",
      },
      options: [
        {
          value: "%",
          label: "%",
        },
      ],
      locations: [
        {
          text: "外侧",
          value: "outside",
        },
        {
          text: "内侧",
          value: "inside",
        },
      ],
      direction: [
        {
          text: "横向",
          value: "horizontal",
        },
        {
          text: "纵向",
          value: "vertical",
        },
      ],
      dictionary: [
        {
          text: "降序",
          value: "descending",
        },
        {
          text: "升序",
          value: "ascending",
        },
        {
          text: "默认",
          value: "none",
        },
      ],
      modeColor: {
        colors: colors,
        lastOneDel: true,
        type: "both",
      },
    };
  },
  methods: {
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this._updateChart();
    },
    changeBorder(val, item, key) {
      let width = val ? 1 : 0;
      this.changeValue(width, item, key);
    },
    changeItemColor(val, item, key) {
      let color = null;
      if (val && typeof val === "object") {
        val = val.color?.image || "#fff";
      }
      if (val !== "") {
        color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      }
      this.$set(item, key, color);
      this._updateChart();
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
