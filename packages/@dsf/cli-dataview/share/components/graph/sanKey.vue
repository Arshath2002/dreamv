<!--
 * @Description: 桑基图
 * @Author: shenah
 * @Date: 2023-11-29 09:08:21
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 14:07:30
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
import defaultOptions from "_dataview/output/chartDefault/sanKey.js";
const staticDataKeyDic = {
  source: "源节点名称",
  target: "目标节名称",
  value: "数量",
};
const staticData = [
  {
    source: "进入",
    value: 1,
    target: "首页",
  },
  {
    source: "进入",
    value: 2,
    target: "个人中心",
  },
  {
    source: "个人中心",
    target: "订单",
    value: 3,
  },
  {
    source: "个人中心",
    target: "购物车",
    value: 4,
  },
  {
    source: "购物车",
    target: "商品",
    value: 5,
  },
];
import graph from "_dataview/mixins/graph.js";
export default dsf.component({
  name: "DsfDataViewSanKey",
  ctrlCaption: "桑基图",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return defaultOptions;
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
      otherEvents: [],
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
      const dictionary = describe.reduce((o, it) => ((o[it.field] = it.title), o), {});
      const chartOptions = this.chart;
      try {
        let targetKey = dictionary.target ? "target" : null;
        let sourceKey = dictionary.source ? "source" : null;
        let valueKey = dictionary.value ? "value" : null;
        if (data.length) {
          if (!targetKey || !sourceKey || !valueKey) {
            for (let i = 0; i < describe.length; i++) {
              const key = describe[i].field;
              const res = dsf.dataview.utils.matchNumberAndSuffix(data[0][key]);
              if (res && isFinite(res.number)) {
                if (!valueKey) {
                  valueKey = key;
                  dictionary.value = "值";
                }
              } else {
                if (!targetKey && key !== sourceKey) targetKey = key;
                else if (!sourceKey && key !== targetKey) sourceKey = key;
              }
              if (valueKey && sourceKey && targetKey) {
                data.forEach((it) => {
                  const valueItem = dsf.dataview.utils.matchNumberAndSuffix(it[valueKey]);
                  it.value = valueItem.number;
                  if (valueItem.unit) {
                    it.value_unit = valueItem.unit;
                    dictionary.value_unit = dictionary.value + "_单位";
                  }
                });
              }
            }
          } else {
            const keys = describe.map((it) => it.field);
            data.forEach((it) => {
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
            });
          }
          const seriesItem = chartOptions.series[0];
          seriesItem.targetRelation = targetKey;
          seriesItem.sourceRelation = sourceKey;
          seriesItem.targetValueRelation = "value";
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
      chart.series.forEach((it, _index) => {
        let sourceRelation = it.sourceRelation || "source";
        let targetRelation = it.targetRelation || "target";
        let targetValueRelation = it.targetValueRelation || "value";
        it.sourceRelation = sourceRelation;
        it.targetRelation = targetRelation;
        it.targetValueRelation = targetValueRelation;
        let seriesData = [];
        let seriesLinks = [];
        data.forEach((item, index) => {
          let sourceName = item[sourceRelation] ? item[sourceRelation] : "";
          let targetName = item[targetRelation] ? item[targetRelation] : "";
          let targetValue = item[targetValueRelation] ? item[targetValueRelation] : targetValueRelation;
          // 构建oneData
          if (sourceName) {
            let sourceIndex = seriesData.findIndex((item) => item.name === sourceName);
            if (sourceIndex === -1) {
              seriesData.push({
                // ...item,
                name: sourceName,
              });
            }
          }
          if (targetName) {
            let targetIndex = seriesData.findIndex((item) => item.name === targetName);
            if (targetIndex === -1) {
              let seriesDataItem = {
                ...item,
                name: targetName,
                value: undefined, // 去除
              };
              delete seriesDataItem.value;
              seriesData.push(seriesDataItem);
            }
          }
          // 构建links
          if (sourceName || targetName) {
            seriesLinks.push({
              ...item,
              source: sourceName,
              target: targetName,
              value: targetValue,
            });
          }
        });
        if (seriesData.length && seriesLinks.length) {
          it.data = seriesData;
          it.links = seriesLinks;
        } else {
          it.data = [];
          it.links = [];
        }
      });
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
    // series处理
    dealSanKeySeries(chart) {
      chart.series.forEach((it) => {
        let customReactList = it.itemStyle.customList || [];
        let customLineList = it.lineStyle.customList || [];
        let customLabelList = it.label.customList || [];
        let customEdgeLabelList = it.edgeLabel.customList || [];
        let data = it.data;
        let links = it.links;
        data.forEach((item) => {
          // 处理节点矩形
          let nodeName = item.name;
          let oneReactData = customReactList.find((one) => one.nodeName === nodeName);
          if (oneReactData) {
            this.$set(item, "itemStyle", oneReactData);
          } else {
            delete item.itemStyle;
          }
          // 处理自定义标签
          let oneLabelData = customLabelList.find((one) => one.nodeName === nodeName);
          if (oneLabelData) {
            this.$set(item, "label", oneLabelData);
          } else {
            delete item.label;
          }
        });
        links.forEach((item) => {
          let sourceName = item.source;
          let targetName = item.target;
          // 处理关系边
          let oneLineData = customLineList.find((one) => one.sourceNodeName === sourceName && one.targetNodeName === targetName);
          if (oneLineData) {
            this.$set(item, "lineStyle", oneLineData);
          } else {
            delete item.lineStyle;
          }
          // 处理关系边自定义标签
          let oneEdgeLabelData = customEdgeLabelList.find((one) => one.sourceNodeName === sourceName && one.targetNodeName === targetName);
          if (oneEdgeLabelData) {
            this.$set(item, "edgeLabel", oneEdgeLabelData);
          } else {
            delete item.edgeLabel;
          }
        });
      });
    },
    extraCallBack(chart) {
      this.dealSanKeySeries(chart);
    },
  },
});
</script>
