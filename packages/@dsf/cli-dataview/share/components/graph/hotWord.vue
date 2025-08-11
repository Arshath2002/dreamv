<!--
 * @Description: 
 * @Author: shenah
 * @Date: 2024-04-24 09:27:11
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 14:04:07
-->
<template>
  <div
    class="hot_word ds-control data-view-item-wrap dsf-dv-graph data-view-no-padding ds-chart"
    :style="controlOuterStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <!-- 我是气泡图 -->
    <div id="chart" class="chart data-view-common-bg-effect" ref="chart" v-chart-nodata="!hasData"></div>
  </div>
</template>
<script>
import { defaultOptions } from "_dataview/output/chartDefault/hotWord.js";
import graph from "_dataview/mixins/graph.js";
import { createCustomSeries } from "./hotWordUtils.js";
import { handleColor, ColorRegexp } from "_dataview/output/config/commonConfig";
defaultOptions.legend.data = defaultOptions.series.map((item) => item.name);
const cloneDefault = _.cloneDeep(defaultOptions);
const staticDataKeyDic = {
  name: "名称",
  value: "企业数量",
  zb: "占比",
  unit: "单位",
};
const staticData = [
  {
    name: "工业自动化",
    value: 1421,
    zb: "10",
    unit: "家",
  },
  {
    name: "人工智能",
    value: 1200,
    zb: "10",
    unit: "家",
  },
  {
    name: "低碳环保",
    value: 330,
    zb: "10",
    unit: "家",
  },
  {
    name: "机器人",
    value: 1035,
    zb: "10",
    unit: "家",
  },
  {
    name: "光学技术",
    value: 935,
    zb: "10",
    unit: "家",
  },
  {
    name: "智能家居",
    value: 835,
    zb: "10",
    unit: "家",
  },
  {
    name: "无人机",
    value: 735,
    zb: "10",
    unit: "家",
  },
  {
    name: "制造业",
    value: 635,
    zb: "10",
    unit: "家",
  },
  {
    name: "智能冰箱",
    value: 535,
    zb: "10",
    unit: "家",
  },
  {
    name: "扫地机器人",
    value: 425,
    zb: "10",
    unit: "家",
  },
  {
    name: "工业",
    value: 335,
    zb: "10",
    unit: "家",
  },
  {
    name: "科学研究",
    value: 235,
    zb: "10",
    unit: "家",
  },
  {
    name: "批发",
    value: 135,
    zb: "10",
    unit: "家",
  },
  {
    name: "房地产",
    value: 95,
    zb: "10",
    unit: "家",
  },
];
export default dsf.component({
  name: "DsfDataViewBusinessHotWord",
  ctrlCaption: "热词气泡图",
  mixins: [$mixins.dataView, graph],
  props: {
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
      graphCanvas: null,
      cloneDefault,
      data: [],
      colors: cloneDefault.series[0].seriesColorList,
    };
  },
  created() {
    this.compatibleProp();
  },
  methods: {
    // 复制字体样式，返回数组
    copyTextStyles() {
      return this.chart.series.map((it) => {
        return {
          fontSize: it.nameFontSize,
          color: it.nameColor,
        };
      });
    },
    // 粘贴字体样式
    pasteTextStyles(textStyles) {
      if (textStyles && textStyles.length) {
        const min = Math.min(textStyles.length, this.chart.series.length);
        for (let i = 0; i < min; i++) {
          // 字体不支持渐变，只取第一个色值
          const color = handleColor(textStyles[i].color);
          this.chart.series[i].nameColor = color.replace(ColorRegexp, "$1");
          this.chart.series[i].nameFontSize = textStyles[i].fontSize;
        }
      }
    },
    compatibleProp() {
      if (typeof this.$attrs.isSjdx === "boolean") {
        this.chart.series.forEach((series) => {
          let bubbleSizeType = this.$attrs.isSjdx ? "auto" : "fixed";
          this.$set(series, "bubbleSizeType", bubbleSizeType);
        });
      }
    },
    beforeInit() {
      this.loadEcharts(this)
        .then(() => {
          this.loadD3(() => {
            this.initEcharts();
            this.init();
          });
        })
        .catch((ex) => {
          dsf.error(ex);
        });
    },
    loadD3(callback) {
      if (window.d3) {
        callback?.();
      } else {
        let loadFileHttp = dsf.dataview.utils.importFiles(
          [this.$getWebPath("static/js/libs/d3/d3.min.js", __DSF_DATAVIEW_PATH__)],
          () => {
            callback?.();
          },
          () => {
            dsf.layer.message("加载d3文件报错", false);
          },
          () => {
            this.addNowRequestFileList(loadFileHttp, true);
          }
        );
        this.addNowRequestFileList(loadFileHttp);
      }
    },
    dynamicMapAnalysis(data, chart = this.chart) {
      this.handleMap(data, chart);
      // 处理数据
      this.handleData(this.data, chart.series[0].seriesColorList, chart);
    },

    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, options = {} }) {
      const [dimension, ...rest] = describe;
      const chartOptions = this.chart;
      chartOptions.series[0].layout = "force";

      const dictionary = describe.reduce((o, it) => ((o[it.field] = it.title), o), {});
      try {
        const item = data[0];
        if (item) {
          // 如果大模型吐出数据没有value 字段 ，则选择一个数据字段
          if (!dictionary.value) {
            for (let i = 0; i < rest.length; i++) {
              const key = describe[i].field;
              const value = dsf.dataview.utils.matchNumberAndSuffix(item[key]);
              if (value && value.number) {
                const unit = value.unit;

                data = data.map((it) => {
                  const value = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
                  return {
                    ...it,
                    value: value.number,
                    unit: it.unit || unit,
                  };
                });
                break;
              }
            }
            dictionary.value = "值";
            dictionary.unit = "单位";
          }
        }
        this.$emit("changeTitle", dimension.title);
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
    //数据分析
    dataAnalysis(data) {
      if (!data) {
        if (this.$listeners["interceptOptions"]) {
          this.$dispatch("interceptOptions", { chart: this.chart, vm: this });
        } else {
          this.data = cloneDefault.series[0].data;
          this.handleData(this.data, this.chart.series[0].seriesColorList, this.chart, true);
        }
        return false;
      }
      this.dynamicMapAnalysis(data);

      if (this.$listeners["interceptOptions"]) {
        this.$dispatch("interceptOptions", { chart: this.chart, vm: this });
      } else {
        // 处理数据
        this.handleData(this.data, this.chart.series[0].seriesColorList, this.chart, true);
      }
    },
    handleMap(data, chart) {
      let valueRelation = chart.valueRelation || "value";
      let nameRelation = chart.nameRelation || "name";
      let percentRelation = chart.percentRelation || "zb";
      let unitRelation = chart.unitRelation;
      chart.valueRelation = valueRelation;
      chart.nameRelation = nameRelation;
      chart.percentRelation = percentRelation;
      chart.unitRelation = unitRelation;
      this.data = data.map((item) => {
        let name = item[nameRelation] || "";
        let value = item[valueRelation] || "";
        let zb = item[percentRelation] || "";
        let valueUnit = item[unitRelation] || unitRelation;
        return {
          ...item,
          name,
          value,
          zb,
          valueUnit,
          uuid: dsf.uuid(),
        };
      });
    },
    handleData(countList, seriesColorList, chart) {
      if (!countList || countList.length == 0) return false;

      let colors = seriesColorList || this.colors;
      let r = this.convertCSSToEChartsColor(colors);
      const cloneData = _.cloneDeep(countList);
      // 倒叙排列
      cloneData.sort((a, b) => b.value - a.value);
      const max = cloneData[0].value;

      const series = chart.series[0];
      const { rangeSymbolSize, bubbleSizeType } = series;
      const maxSymbolSize = rangeSymbolSize ? series.maxSymbolSize * 150 : series.maxSymbolSize;
      // 是否覆盖自定义label
      if (!series.overrideLabe) {
        series.label = {
          normal: {
            show: true,
            color: "#fff",
            align: "center",
            formatter(params) {
              const { nameSplit, valueUnit } = params.data;
              let top = params.dataIndex + 1;
              if (params.value === "") return "";
              let result_name = params.name;
              if (nameSplit && String(params.name).length > nameSplit) {
                result_name = `${String(params.name).slice(0, nameSplit)}\n${String(params.name).slice(nameSplit)}`;
              }
              if (params.data.topFlag && top <= params.data.topNum) {
                let str = `{a|TOP${top}}\n{b|${result_name}}`;
                if (params.data.valueFlag) {
                  str += `\n{c|${params.value}}{d|${valueUnit}}`;
                }
                if (params.data.zb && params.data.proportionFlag) {
                  str += `{e|\n占比:}{e|${params.data.zb}%}`;
                }
                return str;
              } else {
                let str = `{b|${result_name}}`;
                if (params.data.valueFlag) {
                  str += `\n{c|${params.value}}{d|${valueUnit}}`;
                }
                if (params.data.zb && params.data.proportionFlag) {
                  str += `{e|\n占比:}{e|${params.data.zb}%}`;
                }
                return str;
              }
            },
            rich: {
              a: {
                color: series.topColor || "#FFF",
                fontWeight: 600,
                fontSize: series.topFontSize || 14,
                padding: 4,
              },
              b: {
                color: series.nameColor || "#FFF",
                fontWeight: 400,
                fontSize: series.nameFontSize || 14,
                padding: 4,
              },
              c: {
                color: series.valueColor || "#FFF",
                fontWeight: 600,
                fontSize: series.valueFontSize || 14,
                padding: 4,
              },
              d: {
                color: series.unitColor || "#DCF0FF",
                fontWeight: 400,
                fontSize: series.unitFontSize || 14,
                padding: 4,
              },
              e: {
                color: series.proportionColor || "#FFF",
                fontWeight: 400,
                fontSize: series.proportionFontSize || 12,
                padding: 4,
              },
            },
          },
        };
      }

      cloneData.forEach((e, i) => {
        e.nameSplit = +series.nameSplit;
        e.valueFlag = !!series.valueFlag;
        e.proportionFlag = !!series.proportionFlag;
        e.topFlag = !!series.topFlag;
        e.topNum = typeof series.topNum === "number" ? series.topNum : 3;
        e.id = i;
        e.valueUnit = e.valueUnit ? e.valueUnit : this.chart.unitRelation ? this.chart.unitRelation : "";
        e.itemStyle = {
          normal: {
            color: r[i % colors.length],
          },
        };
        e.symbolSize = bubbleSizeType === "auto" ? Math.floor((e.value * maxSymbolSize) / max) : maxSymbolSize;
      });

      series.data = cloneData;
      this.reset();
    },
    createHotWordData() {
      cloneData.forEach((e, i) => {
        e.nameSplit = +series.nameSplit;
        e.valueFlag = !!series.valueFlag;
        e.proportionFlag = !!series.proportionFlag;
        e.topFlag = !!series.topFlag;
        e.topNum = typeof series.topNum === "number" ? series.topNum : 3;
        e.id = i;
        e.valueUnit = e.valueUnit ? e.valueUnit : this.chart.unitRelation ? this.chart.unitRelation : "";
        e.itemStyle = {
          normal: {
            color: r[i % colors.length],
          },
        };
        e.symbolSize = bubbleSizeType === "auto" ? Math.floor((e.value * maxSymbolSize) / max) : maxSymbolSize;
      });
    },
    handleKeepZeroLabel(chart = this.chart) {
      const series = chart.series[0];
      const valueRelation = chart.valueRelation;
      const percentRelation = chart.percentRelation;
      const seriesData = series.data;
      let flag = [valueRelation, percentRelation].some((key) => !!this.findFilterDecimalData(key));
      if (flag) {
        seriesData.forEach((item) => {
          let newOne = this.data.find((it) => it.uuid === item.uuid);
          if (newOne) {
            item[valueRelation] = newOne[valueRelation];
            item[percentRelation] = newOne[percentRelation];
          }
        });
      }
    },
    convertCSSToEChartsColor(colors) {
      if (colors && colors.length > 0) {
        let arr = [];
        colors.forEach((v, index) => {
          const color = dsf.dataview.utils.convertCSSToEChartsColor(v);
          arr.push(color);
        });
        return arr;
      }
      return [];
    },
    // 添加指标
    handleAddGraphItem(seriesName, data) {
      let one = null;
      if (seriesName?.name) {
        one = seriesName;
      } else if (data?.name) {
        one = data;
      }
      if (one) {
        this.data.push(one);
        this.handleData(this.data, this.chart.series[0].seriesColorList, this.chart, true);
      }
      return this;
    },
    // 删除指标
    handleDeleteGraphItem(seriesName, name) {
      let str = name ? name : seriesName ? seriesName : "";
      if (str) {
        let index = this.data.findIndex((item) => item.name === str);
        if (index > -1) {
          this.data.splice(index, 1);
          this.handleData(this.data, this.chart.series[0].seriesColorList, this.chart, true);
        }
      }
      return this;
    },
    handleStyleChangeSeries(styleObj, chart = this.chart) {
      let newArr = [];
      let itemColors = styleObj.commonStyle.colors;
      styleObj.commonStyle.colors.forEach((_, index) => {
        let color = this.handleStyleArrGetColor(itemColors, index);
        let newColor = `radial-gradient(circle at 50% 50%,${color[2]} 0%, ${color[0]} 100%)`;
        newArr.push(newColor);
      });
      chart.series[0].seriesColorList = newArr;
      chart.color = _.cloneDeep(newArr);
      this.handleData(chart.series[0].data, chart.series[0].seriesColorList, chart, true);
    },
    // 解析render函数
    extraCallBack(chart) {
      const series = chart.series[0];
      // 走custom
      if (series.layout === "none") {
        series.type = "custom";
        series.coordinateSystem = "none";
        if (this.isDesign) {
          const chartString = dsf.dataview.utils.objectToString(chart, true);
          this.$emit("update:chartString", chartString);
        }
        createCustomSeries(series);
      } else {
        series.type = "graph";
        Reflect.deleteProperty(chart.series[0], "renderItem");
        Reflect.deleteProperty(chart.series[0], "coordinateSystem");
        if (this.isDesign) {
          const chartString = dsf.dataview.utils.objectToString(chart, true);
          this.$emit("update:chartString", chartString);
        }
      }
    },
    afterSpecialSetOption(chart) {
      Reflect.deleteProperty(chart.series[0], "renderItem");
      Reflect.deleteProperty(chart.series[0], "coordinateSystem");
    },
  },
});
</script>
