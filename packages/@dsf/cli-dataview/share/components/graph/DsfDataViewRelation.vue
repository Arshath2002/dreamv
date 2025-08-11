<!--
 * @Description: 关系图谱
 * @Author: liuhu
 * @LastEditors: dengqirui dengqr@dreamdt.cn
 * @LastEditTime: 2024-09-13 16:39:43
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
import defaultOptions from "_dataview/output/chartDefault/relation.js";
const staticDataKeyDic = {
  name: "姓名",
  value: "值",
  category: "类目",
  start: "开始节点",
  end: "结束节点",
  link: "关系节点",
};
const staticData = [
  {
    name: "徐云",
    value: "10",
    category: "根节点",
    start: "徐云",
    end: "冯可梁",
    link: "夫妻",
  },
  {
    name: "徐云",
    value: "10",
    category: "根节点",
    start: "徐云",
    end: "邓志荣",
    link: "战友",
  },
  {
    name: "徐云",
    value: "10",
    category: "根节点",
    start: "徐云",
    end: "郑志勇",
    link: "朋友",
  },
  {
    name: "冯可梁",
    value: "10",
    category: "子节点",
    start: "冯可梁",
    end: "邓志荣",
    link: "夫妻",
  },
  {
    name: "邓志荣",
    value: "10",
    category: "子节点",
    start: "徐云",
    end: "冯可梁",
    link: "夫妻",
  },
  {
    name: "郑志勇",
    value: "10",
    category: "子节点",
    start: "徐云",
    end: "冯可梁",
    link: "夫妻",
  },
];
import graph from "_dataview/mixins/graph.js";
import { handleColor, ColorRegexp } from "_dataview/output/config/commonConfig";
export default dsf.component({
  name: "DsfDataViewRelation",
  ctrlCaption: "关系图谱图表",
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
      otherEvents: ["设置动态图表"],
      data: [],
    };
  },
  methods: {
    // 复制字体样式，返回数组
    copyTextStyles() {
      return this.chart.series.map((_, i) => {
        return this.textStyleProxy(`series.0.categories.${i}.label`);
      });
    },
    // 粘贴字体样式，默认取 label 字体，个别特殊的在组件内单独实现
    pasteTextStyles(textStyles) {
      for (let i = 0; i < textStyles.length; i++) {
        // 字体不支持渐变，只取第一个色值
        const color = handleColor(textStyles[i].color);
        textStyles[i].color = color.replace(ColorRegexp, "$1");
        this.textStyleProxy(`series.0.categories.${i}.label`, textStyles[i]);
      }
    },
    // 接口映射解析
    dynamicMapAnalysis(data, chart = this.chart) {
      chart.series.forEach((it, _index) => {
        let nameRelation = it.nameRelation || "name";
        let valueRelation = it.valueRelation || "value";
        let categoryRelation = it.categoryRelation || "category";
        let startRelation = it.startRelation || "start";
        let endRelation = it.endRelation || "end";
        let linkRelation = it.linkRelation || "link";
        const dealData = {
          nodeCategory: new Map(),
          linkNode: [],
          category: new Set(),
        };

        data.forEach((_it) => {
          if (_it[nameRelation] && !dealData.nodeCategory.has(_it[nameRelation])) {
            const category = _it[categoryRelation] !== undefined ? { category: _it[categoryRelation] } : {};
            dealData.nodeCategory.set(_it[nameRelation], {
              originData: _it,
              name: _it[nameRelation],
              value: _it[valueRelation],
              key: dealData.nodeCategory.size,
              ...category,
            });
          }
          if (_it[categoryRelation]) {
            dealData.category.add(_it[categoryRelation]);
          }
          if (_it[startRelation] && _it[endRelation] && _it[linkRelation]) {
            dealData.linkNode.push({
              start: _it[startRelation],
              end: _it[endRelation],
              link: _it[linkRelation],
            });
          }
        });
        const { links = [], seriesData = [], categories = [] } = this.getDealGraphData(dealData);
        it.data = seriesData;
        it.links = links;

        let newChartCategories = []
        categories.forEach((cate, idx) => {
          if (it.categories) {
            const seriesItem = it.categories.find((item) => item.name === cate);
            if (seriesItem) {
              newChartCategories.push(seriesItem)
            } else {
              //增加一个默认
              newChartCategories.push({
                name: cate,
                itemStyle: {
                  color: "#009800",
                },
                symbolSize: 45,
                label: {
                  show: true,
                  fontSize: 12,
                  color: "#fff",
                },
                symbol: undefined,
              });
            }
          }
        });
        it.categories = newChartCategories.slice(0, categories.length);
      });
      let legendData = this.getLegendData(chart.series, chart.legend.data);
      chart.legend.data = legendData;
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
    // 表格数据处理和接口数据处理共用一套处理方法
    getDealGraphData(data) {
      // 生成适合charts的linkNodes
      const links = data.linkNode.reduce((arr, item) => {
        if (data.nodeCategory.get(item.start) && data.nodeCategory.get(item.end)) {
          arr.push({
            source: data.nodeCategory.get(item.start).key,
            target: data.nodeCategory.get(item.end).key,
            value: item.link,
          });
        }
        return arr;
      }, []);

      const categories = Array.from(data.category);
      const categoriesMap = new Map();

      // 采用map结构，可减少时间复杂度
      categories.forEach((it, idx) => {
        categoriesMap.set(it, idx);
      });

      const seriesData = [];
      for (let value of data.nodeCategory.values()) {
        const itemValues = categoriesMap.get(value.category);
        const originData = value.originData;
        const temp = itemValues !== undefined ? { category: itemValues } : {};
        seriesData.push({
          ...originData,
          name: value.name,
          value: value.value,
          draggable: true,
          ...temp,
        });
      }

      return {
        links: links,
        seriesData: seriesData,
        categories: categories,
      };
    },
    // 图谱legend映射方式
    getLegendData(data, staticData) {
      const categories = data.reduce((arr, item) => [...arr, ...item.categories], []);
      const legendData = [];
      categories.forEach((it) => {
        const exist = staticData.find((item) => item.name === it.name);
        if (exist) {
          exist.color = it.itemStyle.color
          legendData.push(exist);
        } else {
          legendData.push({
            name: it.name,
            color: it.itemStyle.color,
            icon: it.symbol,
          });
        }
      });
      return legendData;
    },
  },
});
</script>
