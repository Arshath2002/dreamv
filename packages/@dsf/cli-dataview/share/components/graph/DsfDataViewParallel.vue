<!--
 * @Editor: zhanghang
 * @Description: 平行坐标系
 * @Date: 2024-06-05 15:09:54
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 18:12:50
-->
<template>
  <div
    class="data-view-item-wrap ds-control dsf-dv-graph data-view-no-padding ds-chart"
    :style="controlOuterStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div class="chart data-view-common-bg-effect" ref="chart" v-chart-nodata="!hasData"></div>
    <div class="slot-top">
      <slot :data="data"></slot>
    </div>
  </div>
</template>
<script>
import graph from "_dataview/mixins/graph.js";
import { createParallel } from "_dataview/output/chartDefault/parallel.js";
import { handleColor, ColorRegexp } from "_dataview/output/config/commonConfig";
const staticDataKeyDic = {
  name: "商品",
  x1: "指标1",
  x2: "指标2",
  x3: "指标3",
  x4: "指标4",
};
const staticData = [
  {
    name: "苹果",
    x1: 12.99,
    x2: 100,
    x3: 82,
    x4: "Good",
  },
  {
    name: "香蕉",
    x1: 9,
    x2: 80,
    x3: 70,
    x4: "OK",
  },
  {
    name: "西瓜",
    x1: 20,
    x2: 120,
    x3: 60,
    x4: "Excellent",
  },
];
export default dsf.component({
  name: "DsfDataViewParallel",
  ctrlCaption: "平行坐标系",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createParallel();
      },
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
  },
  methods: {
    // 复制字体样式，返回数组
    copyTextStyles() {
      return this.chart.series.map((_, i) => {
        return this.textStyleProxy(`parallelAxis.${i}.axisLabel`);
      });
    },
    // 粘贴字体样式，默认取 label 字体，个别特殊的在组件内单独实现
    pasteTextStyles(textStyles) {
      for (let i = 0; i < textStyles.length; i++) {
        // 字体不支持渐变，只取第一个色值
        const color = handleColor(textStyles[i].color);
        textStyles[i].color = color.replace(ColorRegexp, "$1");
        this.textStyleProxy(`parallelAxis.${i}.axisLabel`, textStyles[i]);
      }
    },
    dynamicMapAnalysis(data, chart = this.chart) {
      const series = chart.series;
      const seriesNameRelation = chart.seriesNameRelation;
      const hasNameRelation = chart.hasNameRelation;

      const parallelAxis = chart.parallelAxis;
      const singleDataColors = chart.singleData.map((it) => it.itemStyle.color);

      let legend = [];
      let legendData = chart.legend.data || [];
      chart.legend.data = legend;

      //这里根据data增加系列
      data.forEach((it, index) => {
        const legendItem = dsf.isObject(legendData[index]) ? legendData[index] : { icon: "" };
        legendItem.name = it.name + "";
        legend.push(legendItem);

        //获取data值
        const result = [];

        parallelAxis.forEach((axis, _index) => {
          if (axis.valueRelation) {
            result.push(it[axis.valueRelation]);
          } else {
            axis.valueRelation = `x${_index + 1}`;
            result.push(it[axis.valueRelation]);
          }
        });
        if (!series[index]) series[index] = dsf.mix(true, {}, chart.series[0]);
        series[index].data[0].value = result;

        if (hasNameRelation && it[seriesNameRelation]) {
          series[index].name = it[seriesNameRelation];
        }
        series[index].lineStyle.color = singleDataColors[index % singleDataColors.length];
      });
      parallelAxis.forEach((axis, index) => {
        if (axis.type === "value") {
          if (!axis.defineMax) {
            const max = series.reduce((amount, cur) => Math.max(cur.data[0].value[index], amount), Number.MIN_SAFE_INTEGER);
            axis.max = max;
          }
          if (!axis.defineMin) {
            const min = series.reduce((amount, cur) => Math.min(cur.data[0].value[index] || 0, amount), Number.MAX_SAFE_INTEGER);
            axis.min = min;
          }
        }
      });
    },
    // 解析数据
    dataAnalysis(data) {
      if (!data) {
        if (this.$listeners["interceptOptions"]) {
          this.$dispatch("interceptOptions", { chart: this.chart, vm: this });
        } else {
          this.reset();
        }
        return false;
      }
      this.dynamicMapAnalysis(data);

      if (this.$listeners["interceptOptions"]) {
        this.$dispatch("interceptOptions", { chart: this.chart, vm: this });
      } else {
        this.reset();
      }
    },
    extraCallBack(chart) {
      const singleDataColors = chart.singleData.map((it) => it.itemStyle.color);
      const series = chart.series;
      series.forEach((it, index) => {
        it.lineStyle.color = singleDataColors[index % singleDataColors.length];
      });
    },
  },
});
</script>
