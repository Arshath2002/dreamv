<!--
 * @Description: 柱图控件
 * @Author: zhanghang
 * @Date: 2021-07-27 13:46:03
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-08 14:26:00
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
import { createPictorialBar, createPictorialBarSeries } from "_dataview/output/chartDefault/createPictorialBar.js";
const staticDataKeyDic = {
  name: "星期",
  value: "数量",
};
const staticData = [
  {
    name: "周一",
    value: "820",
  },
  {
    name: "周二",
    value: "932",
  },
  {
    name: "周三",
    value: "934",
  },
  {
    name: "周四",
    value: "1290",
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
import chartAxis from "./chartAxis";
import graph from "_dataview/mixins/graph.js";
export default dsf.component({
  name: "DsfDataViewPictorialBar",
  ctrlCaption: "象形图",
  mixins: [$mixins.dataView, graph, chartAxis],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default: createPictorialBar,
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
  watch: {
    staticData() {
      setTimeout(this.init, 0);
    },
  },
  methods: {
    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, title, options = {} }) {
      const dimension = describe[0];
      const dictionary = {};
      this.chart.series = [];
      const chartOptions = this.chart;
      describe.forEach((it, idx) => {
        dictionary[it.field] = it.title;
        if (idx > 0) {
          const seriesItem = createPictorialBarSeries(title, this.getNextColor());
          seriesItem.name = it.title;
          seriesItem.valueRelation = it.field;
          this.chart.series.push(seriesItem);
        }
      });

      // 计算象形图宽度，类目间隙默认20
      if (this.chart.series.length > 1) {
        this.chart.series.forEach((it) => {
          it.barWidth = (Math.floor(80 / this.chart.series.length) || 1) + "%";
        });
      }

      try {
        let yName = "";
        const keys = Object.keys(data[0]).filter((key) => key != dimension.field);
        data.forEach((it) => {
          keys.forEach((key) => {
            const res = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
            if (res && isFinite(res.number)) {
              it[key] = res.number;
              if (!yName) yName = dictionary[key];
              // 新增列
              if (!res.unit) return;
              const uKey = key + "_unit";
              it[uKey] = res.unit;
              dictionary[uKey] = dictionary[key] + "_单位";
            }
          });
        });
        chartOptions.xAxis[0].nameRelation = dimension.title;
        chartOptions.xAxis[0].valueRelation = dimension.field;
        chartOptions.xAxis[0].nameShow = true;
        chartOptions.yAxis[0].nameRelation = yName;
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
        const singleData = it.data;
        it.data = data.map((_it, index) => {
          if (dsf.isObject(singleData[index])) {
            return {
              ..._it,
              ...singleData[index],
              value: +_it[valueRelation],
            };
          } else {
            return {
              ..._it,
              value: +_it[valueRelation],
            };
          }
        });
      });

      chart.legend.data = legend;
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
