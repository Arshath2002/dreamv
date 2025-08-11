<!--
 * @Description: 饼图控件
 * @Author: zhanghang
 * @Date: 2021-07-28 13:44:13
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 15:10:03
-->
<template>
  <div
    class="data-view-item-wrap ds-control dsf-dv-graph data-view-no-padding ds-chart data-view-parent-slot-wrap"
    :style="controlOuterStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div class="chart data-view-common-bg-effect" ref="chart" v-chart-nodata="!hasData"></div>
    <div
      class="slot-custom-position"
      v-if="isSlotCustomPosition"
      :style="slotCustomPositionStyle"
      slot-name="custom-position"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <slot name="custom-position"></slot>
    </div>
  </div>
</template>
<script>
import { createPie, createPieSeries } from "_dataview/output/chartDefault/createPie.js";
import slotPageManage from "_dataview/mixins/slotPageManage.js";
import graph from "_dataview/mixins/graph.js";
const staticDataKeyDic = {
  name: "名称",
  value: "人口数量",
};
const staticData = [
  {
    name: "锦江区",
    value: "167",
    dataName: "系列名称",
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
  name: "DsfDataViewPie",
  ctrlCaption: "饼状图表",
  mixins: [$mixins.dataView, graph, slotPageManage],
  props: {
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
          {
            name: "custom-position",
            controls: [],
          },
        ];
      },
    },
    //自定义配置总览
    chart: {
      type: Object,
      default: createPie,
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
  data() {
    return {
      componentType: "chart",
      otherEvents: ["设置动态图表"],
      cacheDataStyle: {},
    };
  },
  methods: {
    //处理map映射
    handleUpdateMap(map) {
      if (map) {
        let series = this.chart.series;
        series.forEach((it) => {
          it.nameRelation = map.name;
          it.valueRelation = map.value;
        });
      }
    },
    addItem(seriesName, nameKey, valueKey, isCircle) {
      const series = createPieSeries(seriesName);
      if (isCircle) series.radius[0] = "50%";
      series.name = seriesName;
      series.nameRelation = nameKey;
      series.valueRelation = valueKey;
      const chartOptions = this.chart;
      chartOptions.series.push(series);
    },
    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, title, isCircle, options = {} }) {
      const chartOptions = this.chart;
      chartOptions.series = [];
      const [dimension, ...rest] = describe;
      const dictionary = describe.reduce((o, it) => ((o[it.field] = it.title), o), {});
      try {
        if (data.length) {
          for (let i = 0; i < rest.length; i++) {
            const key = rest[i].field;
            const res = dsf.dataview.utils.matchNumberAndSuffix(data[0][key]);
            if (res && isFinite(res.number)) {
              this.addItem(title, dimension.field, key, isCircle);
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
    dynamicMapAnalysis(data, chart = this.chart) {
      let series = chart.series;
      let legend = [];
      let legendData = chart.legend.data;

      series.forEach((it, itIndex) => {
        const nameRelation = it.nameRelation || "name";
        const valueRelation = it.valueRelation || "value";
        const hasNameRelation = it.hasNameRelation;
        const seriesNameRelation = it.seriesNameRelation;

        it.nameRelation = nameRelation;
        it.valueRelation = valueRelation;

        const singleData = it.singleData;

        let it_val = [];
        let seriesName = "";
        data.forEach((item, index) => {
          if (index === 0 && hasNameRelation && item[seriesNameRelation]) {
            seriesName = item[seriesNameRelation];
          }
          let name = item[nameRelation] ? item[nameRelation] : nameRelation;
          let obj = dsf.isObject(legendData[itIndex]) ? { ...legendData[itIndex] } : { icon: "" };
          obj.name = name + "";
          legend.push(obj);

          const _data = {
            ...item,
            name: name,
            value: item[valueRelation] ? item[valueRelation] : 0,
          };

          if (Array.isArray(singleData) && singleData.length) {
            const { itemStyle } = singleData[index % singleData.length];
            _data.itemStyle = itemStyle;
          }

          it_val.push(_data);
        });
        seriesName && (it.name = seriesName);
        it.data = it_val;
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
