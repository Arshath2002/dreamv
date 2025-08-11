<!--
 * @Description: 词云
 * @Author: shenah
 * @Date: 2023-05-31 09:12:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-23 17:30:34
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
import { createWordCloud, createData } from "_dataview/output/chartDefault/createWordCloud.js";
import graph from "_dataview/mixins/graph.js";
import { handleColor, ColorRegexp } from "_dataview/output/config/commonConfig";
const staticData = createData();
const staticDataKeyDic = {
  name: "名称",
  value: "数量",
};

export default dsf.component({
  name: "DsfDataViewWordCloud",
  ctrlCaption: "词云",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createWordCloud();
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
      data: [],
    };
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
  methods: {
    // 复制字体样式，返回数组
    copyTextStyles() {
      return this.chart.series[0].singleData.map((item) => {
        return item.textStyle;
      });
    },
    // 粘贴字体样式
    pasteTextStyles(textStyles) {
      if (textStyles && textStyles.length) {
        for (let i = 0; i < textStyles.length; i++) {
          // 字体不支持渐变，只取第一个色值
          const color = handleColor(textStyles[i].color).replace(ColorRegexp, "$1");
          this.textStyleProxy(`series.0.singleData.${i}.textStyle`, { color });
        }
      }
    },
    beforeInit() {
      this.loadEcharts(this)
        .then(() => {
          this.loadEChartsWordCloud(() => {
            this.initEcharts();
            this.init();
          });
        })
        .catch((ex) => {
          dsf.error(ex);
        });
    },
    loadEChartsWordCloud(callback) {
      if (window["echarts-wordcloud"]) {
        callback?.();
      } else {
        let loadFileHttp = dsf.dataview.utils.importFiles(
          [this.$getWebPath("static/js/libs/echarts/echartsWordCloud.min.2.1.js", __DSF_DATAVIEW_PATH__)],
          () => {
            callback?.();
          },
          (err) => {
            console.error(err);
            dsf.layer.message("加载echarts-wordcloud文件报错", false);
          },
          () => {
            this.addNowRequestFileList(loadFileHttp, true);
          }
        );
        this.addNowRequestFileList(loadFileHttp);
      }
    },
    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, options = {} }) {
      const [dimension, ...rest] = describe;
      const dictionary = describe.reduce((o, it) => ((o[it.field] = it.title), o), {});
      const chartOptions = this.chart;
      try {
        let nameKey = dimension.field;
        let valueKey = "";
        if (data.length) {
          for (let i = 0; i < rest.length; i++) {
            const key = rest[i].field;
            const res = dsf.dataview.utils.matchNumberAndSuffix(data[0][key]);
            if (res && isFinite(res.number)) {
              valueKey = key;
              data.forEach((it) => {
                const val = dsf.dataview.utils.matchNumberAndSuffix(it[valueKey]);
                it[valueKey] = val ? val.number : 0;
              });
              break;
            }
          }
          this.$emit("changeTitle", dimension.title);
          chartOptions.nameRelation = nameKey;
          chartOptions.valueRelation = valueKey;
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
      let nameKey = chart.nameRelation || "name";
      let valueKey = chart.valueRelation || "value";
      if (!nameKey && !valueKey) {
        nameKey = chart.nameRelation = "name";
        valueKey = chart.valueRelation = "value";
      }
      const resData = data.map((item) => ({
        ...item,
        name: item[nameKey] === undefined ? nameKey : item[nameKey],
        value: item[valueKey] === undefined ? valueKey : item[valueKey],
      }));

      const series = chart.series[0];
      series.data = resData;

      this.data = resData;
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
      const series = chart.series[0];
      const colorList = chart.color;
      const singleData = series.singleData.length
        ? series.singleData
        : colorList.map((it) => ({
            textStyle: {
              color: it,
            },
          }));
      if (singleData.length) {
        series.data.forEach((it, index) => {
          if (it.textStyle) {
            it.textStyle.color = singleData[index % singleData.length].textStyle.color;
          } else {
            it.textStyle = singleData[index % singleData.length].textStyle;
          }
        });
      }
    },
    /**伪代码 */
    // 添加指标
    handleAddGraphItem(obj) {
      let oneSeries = this.chart.series[0];
      if (obj && typeof obj === "object") {
        if (oneSeries) {
          oneSeries.data.push(obj);
          this.reset();
        }
      }
      return this;
    },
    //删除指标
    handleDeleteGraphItem(str) {
      let oneSeries = this.chart.series[0];
      if (typeof str === "string") {
        let index = oneSeries.data.findIndex((item) => item.name === str);
        if (index > -1) {
          oneSeries.data.splice(index, 1);
          this.reset();
        }
      } else if (typeof str === "number") {
        oneSeries.data.splice(str - 1, 1);
        this.reset();
      }
      return this;
    },
  },
});
</script>
