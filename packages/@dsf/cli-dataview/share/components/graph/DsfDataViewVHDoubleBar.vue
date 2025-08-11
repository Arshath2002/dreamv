<!--
 * @Description: 双柱图
 * @Author: shenah
 * @Date: 2023-03-22 17:11:56
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 14:55:47
-->

<template>
  <div
    class="data-view-item-wrap ds-control dsf-dv-graph data-view-no-padding ds-chart"
    :style="controlStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div class="chart" ref="chart" v-chart-nodata="!hasData"></div>
    <div class="slot-top">
      <slot :data="data"></slot>
    </div>
  </div>
</template>

<script>
const staticDataKeyDic = {
  name: "星期",
  value: "交作业数量",
  value2: "及格数量",
};
const staticData = [
  {
    name: "周一",
    value: 30,
    value2: 2,
  },
  {
    name: "周二",
    value: 14,
    value2: 10,
  },
  {
    name: "周三",
    value: 28,
    value2: 40,
  },
  {
    name: "周四",
    value: 49,
    value2: 30,
  },
  {
    name: "周五",
    value: 60,
    value2: 22,
  },
  {
    name: "周六",
    value: 44,
    value2: 28,
  },
  {
    name: "周日",
    value: 9,
    value2: 33,
  },
];
import graph from "_dataview/mixins/graph.js";
import { hOptions, vOptions } from "_dataview/output/chartDefault/vHDoubleBar.js";
export default dsf.component({
  name: "DsfDataViewVHDoubleBar",
  ctrlCaption: "横竖双柱图",
  mixins: [$mixins.dataView, graph],
  data() {
    return {
      data: [],
    };
  },
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        return hOptions;
      },
    },
    barDirection: {
      type: String,
      default: "topDown",
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
  methods: {
    changeDirection(val) {
      let chart = this.chart;
      let upChart = {};
      let curSeries = [];
      let series = [];
      let cur = [];
      let oppose = [];
      //上下 h
      if (val == "topDown") {
        let cloneH = dsf.mix(true, {}, hOptions);
        series = chart.series;
        curSeries = cloneH.series;
        cur = cloneH.xAxis;
        oppose = chart.yAxis;
        upChart = cloneH;

        //坐标轴数据
        cur[0].axisLabel.color = oppose[1].axisLabel.color;
        cur[0].axisLabel.fontSize = oppose[1].axisLabel.fontSize;
        cur[0].axisLabel.fontFamily = oppose[1].axisLabel.fontFamily;
        cur[0].axisLine = oppose[1].axisLine;
        cur[0].nameRelation = oppose[0].nameRelation;
        //第一个必为正数
        curSeries[0].data = series[0].data.map((it) => {
          if (dsf.isObject(it)) {
            it.value = Math.abs(isNaN(Number(it.value)) ? 0 : Number(it.value));
            return it;
          } else {
            return Math.abs(isNaN(Number(it)) ? 0 : Number(it));
          }
        });
        //第二个必须是负数
        curSeries[1].data = series[1].data.map((it) => {
          if (dsf.isObject(it)) {
            it.value = -Math.abs(isNaN(Number(it.value)) ? 0 : Number(it.value));
            return it;
          } else {
            return -Math.abs(isNaN(Number(it)) ? 0 : Number(it));
          }
        });
      } else {
        let cloneV = dsf.mix(true, {}, vOptions);
        series = chart.series;
        curSeries = cloneV.series;
        cur = cloneV.yAxis;
        oppose = chart.xAxis;
        upChart = cloneV;
        //坐标轴数据
        cur[1].axisLabel.color = oppose[0].axisLabel.color;
        cur[1].axisLabel.fontSize = oppose[0].axisLabel.fontSize;
        cur[1].axisLabel.fontFamily = oppose[0].axisLabel.fontFamily;
        cur[1].axisLine = oppose[0].axisLine;
        cur[0].nameRelation = oppose[0].nameRelation;

        //第一个必为负数
        curSeries[0].data = series[0].data.map((it) => {
          if (dsf.isObject(it)) {
            it.value = -Math.abs(isNaN(Number(it.value)) ? 0 : Number(it.value));
            return it;
          } else {
            return -Math.abs(isNaN(Number(it)) ? 0 : Number(it));
          }
        });
        //第二个必须正数
        curSeries[1].data = series[1].data.map((it) => {
          if (dsf.isObject(it)) {
            it.value = Math.abs(isNaN(Number(it.value)) ? 0 : Number(it.value));
            return it;
          } else {
            return Math.abs(isNaN(Number(it)) ? 0 : Number(it));
          }
        });
      }
      cur.forEach((it, index) => {
        it.data = oppose[index].data;
      });

      curSeries[0].name = series[0].name;
      curSeries[0].nameRelation = series[0].nameRelation;
      curSeries[0].valueRelation = series[0].valueRelation;
      curSeries[0].itemStyle.color = series[0].itemStyle.color;
      curSeries[0].label.color = series[0].label.color;
      curSeries[0].label.fontFamily = series[0].label.fontFamily;
      curSeries[0].barWidth = series[0].barWidth;

      curSeries[1].name = series[1].name;
      curSeries[1].nameRelation = series[1].nameRelation;
      curSeries[1].valueRelation = series[1].valueRelation;
      curSeries[1].itemStyle.color = series[1].itemStyle.color;
      curSeries[1].label.color = series[1].label.color;
      curSeries[1].label.fontFamily = series[1].label.fontFamily;
      curSeries[1].barWidth = series[1].barWidth;

      const chartString = dsf.dataview.utils.objectToString(upChart, true);

      this.$emit("update:chartString", chartString);
      this.$emit("update:chart", upChart);

      dsf.emit.$emit("updatePropertyChart", {}, [this]);
    },

    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, options = {} }) {
      const chartOptions = this.chart;
      const series = chartOptions.series;
      const [dimension, ...rest] = describe;
      const dictionary = describe.reduce((o, it) => ((o[it.field] = it.title), o), {});

      try {
        const values = [];
        const item = data[0];
        if (item) {
          for (let i = 0; i < rest.length; i++) {
            const key = rest[i].field;
            const res = dsf.dataview.utils.matchNumberAndSuffix(item[key]);
            if (res && res.number) {
              values.push(key);
            }
          }
        }
        if (values.length >= 2) {
          const v = values[0];
          const h = values[1];

          const iv = describe.find((it) => it.field === v);
          const ih = describe.find((it) => it.field === h);
          dictionary.value = series[0].name = iv.title;
          dictionary.value2 = series[1].name = ih.title;
          chartOptions.xAxis[0].nameRelation = dimension.field;
          data.forEach((it) => {
            it.value = it[v];
            it.value2 = it[h];
          });
        }
      } catch (error) {
        console.warn(`error${error}`);
      }
      dsf.mix(true, chartOptions, options);
      const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
      this.excelData.length = 0;
      dsf.mix(true, this.excelData, excelData);
      this.$emit("update:excelData", excelData);
    },
    dynamicMapAnalysis(data, chart = this.chart) {
      let legend = [];
      let legendData = chart.legend.data;
      let xAxis = chart.xAxis;
      let yAxis = chart.yAxis;
      let xNameKey = xAxis[0].type == "category" ? xAxis[0].nameRelation : yAxis[0].nameRelation;
      let xData = data.map((it) => it[xNameKey || "name"]);

      if (xAxis[0].type == "category") {
        xAxis.forEach((it) => {
          it.data = xData;
          it.nameRelation = xNameKey;
        });
      } else {
        yAxis.forEach((it) => {
          it.data = xData;
          it.nameRelation = xNameKey;
        });
      }

      chart.series.forEach((it, seriesIndex) => {
        const valueRelation = seriesIndex ? it.valueRelation || "value" : it.valueRelation || "value2";
        const hasNameRelation = it.hasNameRelation;
        const seriesNameRelation = it.seriesNameRelation;

        const item = data[0];
        // 如果系列名称是映射字段，且存在
        if (hasNameRelation && item && item[seriesNameRelation]) {
          it.name = item[seriesNameRelation];
        }

        let obj = dsf.isObject(legendData[seriesIndex]) ? legendData[seriesIndex] : { icon: "" };
        obj.name = it.name + "";
        legend.push(obj);

        //构建data
        it.data = data.map((_it, index) => {
          let itemData = {
            ..._it,
            value: _it[valueRelation],
          };
          //将底部 和左侧数据转为负数
          if ((this.barDirection == "topDown" && seriesIndex == 1) || (this.barDirection == "leftRight" && seriesIndex == 0)) {
            itemData.value = -itemData.value;
          }
          return itemData;
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
  },
});
</script>
