<!--
 * @Description: K线图
 * @Author: shenah
 * @Date: 2024-07-03 15:52:27
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-03 11:04:42
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
  </div>
</template>
<script>
import { createCandlestick } from "_dataview/output/chartDefault/candlestick.js";
import chartAxis from "./chartAxis";
import graph from "_dataview/mixins/graph.js";
const staticDataKeyDic = {
  name: "日期",
  value: "值",
  open: "开盘值",
  close: "收盘值",
  lowest: "最低值",
  highest: "最高值",
};
const staticData = [
  {
    name: "2024/07/01",
    open: "320.26",
    close: "320.26",
    value: "320.26",
    lowest: "287.3",
    highest: "362.94",
  },
  {
    name: "2024/07/02",
    open: "300",
    close: "291.3",
    value: "291.3",
    lowest: "288.26",
    highest: "308.38",
  },
  {
    name: "2024/07/03",
    open: "295.35",
    close: "346.5",
    value: "346.5",
    lowest: "295.35",
    highest: "346.92",
  },
  {
    name: "2024/07/04",
    open: "347.22",
    close: "358.98",
    value: "358.98",
    lowest: "337.35",
    highest: "363.8",
  },
  {
    name: "2024/07/05",
    open: "360.75",
    close: "382.48",
    value: "382.48",
    lowest: "347.89",
    highest: "383.76",
  },
  {
    name: "2024/07/06",
    open: "383.43",
    close: "385.42",
    value: "385.42",
    lowest: "371.23",
    highest: "391.82",
  },
  {
    name: "2024/07/07",
    open: "377.41",
    close: "419.02",
    value: "419.02",
    lowest: "369.57",
    highest: "421.15",
  },
];

export default dsf.component({
  name: "DsfDataViewCandlestick",
  ctrlCaption: "K线图",
  mixins: [$mixins.dataView, graph, chartAxis],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createCandlestick();
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
  data() {
    return {
      otherEvents: ["设置动态图表"],
      data: [],
    };
  },
  methods: {
    // 接口映射解析
    dynamicMapAnalysis(data, chart = this.chart) {
      let legend = [];
      let legendData = chart.legend.data;
      //x轴映射
      chart.xAxis.forEach((it) => {
        if (!it.valueRelation) {
          it.valueRelation = it.nameRelation;
        }
        it.data = data.map((item) => item[it.valueRelation || "name"]);
      });
      // 坐标轴名称设置
      this.setAxisName(chart, data);
      chart.series.forEach((it, seriesIndex) => {
        const valueRelation = it.valueRelation || "value";
        const openRelation = it.openRelation || "open";
        const closeRelation = it.closeRelation || "close";
        const lowestRelation = it.lowestRelation || "lowest";
        const highestRelation = it.highestRelation || "highest";

        const seriesNameRelation = it.seriesNameRelation;
        const hasNameRelation = it.hasNameRelation;

        const item = data[0];
        // 如果系列名称是映射字段，且存在
        if (hasNameRelation && item && item[seriesNameRelation]) {
          it.name = item[seriesNameRelation];
        }

        //构建data
        let obj = dsf.isObject(legendData[seriesIndex]) ? legendData[seriesIndex] : { icon: "" };
        obj.name = it.name + "'";
        legend.push(obj);

        it.data = data.map((_it, index) => {
          if (it.type === "line") {
            return {
              ..._it,
              value: _it[valueRelation],
            };
          } else {
            // k线图
            let openVal = _it[openRelation];
            let closeVal = _it[closeRelation];
            let lowestVal = _it[lowestRelation];
            let highestVal = _it[highestRelation];
            return {
              ..._it,
              value: [openVal, closeVal, lowestVal, highestVal],
            };
          }
        });
      });
      chart.legend.data = legend;
    },
    //数据分析
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
  },
});
</script>
