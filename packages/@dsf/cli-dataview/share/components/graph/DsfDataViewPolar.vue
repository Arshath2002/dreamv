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
import { createPolar } from "_dataview/output/chartDefault/polar.js";
import graph from "_dataview/mixins/graph.js";
const staticDataKeyDic = {
  name: "名称",
  value: "人口数量",
};
const staticData = [
  {
    name: "周一",
    value: "20",
  },
  {
    name: "周二",
    value: "32",
  },
  {
    name: "周三",
    value: "11",
  },
  {
    name: "周四",
    value: "34",
  },
  {
    name: "周五",
    value: "12",
  },
  {
    name: "周六",
    value: "33",
  },
  {
    name: "周日",
    value: "13",
  },
];

export default dsf.component({
  name: "DsfDataViewPolar",
  ctrlCaption: "极坐标图表",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createPolar();
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
      if (chart.angleAxis.type === "category") {
        if (chart.angleAxis.type && !chart.radiusAxis.type) {
          chart.angleAxis.data = data.map((it) => it[chart.angleAxis.nameRelation || "name"]);
        } else if (chart.radiusAxis.type && !chart.angleAxis.type) {
          chart.radiusAxis.data = data.map((it) => it[chart.radiusAxis.nameRelation || "name"]);
        }
      }

      chart.series.forEach((it, seriesIndex) => {
        let valueRelation = it.valueRelation || "value";
        const seriesNameRelation = it.seriesNameRelation;
        const hasNameRelation = it.hasNameRelation;
        const item = data[0];

        // 如果系列名称是映射字段，且存在
        if (hasNameRelation && item && item[seriesNameRelation]) {
          it.name = item[seriesNameRelation];
        }

        let obj = dsf.isObject(legendData[seriesIndex]) ? legendData[seriesIndex] : { icon: "" };
        obj.name = it.name + "";
        legend.push(obj);
        //构建data
        let seriesData = data.map((_it) => {
          return {
            ..._it,
            value: _it[valueRelation],
          };
        });
        if (it.type === "scatter" && it.isSize) {
          let tempData = _.cloneDeep(it.data);
          it.data = this.dynamicCalculation(tempData, it.scatterBase);
        } else {
          it.data = seriesData;
        }
      });

      chart.legend.data = legend;
    },
    // 动态计算散点
    dynamicCalculation(valueData, scatterBase) {
      const count =
        valueData.reduce((count, item) => {
          let value = parseFloat(item.value || item);
          if (isNaN(value)) {
            value = 0;
          }
          return value + count;
        }, 0) || 1;
      let finalData = [];
      valueData.forEach((item) => {
        let obj = {};
        obj.symbolSize = Math.round(((item.value || item) / count) * scatterBase);
        obj.value = Number(item.value || item);
        finalData.push(obj);
      });
      return finalData;
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
<style scoped></style>
