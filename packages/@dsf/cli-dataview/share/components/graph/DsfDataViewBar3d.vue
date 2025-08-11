<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-07-18 11:38:32
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 18:16:24
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
import { createBar3d, createBar3dSeries } from "_dataview/output/chartDefault/createBar3d.js";
import chartAxis from "./chartAxis";
import barCustom from "_dataview/mixins/barCustom.js";
import graph from "_dataview/mixins/graph.js";
const staticDataKeyDic = {
  name: "名称",
  value: "数",
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
  name: "DsfDataViewBar3d",
  ctrlCaption: "特殊柱状图形图表",
  mixins: [$mixins.dataView, graph, chartAxis, barCustom],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default: createBar3d,
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
      otherEvents: ["设置目标线", "删除目标线"],
      data: [],
    };
  },
  methods: {
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
          const series = createBar3dSeries(title);
          series.valueRelation = field;
          this.chart.series.push(series);
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

      let categoryRelation = "";
      if (chart.isReturn) {
        // valueRelation 必须存在
        if (!chart.yAxis[0].valueRelation) {
          chart.yAxis[0].valueRelation = chart.yAxis[0].nameRelation;
        }
        categoryRelation = chart.yAxis[0].valueRelation || "name";

        chart.yAxis[0].data = data.map((it) => it[categoryRelation]);
      } else {
        // valueRelation 必须存在
        if (!chart.xAxis[0].valueRelation) {
          chart.xAxis[0].valueRelation = chart.xAxis[0].nameRelation;
        }
        categoryRelation = chart.xAxis[0].valueRelation || "name";

        chart.xAxis[0].data = data.map((it) => it[categoryRelation]);
      }

      // 坐标轴名称设置
      this.setAxisName(chart, data);

      chart.series.forEach((it, seriesIndex) => {
        // 过滤掉不需要数据处理的类型

        const valueRelation = it.valueRelation || "value";
        const seriesNameRelation = it.seriesNameRelation;
        const hasNameRelation = it.hasNameRelation;

        const item = data[0];
        // 如果系列名称是映射字段，且存在
        if (hasNameRelation && item && item[seriesNameRelation]) {
          it.name = item[seriesNameRelation];
        }
        //构建data
        let obj = dsf.isObject(legendData[seriesIndex]) ? legendData[seriesIndex] : { icon: "" };
        obj.name = it.name;
        legend.push(obj);

        it.data = data.map((_it, index) => {
          return {
            ..._it,
            value: _it[valueRelation],
          };
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
    extraCallBack(chart) {
      chart.series = this.getCustomSeries(_.cloneDeep(chart.series), this);
    },
  },
});
</script>
