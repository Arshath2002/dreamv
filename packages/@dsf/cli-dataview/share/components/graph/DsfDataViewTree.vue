<template>
  <div
    class="data-view-item-wrap ds-control dsf-dv-graph data-view-no-padding ds-chart"
    :style="controlOuterStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div class="chart" ref="chart"></div>
  </div>
</template>
<script>
import { createTree } from "_dataview/output/chartDefault/tree.js";
import graph from "_dataview/mixins/graph.js";
const staticDataKeyDic = {
  name: "名称",
  value: "数值",
  keyId: "主键",
  keyPid: "父主键",
};
const staticData = [
  {
    name: "国民经济行业分类",
    value: 200,
    keyPid: null,
    keyId: "FL",
  },
  {
    name: "农、林、牧、渔业",
    value: 30,
    keyPid: "FL",
    keyId: "A",
  },
  {
    name: "农业",
    value: 6,
    keyPid: "A",
    keyId: "01",
  },
  {
    name: "林业",
    value: 6,
    keyPid: "A",
    keyId: "02",
  },
  {
    name: "畜牧业",
    value: 6,
    keyPid: "A",
    keyId: "03",
  },
  {
    name: "渔业",
    value: 6,
    keyPid: "A",
    keyId: "04",
  },
  {
    name: "农、林、牧、渔专业及辅助性活动",
    value: 6,
    keyPid: "A",
    keyId: "05",
  },
  {
    name: "房地产业",
    value: 50,
    keyPid: "FL",
    keyId: "K",
  },
  {
    name: "房地产业",
    value: 2,
    keyPid: "K",
    keyId: "70",
  },
  {
    name: "文化、体育和娱乐业",
    value: 120,
    keyPid: "FL",
    keyId: "R",
  },
  {
    name: "新闻和出版业",
    value: 20,
    keyPid: "R",
    keyId: "86",
  },
  {
    name: "广播、电视、电影和录音制作业",
    value: 40,
    keyPid: "R",
    keyId: "87",
  },
  {
    name: "文化艺术业",
    value: 30,
    keyPid: "R",
    keyId: "88",
  },
  {
    name: "体育",
    value: 15,
    keyPid: "R",
    keyId: "89",
  },
  {
    name: "娱乐业",
    value: 15,
    keyPid: "R",
    keyId: "90",
  },
];

export default dsf.component({
  name: "DsfDataViewTree",
  ctrlCaption: "树图",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createTree();
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
    // 主键id
    keyId: {
      type: String,
      default: "keyId",
    },
    // 父主键id
    keyPid: {
      type: String,
      default: "keyPid",
    },
  },
  methods: {
    // 将列表转换为对象树
    listMap(data, nameKey, valueKey) {
      const map = {};
      const tree = [];

      // 初始化每个节点，并通过 keyId 存储在 map 中
      data.forEach((item) => {
        let keyId = item[this.keyId || "keyId"];
        map[keyId] = {
          ...item,
          name: item[nameKey],
          value: item[valueKey],
          children: [],
        };
      });

      // 遍历数据并构建树
      data.forEach((item) => {
        let keyId = item[this.keyId || "keyId"];
        let keyPid = item[this.keyPid || "keyPid"];
        const parent = map[keyPid];
        if (parent) {
          // 如果有父节点，添加到父节点的 children 中
          parent.children.push(map[keyId]);
        } else {
          // 没有父节点，则是根节点，添加到树的根级别
          tree.push(map[keyId]);
        }
      });

      return tree;
    },
    treeMap(data, nameKey, valueKey) {
      if (Array.isArray(data)) {
        data.forEach((it) => this.treeMap(it, nameKey, valueKey));
      } else if (data && typeof data === "object") {
        data.name = data[nameKey];
        data.value = data[valueKey];

        if (data.children && data.children.length) {
          this.treeMap(data.children, nameKey, valueKey);
        }
      }
    },
    // 接口映射解析
    dynamicMapAnalysis(data, chart = this.chart) {
      const item = data[0];
      chart.series.forEach((it) => {
        const nameRelation = it.nameRelation || "name";
        const valueRelation = it.valueRelation || "value";

        const hasNameRelation = it.hasNameRelation;
        const seriesNameRelation = it.seriesNameRelation;

        if (hasNameRelation && item[seriesNameRelation]) {
          it.name = item[seriesNameRelation];
        }

        if (this.dataType === "excel" || this.dataType === "static") {
          data = this.listMap(data, nameRelation, valueRelation);
        } else {
          this.treeMap(data, nameRelation, valueRelation);
        }
        it.data = data;
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
