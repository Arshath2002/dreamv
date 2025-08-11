<!--
 * @Description: 柱图控件
 * @Author: zhanghang
 * @Date: 2021-07-27 13:46:03
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 11:40:51
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
import { createBar, createBarSeries } from "_dataview/output/chartDefault/createBar.js";
import chartAxis from "./chartAxis";
import graph from "_dataview/mixins/graph.js";
import { handleUniversalRule } from "_dataview/mixins/universalRuleMixin";
const staticDataKeyDic = {
  name: "名称",
  value: "企业数量",
};

const staticData = [
  {
    name: "周一",
    value: "820",
  },
  {
    name: "周二",
    value: "901",
  },
  {
    name: "周三",
    value: "932",
  },
  {
    name: "周四",
    value: "934",
  },
  {
    name: "周五",
    value: "1290",
  },
  {
    name: "周六",
    value: "1330",
  },
  {
    name: "周日",
    value: "1320",
  },
];
export default dsf.component({
  name: "DsfDataViewBar",
  ctrlCaption: "柱状图表",
  mixins: [$mixins.dataView, graph, chartAxis],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return createBar();
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
      otherEvents: ["设置柱体颜色", "设置目标线", "删除目标线", "设置动态图表"],
      data: [],
      cacheCanvasImg: null,
    };
  },
  methods: {
    handleSetBarColor(name, color, seriesName) {
      let xAxis = this.chart.xAxis;
      let yAxis = this.chart.yAxis;
      let series = this.chart.series;
      let category = {};
      if (xAxis[0].type === "category") {
        category = xAxis[0];
      } else {
        category = yAxis[0];
      }
      let index = category.data.findIndex((it) => it === name);
      if (index > -1) {
        let bars = series.filter((it) => it.type === "bar");
        if (seriesName) {
          bars = bars.filter((it) => it.name === seriesName);
        }
        bars.forEach((bar) => {
          let barData = bar.data;
          let val = barData[index];
          if (typeof val == "object" && val != null) {
            val.itemStyle = {
              color,
            };
          } else {
            barData[index] = {
              value: val,
              itemStyle: {
                color,
              },
            };
          }
        });
      }
      this.reset();
    },
    addItem(seriesName, valueRelation) {
      const series = createBarSeries(seriesName, this.getNextColor());
      series.valueRelation = valueRelation;
      const chartOptions = this.chart;
      chartOptions.series.push(series);
      return series;
    },
    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, stack = false, isReturn = false, options = {} }) {
      const dictionary = {};
      const chartOptions = this.chart;
      // x轴/y轴互换
      if (isReturn) {
        const { xAxis, yAxis } = chartOptions;
        const changeXAxis = dsf.mix(true, [], yAxis);
        changeXAxis.forEach((it) => {
          it.position = "bottom";
        });
        const changeYAxis = dsf.mix(true, [], xAxis);
        changeYAxis.forEach((it) => {
          it.position = "left";
        });
        this.$set(chartOptions, "xAxis", changeXAxis);
        this.$set(chartOptions, "yAxis", changeYAxis);
      }
      chartOptions.isReturn = isReturn;

      chartOptions.series = [];

      const keys = [];

      let category = "";
      describe.forEach(({ title, field }, index) => {
        dictionary[field] = title;
        if (index > 0) {
          const series = this.addItem(title, field);
          series.isStack = stack;
          stack && (series.stack = "stack");
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

      if (isReturn) {
        chartOptions.yAxis[0].valueRelation = category;
      } else {
        chartOptions.xAxis[0].valueRelation = category;
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

      this.handleMarkLine(chart, chart.isReturn);
      // 坐标轴名称设置
      this.setAxisName(chart, data);

      chart.series.forEach((it, seriesIndex) => {
        const ruleList = it.singleDataRuleList || [];
        const seriesNameRelation = it.seriesNameRelation;
        const hasNameRelation = it.hasNameRelation;
        const valueRelation = it.valueRelation || "value";
        const item = data[0];

        // 如果系列名称是映射字段，且存在
        if (hasNameRelation && item && item[seriesNameRelation]) {
          it.name = item[seriesNameRelation];
        }

        //构建data
        let obj = dsf.isObject(legendData[seriesIndex]) ? legendData[seriesIndex] : { icon: "" };
        obj.name = it.name + "";
        legend.push(obj);

        let seriesData = [];
        if (it.barGap == "") {
          it.barGap = "0";
        }
        data.forEach((_it, index) => {
          let ruleObj = handleUniversalRule.call(this, _it, ruleList);
          let ruleColor = null;
          if (ruleObj.color) {
            ruleColor = dsf.dataview.utils.convertCSSToEChartsColor(ruleObj.color.color);
          }
          let obj = {
            ..._it,
            value: _it[valueRelation],
          };
          if (it.singleData && dsf.isObject(it.singleData[index])) {
            obj = {
              ..._it,
              ...it.singleData[index],
              value: _it[valueRelation],
            };
          }
          if (ruleColor) {
            // 防止单个数据颜色覆盖把singleData给覆盖了
            Reflect.deleteProperty(obj, "itemStyle");
            obj.itemStyle
              ? (obj.itemStyle.color = ruleColor)
              : (obj.itemStyle = {
                  color: ruleColor,
                });
          }
          seriesData.push(obj);
        });
        it.data = seriesData;
      });

      chart.legend.data = legend;
    },
    handleMarkLine(chart, isReturn) {
      chart.series.forEach((it) => {
        const markLine = it.markLine;
        if (markLine) {
          if (markLine.show) {
            const cacheData = markLine.cacheData;
            if (Array.isArray(cacheData)) {
              cacheData.forEach((item) => {
                if (item.type === "custom" && item.isDesign) {
                  item[isReturn ? "xAxis" : "yAxis"] = item.customValue;
                  item[isReturn ? "yAxis" : "xAxis"] = null;
                }
              });
              markLine.data = cacheData;
            }
          } else {
            markLine.data = [];
          }
        }
      });
    },
    dataAnalysis(data) {
      if (!data) {
        this.chart.legend.data = this.chart.series.map((item) => item.name);
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
      this.dealBarSeries(chart);
    },
    // series处理
    dealBarSeries(chart) {
      let { isReturn } = chart;
      chart.series.forEach((it) => {
        // 兼容老配置不存在配置参数的情况
        if (dsf.isUnDef(it.itemStyle.isCanvas)) {
          it.itemStyle.isCanvas = false;
          it.itemStyle.canvasConfig = {
            lineWidth: 5,
            distance: 2,
          };
        }
        // 走采用canvas设置背景模式
        if (it.itemStyle.isCanvas) {
          // 清空data中的itemStyle
          it.data.forEach((item) => {
            if (dsf.isObject(item)) {
              Reflect.deleteProperty(item, "itemStyle");
            }
          });
          const color = it.itemStyle.barColor || it.itemStyle.startColor;

          const img = this.getCanvasImgColorUrl(color, isReturn, it.itemStyle.canvasConfig);

          it.itemStyle.color = {
            image: img,
            repeat: "repeat",
          };
        } else {
          if (it.itemStyle.color && it.itemStyle.color.image) {
            it.itemStyle.color = it.itemStyle.barColor;
          }
        }
      });
    },
    // 采用canvas绘制背景
    getCanvasImgColorUrl(color, direction, config) {
      const lineBlock = document.createElement("canvas");
      const cxt = lineBlock.getContext("2d");
      const distance = +config.distance ?? 10;
      const lineWidth = +config.lineWidth ?? 1;
      // distance
      const height = distance + lineWidth;
      // 由于是repeat,只需要绘制的宽度等于定义的canvas的宽度
      lineBlock.width = height;
      lineBlock.height = height;
      cxt.beginPath();
      // 切换x轴和y轴切换类目轴时判定
      if (direction) {
        cxt.moveTo(0, 0);
        cxt.lineTo(0, height);
      } else {
        cxt.moveTo(0, 0);
        cxt.lineTo(height, 0);
      }
      cxt.strokeStyle = color;
      // 绘制宽度需要*2
      cxt.lineWidth = 2 * lineWidth;
      cxt.stroke();
      cxt.fillStyle = "rgba(255,255,255,0)";

      return lineBlock;
    },
  },
});
</script>
