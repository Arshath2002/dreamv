<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-08-18 16:54:15
 * @LastEditors: shenah
 * @LastEditTime: 2025-01-08 14:03:22
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
import defaultOptions from "_dataview/output/chartDefault/gauge.js";
import { handleColor, ColorRegexp } from "_dataview/output/config/commonConfig";

const staticDataKeyDic = {
  name: "名称",
  value: "数量",
};
const staticData = [
  {
    name: "测试",
    value: "25",
  },
];
import graph from "_dataview/mixins/graph.js";
export default dsf.component({
  name: "DsfDataViewGauge",
  ctrlCaption: "仪表盘",
  mixins: [$mixins.dataView, graph],
  props: {
    staticData: {
      type: Array,
      default: () => staticData,
    },
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
        return dsf.dataview.utils.transformToExcelData(
          staticData,
          staticDataKeyDic
        );
      },
    },
  },
  watch: {
    staticData: {
      handler() {
        this.$nextTick(this.init);
      },
      deep: true,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    // 复制字体样式，返回数组
    copyTextStyles() {
      const result = [];
      this.chart.series.forEach((_, i) => {
        result.push(this.textStyleProxy(`series.${i}.detail`));
        result.push(this.textStyleProxy(`series.${i}.axisLabel`));
      })
      return result;
    },
    // 粘贴字体样式
    pasteTextStyles(textStyles) {
      if (textStyles && textStyles.length) {
        let i = 0;
        while (textStyles[i]) {
          // 字体不支持渐变，只取第一个色值
          const color = handleColor(textStyles[i].color);
          textStyles[i].color = color.replace(ColorRegexp, "$1");
          const seriesIndex = Math.floor(i / 2);
          if (i % 2 == 0) {
            this.textStyleProxy(`series.${seriesIndex}.detail`, textStyles[i++]);
          } else {
            this.textStyleProxy(`series.${seriesIndex}.axisLabel`, textStyles[i++]);
          }
        }
      }
    },
    dynamicMapAnalysis(data, chart = this.chart) {
      let allSeries = _.cloneDeep(chart.series);
      let series = allSeries[0];
      //接口映射解析
      let nameRelation = series.nameRelation;
      let valueRelation = series.valueRelation;
      if (!nameRelation && !valueRelation) {
        nameRelation = series.nameRelation = "name";
        valueRelation = series.valueRelation = "value";
      }
      data = data.map((it) => {
        return {
          ...it,
          name: it[nameRelation] ? it[nameRelation] : nameRelation,
          value: it[valueRelation],
        };
      });
      // 只取第一个
      series.data = [data[0]];
      this.$set(chart, "series", allSeries);
    },
    dataAnalysis(data = this.staticData) {
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
    handleKeepZeroLabel() {
      this.chart.series.forEach((item) => {
        let valueField = item.valueRelation;
        let filterOne = this.findFilterDecimalData(valueField);
        let formatterHtml = item.detail.formatterHtml;
        if (formatterHtml) {
          let data = item.data[0];
          let val = data[valueField];
          if (filterOne) {
            data[valueField] = dsf.isNumber(val)
              ? (val * 1).toFixed(filterOne.threshold)
              : val;
          }
          item.detail.formatter = this.$replace(formatterHtml, data);
        }
      });
    },
  },
});
</script>
