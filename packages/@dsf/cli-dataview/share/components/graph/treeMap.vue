<!--
 * @Author: liuhu liuhu@dreamdt.cn
 * @Date: 2023-06-20 14:58:47
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-23 09:43:36
 * @FilePath: \dsf-product-dataview\packages\@dsf\cli-dataview\pc\components\graph\treeMap.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
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
import { createTreeMap } from "_dataview/output/chartDefault/createTreeMap.js";
import graph from "_dataview/mixins/graph.js";
const staticDataKeyDic = {
  name: "名称",
  value: "存书量(十万本)",
};
const staticData = [
  {
    name: "锦江区",
    value: "167",
  },
  {
    name: "成华区",
    value: "67",
  },
  {
    name: "武侯区",
    value: "123",
  },
  {
    name: "高新区",
    value: "55",
  },
  {
    name: "青羊区",
    value: "98",
  },
  {
    name: "双流区",
    value: "55",
  },
  {
    name: "郫都区",
    value: "98",
  },
];

export default dsf.component({
  name: "DsfDataViewTreeMap",
  ctrlCaption: "矩形树图图表",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createTreeMap();
      },
    },
    sort: {
      type: String,
      default: "default",
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
    padding: {
      handler() {
        this.$nextTick(() => {
          this.chartObj && this.chartObj.resize();
        });
      },
      deep: true,
    },
  },
  data() {
    return {
      componentType: "chart",
    };
  },
  methods: {
    dynamicMapAnalysis(data, chart = this.chart) {
      let series = chart.series;
      series.forEach((it) => {
        let nameRelation = it.nameRelation || "name";
        let valueRelation = it.valueRelation || "value";
        it.nameRelation = nameRelation;
        it.valueRelation = valueRelation;

        let itVal = [];
        const singleData = it.singleData;
        data.forEach((item, index) => {
          if (item[valueRelation] != undefined) {
            let name = item[nameRelation] ? item[nameRelation] : nameRelation;
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
