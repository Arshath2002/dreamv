<!--
 * @Description: 矩形树图
 * @Author: shenah
 * @Date: 2024-05-06 10:14:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:42:10
-->

<template>
  <div style="margin-top: 10px">
    <!-- 系列色 -->
    <div class="ds-designer-property property-item">
      <div class="property-item-name">系列颜色<span>： </span></div>
      <DesDVMoreModeColor
        ref="DesDVMoreModeColor"
        :config="{
          type: 'both',
          colors: colorList,
        }"
        v-model="singleData"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">矩形间距<span>： </span></div>
      <DesDVNumber :value="series.itemStyle.gapWidth" @change="changeItemValue($event, series.itemStyle, 'gapWidth')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">间距底色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" v-model="series.itemStyle.borderColor" @change="changeItemColor($event, series.itemStyle, 'borderColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签<span>： </span></div>
      <DesDVSwitch :value="series.label.show" @change="changeItemValue($event, series.label, 'show')" />
    </div>
    <template v-if="series.label.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">标签内容<span>： </span></div>
        <el-input size="small" v-model="series.label.formatter" @change="changeItemValue($event, series.label, 'formatter')" class="data-view-text"></el-input>
        <DesDVToolTipsIcon
          :data="{
            desc: '{a}=系列名; {b}=数据名; {c}=数据值; {d}=百分比',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name">字体<span>： </span></div>
        <DesDVPixel :value="series.label.fontSize" :options="fontSizeUnitOptions" @change="changeItemValue($event, series.label, 'fontSize')"></DesDVPixel>
      </div>
      <div class="ds-designer-property property-item float-one-row ml20">
        <div class="property-item-name" style="min-width: 0px; display: none">
          字体
          <span>： </span>
        </div>
        <DesDVColorPicker
          :config="{
            ...colorConfig,
            noInput: true,
          }"
          v-model="series.label.color"
          @change="changeItemValue($event, series.label, 'color')"
        />
      </div>
    </template>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
export default {
  name: "DesDVChartTreeMapItem",
  mixins: [itemMixin],
  inject: ["owner"],
  props: {
    series: {
      type: Object,
      require: true,
    },
    colorList: {
      type: Array,
      require: true,
    },
  },
  computed: {
    singleData: {
      get() {
        let res = [];
        if (this.series.singleData && this.series.singleData.length) {
          this.series.singleData.forEach((it) => {
            let color = it.itemStyle ? it.itemStyle.color : "#fff";
            res.push(dsf.dataview.utils.convertChartToCSSColor(color));
          });
        } else {
          this.series.data.forEach((it, index) => {
            if (it.itemStyle?.color) {
              let color = it.itemStyle.color;
              res.push(dsf.dataview.utils.convertChartToCSSColor(color));
            } else {
              let color = this.colorList[index];
              if (color) {
                res.push(color);
              }
            }
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
          if (singleData[index]) {
            if (dsf.isObject(it)) {
              it.itemStyle = singleData[index].itemStyle;
            } else {
              this.series.data[index] = {
                value: it,
                itemStyle: singleData[index].itemStyle,
              };
            }
          } else {
            if (dsf.isObject(it)) {
              Reflect.deleteProperty(it, "itemStyle");
            }
          }
        });
        this.series.singleData = singleData;
        this.$emit("updateChart");
      },
    },
  },

 
};
</script>
