<!--
 * @Description: 折线图表控件
 * @Author: zhanghang
 * @Date: 2021-07-21 14:27:15
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-11 14:18:44
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
import chartAxis from "./chartAxis";
import graph from "_dataview/mixins/graph.js";
import { createLineSeries, createLine } from "_dataview/output/chartDefault/createLine.js";
const staticDataKeyDic = {
  name: "名称",
  value: "企业数量",
};

const staticData = [
  {
    name: "周一",
    value: "820",
  },
  {
    name: "周二",
    value: "901",
  },
  {
    name: "周三",
    value: "932",
  },
  {
    name: "周四",
    value: "934",
  },
  {
    name: "周五",
    value: "1290",
  },
  {
    name: "周六",
    value: "1330",
  },
  {
    name: "周日",
    value: "1320",
  },
];

export default dsf.component({
  name: "DsfDataViewPolyline",
  ctrlCaption: "折线图表",
  mixins: [$mixins.dataView, graph, chartAxis],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default: createLine,
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
    isStack: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isStack(v) {
      if (v) {
        this.chart.series.forEach((it) => {
          it.stack = "polyline";
        });
      } else {
        this.chart.series.forEach((it) => {
          Reflect.deleteProperty(it, "stack");
        });
      }
      this.reset();
      let chartString = dsf.dataview.utils.objectToString(this.chart, true);
      this.$emit("update:chartString", chartString);
    },
  },
  methods: {
    addItem(seriesName, valueRelation) {
      const series = createLineSeries(seriesName, this.getNextColor());
      series.valueRelation = valueRelation;
      const chartOptions = this.chart;
      chartOptions.series.push(series);
    },

    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, options = {} }) {
      const dictionary = {};
      const chartOptions = this.chart;
      chartOptions.series = [];
      const keys = [];
      let category = "";
      describe.forEach(({ title, field }, index) => {
        dictionary[field] = title;
        if (index > 0) {
          this.addItem(title, field);
          keys.push(field);
        } else {
          category = field;
        }
      });

      try {
        data = data.map((it) => {
          keys.forEach((key) => {
            const res = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
            if (res && isFinite(res.number)) {
              it[key] = res.number;
              // 新增列
              if (!res.unit) return;
              const uKey = key + "_unit";
              it[uKey] = res.unit;
              dictionary[uKey] = dictionary[key] + "_单位";
            }
          });
          return it;
        });
      } catch (error) {
        console.warn(`error${error}`);
      }
      chartOptions.xAxis[0].valueRelation = category;
      dsf.mix(true, chartOptions, options);

      // 处理成Excel
      const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
      this.excelData.length = 0;
      dsf.mix(true, this.excelData, excelData);
      this.$emit("update:excelData", excelData);
    },
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
        let seriesData = [];
        data.forEach((it, index) => {
          seriesData.push({
            ...it,
            value: it[valueRelation],
          });
        });
        it.data = seriesData;
      });

      chart.legend.data = legend;
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
  },
});
</script>
