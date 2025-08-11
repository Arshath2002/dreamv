<!--
 * @Description: 雷达图
 * @Author: zhanghang
 * @Date: 2021-07-30 17:04:00
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 17:10:30
-->
<template>
  <div
    class="ds-control dsf-dv-graph ds-chart"
    :style="controlOuterStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div class="chart data-view-common-bg-effect" ref="chart" v-chart-nodata="!hasData"></div>
  </div>
</template>
<script>
import { createRadar, createRadarSeries } from "_dataview/output/chartDefault/createRadar.js";

import graph from "_dataview/mixins/graph.js";
import { handleColor, ColorRegexp } from "_dataview/output/config/commonConfig";
const staticDataKeyDic = {
  name: "名称",
  value: "人口数量",
};
let staticData = [
  {
    name: "销售",
    value: "500",
  },
  {
    name: "管理",
    value: "400",
  },
  {
    name: "信息技术",
    value: "300",
  },
  {
    name: "客服",
    value: "200",
  },
  {
    name: "研发",
    value: "700",
  },
  {
    name: "市场",
    value: "800",
  },
];
export default dsf.component({
  name: "DsfDataViewRadar",
  ctrlCaption: "雷达图表",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default: createRadar,
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    indicatorMax: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      data: [],
    };
  },
  methods: {
    // 复制字体样式，返回数组
    copyTextStyles() {
      const list = [this.textStyleProxy("radar.0.name.textStyle")];
      this.chart.series[0].data.reduce((_, i) => {
        list.push(this.textStyleProxy(`series.0.data.${i}.label`));
      });
      return list;
    },
    // 粘贴字体样式
    pasteTextStyles(textStyles) {
      if (textStyles && textStyles.length) {
        for (let i = 0; i < textStyles.length; i++) {
          // 字体不支持渐变，只取第一个色值
          const color = handleColor(textStyles[i].color);
          textStyles[i].color = color.replace(ColorRegexp, "$1");
          if (i) {
            this.textStyleProxy(`series.0.data.${i - 1}.label`, textStyles[i]);
          } else {
            this.textStyleProxy(`radar.0.name.textStyle`, textStyles[i]);
          }
        }
      }
    },
    //标准数据解析
    standardDataAnalysis(data, chart = this.chart) {
      let indicator = [];
      let radar = [];
      let max = 0;
      data.forEach((it) => {
        let value = new Array(it.data.length);
        let o = {
          name: it.name,
          value,
        };
        it.data.forEach((_it) => {
          let index = indicator.findIndex((text) => text === _it.name);
          if (index > -1) {
            value[index] = _it.value;
          } else {
            let len = indicator.length;
            indicator.push(_it.name);
            value[len] = _it.value;
          }
        });
        max = Math.max(max, ...o.value);
        radar.push(o);
      });

      let series = _.cloneDeep(chart.series[0]);
      let indicatorMax = this.indicatorMax ? this.indicatorMax : max;
      if (indicator.length) {
        chart.radar[0].indicator = indicator.map((it, index) => {
          if (index === 0 && !chart.radar[0].indicator[0].axisLabel) {
            return {
              name: it,
              max: indicatorMax,
              axisLabel: {
                show: false,
                color: "#918080",
                fontSize: 12,
              },
            };
          }
          if (index === 0 && chart.radar[0].indicator[0].axisLabel) {
            return {
              name: it,
              max: indicatorMax,
              axisLabel: chart.radar[0].indicator[0].axisLabel,
            };
          }
          return { name: it, max: indicatorMax };
        });
      }
      let newLegend = [];
      radar.forEach((item, index) => {
        if (chart.legend.data[index]) {
          let obj = {};
          if (Object.prototype.toString.call(chart.legend.data[index]) === "[object Object]") {
            obj = { ...chart.legend.data[index] };
            if (!chart.legend.data[index]) obj.icon = "";
          } else {
            obj.icon = "";
          }
          obj.name = item.name;
          newLegend[index] = obj;
        } else {
          let obj = {};
          obj.name = item.name;
          obj.icon = "";
          this.$set(newLegend, index, obj);
        }
      });
      chart.legend.data = newLegend;

      let $radar = series.data;
      //取第一项
      let op = createRadarSeries().data[0];
      //如果设置大于数据
      if ($radar.length > radar.length) {
        $radar = $radar.slice(0, radar.length);
      }
      radar.forEach((it, index) => {
        if ($radar[index]) {
          $radar[index].name = it.name;
          $radar[index].value = it.value;
        } else {
          $radar.push({
            ...dsf.mix(true, {}, op),
            ...it,
            areaStyle: {
              color: "rgba(255,255,255,0)",
              endColor: "rgba(255,255,255,0)",
              startColor: "rgba(255,255,255,0)",
              isshade: false,
            },
          });
        }
      });
      this.$set(chart.series, 0, series);
    },
    //动态解析
    dynamicMapAnalysis(data, chart = this.chart) {
      //顶点取值字段
      let radarNameKey = chart.series[0].radarKey || "name";
      chart.series[0].radarKey = radarNameKey;
      let result = [];
      const item = data[0];

      chart.series[0].data.forEach((it, _index) => {
        const valueRelation = it.valueRelation || "value";
        const seriesNameRelation = it.seriesNameRelation;
        let name = it.name;
        if (it.hasNameRelation && item && item[seriesNameRelation]) {
          name = item[seriesNameRelation];
        }
        let origanData = data.map((_it) => {
          return {
            ..._it,
            name: _it[radarNameKey],
            value: _it[valueRelation],
          };
        });

        result.push({
          name: name,
          data: origanData,
        });
      });
      data = result;
      this.standardDataAnalysis(data, chart);
    },

    //添加系列
    addItem(key, seriesName, valueRelation) {
      const chartOptions = this.chart;
      let item = chartOptions.series[0];
      item.radarKey = key;
      const colors = chartOptions.color;
      const hasLength = item.data.length;

      const color = colors[hasLength % colors.length] || "rgba(0,0,0,1)";

      let cloneData = createRadarSeries().data[0];
      cloneData.valueRelation = valueRelation;
      cloneData.name = seriesName;
      cloneData.value = [];

      cloneData.areaStyle = {
        color: "rgba(255,255,255,0)",
      };
      cloneData.itemStyle.color = color;
      cloneData.lineStyle.color = color;
      item.data.push(cloneData);

      this.chart.legend.data = item.data.map((d) => d.name);
    },
    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, options = {} }) {
      const dictionary = {};
      const chartOptions = this.chart;
      chartOptions.series[0].data = [];
      // 统计维度
      const [dimension, ...rest] = describe;

      describe.forEach(({ title, field }, idx) => {
        dictionary[field] = title;
        if (idx > 0) {
          this.addItem(dimension.field, title, field);
        }
      });
      try {
        const keys = rest.map((it) => it.field);
        data.forEach((it) => {
          keys.forEach((key) => {
            const value = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
            if (value && value.number) {
              it[key] = value.number;
              if (value.unit) {
                dictionary[`${key}_unit`] = dictionary[key] + "_单位";
                it[`${key}_unit`] = value.unit;
              }
            }
          });
          return it;
        });
      } catch (error) {
        console.warn(`error${error}`);
      }
      dsf.mix(true, chartOptions, options);

      // 处理成Excel
      const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
      this.excelData.length = 0;
      dsf.mix(true, this.excelData, excelData);
      this.$emit("update:excelData", excelData);
    },
    dataAnalysis(data) {
      if (!data) {
        if (this.$listeners["interceptOptions"]) {
          this.$dispatch("interceptOptions", { chart: this.chart, vm: this });
        } else {
          this.reset();
        }
        return false;
      }

      if (!Array.isArray(data)) return;
      this.dynamicMapAnalysis(data);

      if (this.$listeners["interceptOptions"]) {
        this.$dispatch("interceptOptions", { chart: this.chart, vm: this });
      } else {
        this.reset();
      }
    },
    handleKeepZeroLabel() {
      let series = this.chart.series;
      series.forEach((one) => {
        one.data.forEach((item) => {
          let label = item.label;
          let labelFlag = false;
          let formatterType = typeof label?.formatter;
          if (label) {
            labelFlag = !label.formatter || typeof formatterType === "string";
          }
          let valueField = item.valueRelation;
          let filterOne = this.findFilterDecimalData(valueField);
          let filterFlag = !!filterOne;
          if (labelFlag && filterFlag) {
            label.temporaryCache = label.formatter;
            if (!label.formatter) {
              label.formatter = function (param) {
                let val = param.value;
                if (typeof val === "number") {
                  return val.toFixed(filterOne.threshold);
                }
                return val;
              };
            } else {
              let formatter = label.formatter;
              label.formatter = function (param) {
                let val = param.value;
                if (typeof val === "number") {
                  val = val.toFixed(filterOne.threshold);
                }
                return formatter
                  .replace(/{a}/g, param.seriesName) // 系列名
                  .replace(/{b}/g, param.name) // 数据名
                  .replace(/{c}/g, val); // 数据值
              };
            }
          }
        });
      });
    },
    // 处理渲染后保留0后的处理
    handleFinishKeepZeroLabel() {
      let series = this.chart.series;
      series.forEach((one) => {
        one.data.forEach((item) => {
          let label = item.label;
          if (label && "temporaryCache" in label) {
            label.formatter = label.temporaryCache;
            delete label.temporaryCache;
            if (!label.formatter) {
              delete label.formatter;
            }
          }
        });
      });
    },
    handleEchartsHasData() {
      let hasData = this.chart.series.some((seriesItem) => {
        return seriesItem.data.length > 0 && seriesItem.data[0].value.length > 0;
      });
      this.$set(this, "hasData", hasData);
    },
  },
});
</script>
