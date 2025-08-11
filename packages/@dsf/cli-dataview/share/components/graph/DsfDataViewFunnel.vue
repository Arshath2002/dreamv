<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-08-22 16:20:47
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 11:50:34
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
    <div class="chart data-view-common-bg-effect" ref="chart"></div>
  </div>
</template>
<script>
import { createFunnelSeries, createFunnel } from "_dataview/output/chartDefault/createFunnel.js";
import graph from "_dataview/mixins/graph.js";
const staticDataKeyDic = {
  name: "名称",
  value: "人口数量",
};
const staticData = [
  {
    name: "锦江区",
    value: "60",
  },
  {
    name: "成华区",
    value: "40",
  },
  {
    name: "武侯区",
    value: "20",
  },
  {
    name: "高新区",
    value: "80",
  },
  {
    name: "青羊区",
    value: "100",
  },
];

export default dsf.component({
  name: "DsfDataViewFunnel",
  ctrlCaption: "漏斗图",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default: createFunnel,
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
    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, options = {} }) {
      const dictionary = describe.reduce((o, it) => ((o[it.field] = it.title), o), {});
      const [dimension, ...rest] = describe;
      const chartOptions = this.chart;
      chartOptions.series.length = 0;
      try {
        if (data.length) {
          for (let i = 0; i < rest.length; i++) {
            const key = rest[i].field;
            const title = rest[i].title;
            const res = dsf.dataview.utils.matchNumberAndSuffix(data[0][key]);
            if (res && isFinite(res.number)) {
              const seriesItem = createFunnelSeries(dimension.title);
              seriesItem.name = title;
              seriesItem.valueRelation = key;
              seriesItem.max = parseFloat(data[0][key]);
              chartOptions.series[0] = seriesItem;
              data.forEach((it) => {
                const val = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
                it[key] = val ? val.number : 0;
              });
              break;
            }
          }
          this.$emit("changeTitle", dimension.title);
        }
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
      let series = chart.series;
      let legendData = [];
      let oldLegend = chart.legend.data;

      series.forEach((it) => {
        const nameRelation = it.nameRelation || "name";
        const valueRelation = it.valueRelation || "value";

        const hasNameRelation = it.hasNameRelation;
        const seriesNameRelation = it.seriesNameRelation;

        it.nameRelation = nameRelation;
        it.valueRelation = valueRelation;
        let itVal = [];
        const singleData = it.singleData;
        data.forEach((item, index) => {
          if (index === 0 && hasNameRelation && item[seriesNameRelation]) {
            it.name = item[seriesNameRelation];
          }
          if (item[valueRelation] != undefined) {
            let name = nameRelation ? item[nameRelation] : valueRelation;
            let obj = dsf.isObject(oldLegend[index]) ? { ...oldLegend[index] } : { icon: "" };
            if (!oldLegend[index]) obj.icon = "";
            obj.name = name;
            legendData.push(obj);
            const data = {
              ...item,
              name: name,
              value: item[valueRelation],
            };
            if (Array.isArray(singleData) && singleData.length) {
              const { itemStyle } = singleData[index % singleData.length];
              data.itemStyle = itemStyle;
            }
            itVal.push(data);
          }
        });
        it.data = itVal;
      });
      chart.legend.data = legendData;
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
