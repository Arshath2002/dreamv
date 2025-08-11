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
  </div>
</template>
<script>
import { createScatter, createScatterSeries } from "_dataview/output/chartDefault/createScatter.js";

const staticDataKeyDic = {
  name: "名称",
  xValue: "x轴数据",
  value: "y轴对应的数据",
};
const staticData = [
  {
    name: "直接访问",
    xValue: 10,
    value: 20,
  },
  {
    name: "邮件营销",
    xValue: 20,
    value: 40,
  },
  {
    name: "联盟广告",
    xValue: 30,
    value: 50,
  },
  {
    name: "搜索引擎",
    xValue: 40,
    value: 70,
  },
  {
    name: "视频广告",
    xValue: 50,
    value: 90,
  },
  {
    name: "直播带货",
    xValue: 60,
    value: 80,
  },
];
import chartAxis from "./chartAxis";
import graph from "_dataview/mixins/graph.js";
export default dsf.component({
  name: "DsfDataViewScatter",
  ctrlCaption: "散点图表",
  mixins: [$mixins.dataView, graph, chartAxis],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default: createScatter,
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
    addItem(label, seriesRelation, valueKey, xValueKey) {
      const series = createScatterSeries(seriesRelation, this.getNextColor());
      series.valueRelation = valueKey;
      series.name = xValueKey;
      series.labelRelation = label;
      const chartOptions = this.chart;
      chartOptions.series.push(series);
    },
    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, title, options = {} }) {
      this.chart.series = [];
      const chartOptions = this.chart;

      // 标签名称
      let label = "";
      let isCategory = false;
      const dictionary = describe.reduce((o, it) => ((o[it.field] = it.title), o), {});
      if (describe.length === 2) {
        isCategory = true;
      }
      try {
        let valueKey = null;
        let xValueKey = null;
        // x轴名称
        let xName = "";
        // y轴名称
        let yName = "";

        if (data.length) {
          for (let i = 0; i < describe.length; i++) {
            const key = describe[i].field;
            const title = describe[i].title;

            if (i == 0) {
              label = key;
              if (isCategory) {
                dictionary.xValue = "x值";
                xName = title;
                xValueKey = key;
              }
              continue;
            }
            // 选取字段
            const res = dsf.dataview.utils.matchNumberAndSuffix(data[0][key]);
            if (res && isFinite(res.number)) {
              if (!valueKey && key !== xValueKey) {
                valueKey = key;
                dictionary.value = "y值";
                yName = title;
              } else if (!xValueKey && key !== valueKey) {
                xValueKey = key;
                xName = title;
                dictionary.xValue = "x值";
              }
            }
            // 处理数据
            if (valueKey && xValueKey) {
              data.forEach((it) => {
                const valueItem = dsf.dataview.utils.matchNumberAndSuffix(it[valueKey]);
                const xValueItem = isCategory ? it[xValueKey] : dsf.dataview.utils.matchNumberAndSuffix(it[xValueKey]);
                it.value = valueItem.number;
                it.xValue = isCategory ? xValueItem : xValueItem.number;

                if (valueItem.unit) {
                  it.value_unit = valueItem.unit;
                  dictionary.value_unit = dictionary.value + "_单位";
                }
                if (!isCategory && xValueItem.unit) {
                  it.x_value_unit = xValueItem.unit;
                  dictionary.x_value_unit = dictionary.xValue + "x值_单位";
                }
              });
              break;
            }
          }

          chartOptions.xAxis[0].name = xName;
          chartOptions.xAxis[0].nameShow = true;
          chartOptions.yAxis[0].name = yName;
          chartOptions.isXValue = !isCategory;
          this.addItem(label, title, "value", "xValue");
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
      let legend = [];
      let legendData = chart.legend.data;
      const isXValue = !!chart.isXValue;

      // x轴在类目轴下映射字段
      let xCategoryRelation = "";

      //x轴映射
      chart.xAxis.forEach((it) => {
        it.type = isXValue ? "value" : "category";
        xCategoryRelation = it.valueRelation || "xValue";
        // 如果不是自定义数据
        if (!it.isCustomData) {
          if (it.type === "category") {
            it.data = data.map((_it) => _it[xCategoryRelation]);
          } else {
            Reflect.deleteProperty(it, "data");
          }
        }
      });
      // 坐标轴名称设置
      this.setAxisName(chart, data);

      chart.series.forEach((it, seriesIndex) => {
        const valueRelation = it.valueRelation || "value";
        const labelRelation = it.labelRelation || "name";

        const seriesNameRelation = it.seriesNameRelation;
        const hasNameRelation = it.hasNameRelation;
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
          const value = isXValue ? [_it[xCategoryRelation], _it[valueRelation]] : _it[valueRelation];
          return {
            ..._it,
            value: value,
            name: _it[labelRelation] || labelRelation,
          };
        });
      });

      chart.legend.data = legend;
    },
    // 解析数据
    dataAnalysis(data) {
      if (!data) {
        this.chart.xAxis[0].data = [10, 30, 45, 50, 60];
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
      chart.series.forEach((it) => {
        it.data = it.type === "scatter" ? this.calculateScatterSize({ ...it, data: it.data }, it.referenceValue, chart.xAxis) : it.data;
      });
    },
    // 散点大小计算
    calculateScatterSize(seriesItem, baseValue, xData) {
      const { data = [], singleData = [], isSetSize = false, itemStyle, symbolSize, xAxisIndex = 0, isSetYAxis = true } = seriesItem;
      const valueData = isSetYAxis ? data : xData[xAxisIndex].data || [];
      // 计算总数, 兼容字符串报错, 需要注意负数大小
      const count =
        valueData.reduce((count, item) => {
          let value = parseFloat(item.value || item);
          if (isNaN(value)) {
            value = 0;
          }
          return Math.abs(value) + count;
        }, 0) || 1;

      // 创建一个临时存储数据的数组
      const result = [];

      let total = 0;

      // 由于直接用的数组，所以这里也改变了series中的singleData数组
      data.forEach((item, idx) => {
        if (!item.name && !item.value) {
          total++;
          return;
        }
        // 需要看singleData中的样式，如果singleData中存在数据就使用singleData中的数据
        const singleItem = singleData[idx];
        // 确保singleData中名称和实际数据名称同步;
        if (singleItem && singleItem.name) {
          singleItem.name = item.name || "";
        }

        // 兼容计算

        let value = parseFloat(valueData[idx].value || valueData[idx]);
        if (isNaN(value)) {
          value = 0;
        }

        result[idx] = {
          ...item,
          // 计算占比
          symbolSize: isSetSize ? Math.round((Math.abs(value) / count) * baseValue) : symbolSize,
          itemStyle: singleItem?.itemStyle || itemStyle,
          value: item.value || item,
          name: item.name || item,
        };
      });

      // 之前设置了散点的各个颜色后，再重新设置数据少于与散点颜色设置时情况
      if (singleData.length > data.length) {
        seriesItem.singleData = seriesItem.singleData.slice(0, data.length - total);
      }
      return result;
    },
  },
});
</script>
