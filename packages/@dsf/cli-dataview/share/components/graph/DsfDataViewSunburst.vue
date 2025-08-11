<!--
 * @Editor: zhanghang
 * @Description: 旭日图
 * @Date: 2024-05-30 14:02:45
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 13:59:54
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
import { createSunburst } from "_dataview/output/chartDefault/sunburst.js";
import graph from "_dataview/mixins/graph.js";
const staticDataKeyDic = {
  id: "主键",
  pid: "父主键",
  name: "名称",
  value: "值",
};
const staticData = [
  {
    name: "Grandpa",
    value: 50,
    pid: "0",
    id: "1",
    children: [
      {
        name: "Uncle Leo",
        value: 15,
        pid: "1",
        id: "3",
        children: [
          {
            name: "Cousin Jack",
            value: 2,
            pid: "3",
            id: "6",
          },
          {
            name: "Cousin Mary",
            value: 5,
            pid: "3",
            id: "7",
            children: [
              {
                name: "Jackson",
                value: 2,
                pid: "7",
                id: "13",
              },
            ],
          },
          {
            name: "Cousin Ben",
            value: 4,
            pid: "3",
            id: "8",
          },
        ],
      },
      {
        name: "Father",
        value: 10,
        pid: "1",
        id: "4",
        children: [
          {
            name: "Me",
            value: 5,
            pid: "4",
            id: "9",
          },
          {
            name: "Brother Peter",
            value: 1,
            pid: "4",
            id: "10",
          },
        ],
      },
    ],
  },
  {
    name: "Nancy",
    value: 20,
    pid: "0",
    id: "2",
    children: [
      {
        name: "Uncle Nike",
        value: 10,
        pid: "2",
        id: "5",
        children: [
          {
            name: "Cousin Betty",
            value: 1,
            pid: "5",
            id: "11",
          },
          {
            name: "Cousin Jenny",
            value: 2,
            pid: "5",
            id: "12",
          },
        ],
      },
    ],
  },
];

export default dsf.component({
  name: "DsfDataViewSunburst",
  ctrlCaption: "旭日图",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createSunburst();
      },
    },
    excelData: {
      type: Array,
      default: () => {
        let data = dsf.dataview.utils.flatTree([...staticData]);
        return dsf.dataview.utils.transformToExcelData(data, staticDataKeyDic);
      },
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    //是否是数结构数据
    isTreeData: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    dataType(v) {
      if (v === "excel") {
        this.$emit("update:isTreeData", false);
      } else if (v === "static") {
        this.$emit("update:isTreeData", true);
      }
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
      const keys = describe.map((it) => it.field);
      const chartOptions = this.chart;
      try {
        let idKey = dictionary.id ? "id" : null;
        let pidKey = dictionary.pid ? "pid" : null;
        let nameKey = dictionary.name ? "name" : null;
        let valueKey = dictionary.value ? "value" : null;
        let childrenKey = "children";
        if (data.length) {
          // 缺少id、pid字段，自动匹配
          if (!idKey || !pidKey) {
            const fields = dsf.dataview.utils.detectTreeFields(data[0]);
            if (!fields) {
              data = dsf.dataview.utils.flatTree(data, childrenKey);
              this.excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
              return;
            }
            const { id, pid, children } = fields;
            idKey = id;
            pidKey = pid;
            childrenKey = children;
            dictionary[id] = "节点id";
            dictionary[pid] = "父节点id";
          }
          // 缺少nameKey、valueKey字段
          if (!nameKey || !valueKey) {
            for (let i = 0; i < describe.length; i++) {
              const key = describe[i].field;
              if (key === childrenKey || key === idKey || key === pidKey) continue;
              const res = dsf.dataview.utils.matchNumberAndSuffix(data[0][key]);
              if (res && isFinite(res.number)) {
                if (!valueKey) {
                  valueKey = key;
                  dictionary.value = "值";
                }
              } else if (!nameKey && key !== valueKey) {
                nameKey = key;
              }
              // 完成匹配，处理数据
              if (valueKey && nameKey) {
                data = dsf.dataview.utils.flatTree(data, childrenKey);
                data.forEach((it) => {
                  const valueItem = dsf.dataview.utils.matchNumberAndSuffix(it[valueKey]);
                  it.value = valueItem.number;
                  if (valueItem.unit) {
                    it.value_unit = valueItem.unit;
                    dictionary.value_unit = dictionary.value + "_单位";
                  }
                });
                break;
              }
            }
          } else {
            data = dsf.dataview.utils.flatTree(data, childrenKey);
            data.forEach((it, idx) => {
              keys.forEach((key) => {
                const res = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
                if (res && isFinite(res.number)) {
                  it[key] = res.number;
                  // 新增列
                  if (!res.unit) return;
                  const uKey = key + "_unit";
                  it[uKey] = res.unit;
                  // 添加字典
                  if (idx != 0) return;
                  dictionary[uKey] = dictionary[key] + "_单位";
                }
              });
            });
          }
          const seriesItem = chartOptions.series[0];
          seriesItem.nameRelation = nameKey;
          seriesItem.valueRelation = valueKey;
          seriesItem.idRelation = idKey;
          seriesItem.pidRelation = pidKey;
          seriesItem.rootId = data[0][pidKey];
          // seriesItem.childrenRelation = childrenKey; // echarts只认children，传了有问题
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
      const series = chart.series[0];
      let { nameRelation = "name", seriesNameRelation, hasNameRelation, valueRelation = "value", childrenRelation = "children", idRelation = "id", pidRelation = "pid", rootId = "0" } = series;
      series.nameRelation = nameRelation;
      series.valueRelation = valueRelation;

      //不是树结构或表格数据
      if (!this.isTreeData || /excel|static/.test(this.dataType)) {
        data = dsf.dataview.utils.establishTree(data, rootId, idRelation, pidRelation);
      }
      const root = [...data];

      const item = root[0];
      // 如果系列名称是映射字段，且存在
      if (hasNameRelation && item && item[seriesNameRelation]) {
        series.name = item[seriesNameRelation];
      }

      while (root.length) {
        const item = root.shift();
        item.name = item[nameRelation];
        item.value = +item[valueRelation];
        const children = item[childrenRelation];

        if (children && children.length) {
          root.push(...children);
        }
      }
      series.data = data;
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
