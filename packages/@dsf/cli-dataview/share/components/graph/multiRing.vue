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
import { createMultiRing } from "_dataview/output/chartDefault/multiRing.js";
import graph from "_dataview/mixins/graph.js";
import { handleColor, ColorRegexp } from "_dataview/output/config/commonConfig";

const staticDataKeyDic = {
  name: "名称",
  value: "人口数量",
  zb: "占比",
  category: "归属",
};
const staticData = [
  {
    name: "锦江区",
    value: "40",
    zb: "40",
    category: "成都",
  },
  {
    name: "成华区",
    value: "35",
    zb: "35",
    category: "成都",
  },
  {
    name: "涪城区",
    value: "55",
    zb: "55",
    category: "绵阳",
  },
  {
    name: "安州区",
    value: "25",
    zb: "25",
    category: "绵阳",
  },
];

export default dsf.component({
  name: "DsfDataViewMultiRing",
  ctrlCaption: "多环图表",
  mixins: [$mixins.dataView, graph],
  props: {
    //自定义配置总览
    chart: {
      type: Object,
      default() {
        const defaultOptions = createMultiRing();
        defaultOptions.legend.data = defaultOptions.series
          .reduce((arr, item) => [...arr, item.data[0]], [])
          .map((item) => item.name)
          .filter((item) => item && item.trim());
        return defaultOptions;
      },
    },
    sort: {
      type: String,
      default: "default",
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
      colorStyle: [],
      backColorStyle: [],
      stackColorStyle: [],
    };
  },
  methods: {
    // 复制字体样式，返回数组
    copyTextStyles() {
      return [this.textStyleProxy(`series.0.data.2.label`)];
    },
    // 粘贴字体样式
    pasteTextStyles(textStyles) {
      if (textStyles && textStyles.length) {
        // 字体不支持渐变，只取第一个色值
        const color = handleColor(textStyles[0].color);
        textStyles[0].color = color.replace(ColorRegexp, "$1");
        this.chart.series.forEach((_, i) => {
          if (i % 2 == 0) {
            this.textStyleProxy(`series.${i}.data.2.label`, textStyles[0]);
          }
        });
      }
    },
    // 伪代码：添加指标
    handleAddGraphItem(seriseName, data) {
      let newItem = {};
      if (arguments.length === 1 && typeof seriseName === "object") {
        newItem = _.cloneDeep(seriseName);
      } else if (arguments.length == 2 && typeof data == "object") {
        newItem = _.cloneDeep(data);
      }
      if (newItem.zb) {
        let data = this.getData(this.chart);
        data.push(newItem);
        this.initPseudoCodeData(data);
        this.reset();
      }
      return this;
    },
    // 伪代码：删除指标
    handleDeleteGraphItem(seriseName, name) {
      let filterName = "";
      if (arguments.length === 1 && typeof seriseName === "string") {
        filterName = seriseName;
      } else if (arguments.length == 2 && typeof data == "string") {
        filterName = name;
      }
      let data = this.getData(this.chart);
      data = data.filter((item) => item.name !== filterName);
      this.initPseudoCodeData(data);
      this.reset();
      return this;
    },
    // 伪代码：排序
    handleSort(type, feild) {
      let data = this.getData(this.chart);
      let key = feild ? feild : "zb";
      if (type === "升序" || type == 1) {
        data.sort((a, b) => {
          return Number(a[key]) - Number(b[key]);
        });
      } else if (type === "降序" || type == -1) {
        data.sort((a, b) => {
          return Number(b[key]) - Number(a[key]);
        });
      }
      this.initPseudoCodeData(data, false);
      this.reset();
      return this;
    },
    // 伪代码：数据处理函数
    initPseudoCodeData(data) {
      let newData = [];
      let labelFormatter = this.chart.labelFormatter;
      let newLegend = [];
      let countActive = this.chart.countActive;
      let maxCount = [];
      data.forEach((item) => {
        maxCount.push(Number(item.value));
      });
      data.forEach((item, index) => {
        if (this.chart.legend.data[index]) {
          let obj = dsf.isObject(this.chart.legend.data[index]) ? { ...this.chart.legend.data[index] } : { icon: "" };
          if (!this.chart.legend.data[index].icon) obj.icon = "";
          obj.name = item.name;
          newLegend[index] = obj;
        } else {
          let obj = {};
          obj.name = item.name || "";
          obj.icon = "";
          this.$set(newLegend, index, obj);
        }
        let obj = {
          ...item,
        };
        obj.name = item.name || "";
        obj.value = item.value || "";
        obj.original = item.zb || "";
        obj.numberZb = this.getPercentValue(maxCount, index, 1);
        if (countActive === 1) obj.zb = obj.numberZb;
        if (this.chart.active === 0) obj.formatter = labelFormatter.replace("{c}", `${obj.zb}%`).replace("{a}", obj.name).replace("{b}", obj.value);
        obj.category = item.category || "";
        newData.push(obj);
      });
      let series = null;
      if (this.chart.active === 0) {
        series = this.initData(newData, chart);
      } else {
        series = this.initStackData(newData, chart);
      }
      this.chart.series = _.cloneDeep(series);
      this.chart.legend.data = _.cloneDeep(newLegend);
    },
    //处理map映射
    handleUpdateMap(map) {
      if (map) {
        let mapOptions = this.chart.mapOptions;
        mapOptions.valueRelation = map.value;
        mapOptions.nameRelation = map.name;
        mapOptions.percentRelation = map.zb || "";
        mapOptions.categoryRelation = map.category || "";
      }
    },
    dynamicMapAnalysis(data, chart = this.chart) {
      let nameRelation = chart.mapOptions.nameRelation || "name";
      let valueRelation = chart.mapOptions.valueRelation || "value";
      let percentRelation = chart.mapOptions.percentRelation || "zb";
      let categoryRelation = chart.mapOptions.categoryRelation || "category";
      let labelFormatter = chart.labelFormatter;
      let newData = [];
      let newLegend = [];
      if (!chart.countActive) chart.countActive = 0;
      let countActive = chart.countActive;
      let maxCount = [];
      chart.mapOptions.nameRelation = nameRelation;
      chart.mapOptions.valueRelation = valueRelation;
      chart.mapOptions.percentRelation = percentRelation;
      chart.mapOptions.categoryRelation = categoryRelation;
      data.forEach((item) => {
        maxCount.push(Number(item[valueRelation]));
      });
      data.forEach((item, index) => {
        if (chart.legend.data[index]) {
          let obj = dsf.isObject(chart.legend.data[index]) ? { ...chart.legend.data[index] } : { icon: "" };
          if (!chart.legend.data[index].icon) obj.icon = "";
          obj.name = item[nameRelation] || "";
          newLegend[index] = obj;
        } else {
          let obj = {};
          obj.name = item[nameRelation] || "";
          this.$set(newLegend, index, obj);
        }
        let obj = {
          ...item,
        };
        obj.name = item[nameRelation] || "";
        obj.value = item[valueRelation] || "";
        obj.zb = item[percentRelation] || "";
        obj.original = item[percentRelation] || "";
        obj.numberZb = this.getPercentValue(maxCount, index, 1);
        if (countActive === 1) obj.zb = obj.numberZb;
        if (chart.active === 0) obj.formatter = labelFormatter.replace("{c}", `${obj.zb}%`).replace("{a}", obj.name).replace("{b}", obj.value);
        obj.category = item[categoryRelation] || "";
        newData.push(obj);
      });
      let series = null;
      if (chart.active === 0) {
        series = this.initData(newData, chart);
      } else {
        series = this.initStackData(newData, chart);
      }
      chart.series = _.cloneDeep(series);
      chart.legend.data = _.cloneDeep(newLegend);
    },

    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data, options = {} }) {
      const chartOptions = this.chart;
      const dictionary = {};
      const keys = [];

      chartOptions.countActive = 1;

      describe.forEach(({ title, field }, index) => {
        dictionary[field] = title;
        // 使用第一个字段作位名称key
        if (index === 0) {
          chartOptions.mapOptions.nameRelation = field;
        }
        keys.push([field, title]);
      });
      try {
        const item = data[0];
        if (item) {
          // 构造数据字段
          for (let i = 1; i < keys.length; i++) {
            const key = keys[i][0];

            const value = dsf.dataview.utils.matchNumberAndSuffix(item[key]);
            if (value && value.number) {
              const unit = value.unit;
              data = data.map((it) => {
                const value = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
                return {
                  ...it,
                  value: value.number,
                  unit: unit,
                };
              });

              chartOptions.mapOptions.valueRelation = "value";
              break;
            }
          }
          dictionary.value = "值";
          dictionary.unit = "单位";
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
    // 解析数据
    dataAnalysis(data) {
      if (!data || data.length === 0) {
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
    summitColor(color, backColor, data) {
      let colors = ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc", "#546570", "#c4ccd3"];
      if (this.colorStyle.length > 0) {
        colors.forEach((item, index) => {
          if (this.colorStyle[index]) {
            colors[index] = this.colorStyle[index];
          }
        });
      }
      for (let i = color.length; i <= data.length; i++) {
        if (colors[i]) {
          color.push(colors[i]);
          backColor.push(colors[i] + "33");
        } else {
          let tempColor = this.getRandomColor();
          color.push(tempColor);
          backColor.push(tempColor + "33");
        }
      }
    },
    // 伪代码：获取当前表格数据
    getData(chart = this.chart) {
      let data = [];
      chart.series.forEach((item) => {
        if (!item.z) {
          let obj = {
            ...item,
          };
          obj.zb = item.data[0].value;
          obj.name = item.data[0].name;
          obj.value = item.data[0].number;
          data.push(obj);
        }
      });
      return data;
    },
    getRandomColor() {
      const r = Math.floor(Math.random() * 256); //生成红色0-255
      const g = Math.floor(Math.random() * 256); //生成绿色0-255
      const b = Math.floor(Math.random() * 256); //生成蓝色0-255
      return `rgb(${r},${g},${b})`;
    },
    // 动态计算标签canvasWidth
    getCanvasWidth(data, settingSeries, chart) {
      if (data.length === 0) {
        return 35;
      }
      let nameArr = [];
      if (chart.active === 0) {
        nameArr = data.map((item) => {
          return item.formatter;
        });
      } else {
        nameArr = data.map((item) => {
          return item.data[item.data.length - 1].name;
        });
      }
      let maxlengthName = nameArr.sort((a, b) => {
        return b.length - a.length;
      })[0];
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      context.font = settingSeries.data[settingSeries.data.length - 1].label.fontSize + "px";
      let metrics = context.measureText(maxlengthName);
      return Number(Number(metrics.width).toFixed(0)) + 35;
    },
    // 最大余额法
    getPercentValue(valueList, idx, precision) {
      // 判断是否为空
      if (!valueList[idx]) {
        return 0;
      }
      // 求和
      let sum = valueList.reduce(function (acc, val) {
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
      if (sum === 0) {
        return 0;
      }
      // 10的2次幂是100，用于计算精度。
      let digits = Math.pow(10, precision);
      // 扩大比例100，
      let votesPerQuota = valueList.map(function (val) {
        return ((isNaN(val) ? 0 : val) / sum) * digits * 100;
      });
      // 总数，扩大比例意味的总数要扩大
      let targetSeats = digits * 100;
      // 再向下取值，组成数组
      let seats = votesPerQuota.map(function (votes) {
        return Math.floor(votes);
      });
      // 再新计算合计，用于判断与总数量是否相同，相同则占比会100%
      let currentSum = seats.reduce(function (acc, val) {
        return acc + val;
      }, 0);
      // 余数部分的数组：原先数组减去向下取值的数组，得到余数部分的数组
      let remainder = votesPerQuota.map(function (votes, idx) {
        return votes - seats[idx];
      });
      // 给最大最大的余额加1，凑个占比100%；
      while (currentSum < targetSeats) {
        //  找到下一个最大的余额，给其加1
        let max = Number.NEGATIVE_INFINITY;
        let maxId = null;
        for (let i = 0, len = remainder.length; i < len; ++i) {
          if (remainder[i] > max) {
            max = remainder[i];
            maxId = i;
          }
        }
        // 对最大项余额加1
        ++seats[maxId];
        // 已经增加最大余数加1，则下次判断就可以不需要再判断这个余额数。
        remainder[maxId] = 0;
        // 总的也要加1，为了判断是否总数是否相同，跳出循环。
        ++currentSum;
      }
      // 这时候的seats就会总数占比会100%
      return seats[idx] / digits;
    },
    // 初始化数据
    initData(data, chart = this.chart) {
      let settingSeries = _.cloneDeep(chart.series[0]);
      let circleStyle = _.cloneDeep(chart.series[1]);
      let pieSize = chart.pieSize;
      if (!data || data.length === 0) {
        return this.getDefaultSeries(settingSeries, circleStyle, pieSize);
      }
      let color = [];
      let backColor = [];
      let index = 0;
      if (chart.series.length !== 2 || chart.series[0].data[0].itemStyle.color !== "transparent") {
        chart.series.forEach((item) => {
          if (!item.z) {
            if (this.colorStyle[index]) {
              this.colorStyle[index] = item.data[0].itemStyle.color;
            } else {
              this.colorStyle.push(item.data[0].itemStyle.color);
            }
            color.push(item.data[0].itemStyle.color);
          } else {
            if (this.colorStyle[index]) {
              this.backColorStyle[index] = item.data[0].itemStyle.color;
            } else {
              this.backColorStyle.push(item.data[0].itemStyle.color);
            }
            backColor.push(item.data[0].itemStyle.color);
            index++;
          }
        });
      }
      if (color.length < data.length) {
        this.summitColor(color, backColor, data);
      }
      if (chart.autoSort) {
        data.sort((a, b) => {
          return Number(b.zb) - Number(a.zb);
        });
      }
      let canvasWidth = this.getCanvasWidth(data, settingSeries, chart);
      let shiftPadding = [0, 0, 0, 0];
      if (settingSeries.clockWise === true) {
        shiftPadding[1] = canvasWidth;
        shiftPadding[3] = 0;
      } else {
        shiftPadding[1] = 0;
        shiftPadding[3] = canvasWidth;
      }
      let series = this.getSeries(settingSeries, circleStyle, data, color, backColor, pieSize, shiftPadding);
      return series;
    },
    initStackData(data, chart = this.chart) {
      let tempSeries = _.cloneDeep(chart.series);
      let pieSize = chart.pieSize;
      if (!data || data.length === 0) {
        return this.getDefaultStackSeries(tempSeries[0], pieSize);
      }
      let newSeries = [];
      let itemStyleArr = [];
      let newData = [];
      let index = 0;
      if (tempSeries.length !== 1 || tempSeries[0].data[0].itemStyle.color !== "transparent") {
        tempSeries.forEach((item) => {
          if (!item.thresholdCode) item.thresholdCode = 0.5;
          item.data.forEach((cItem) => {
            if (cItem.number || cItem.zb) {
              itemStyleArr.push(cItem.itemStyle.color);
              if (this.stackColorStyle[index]) {
                this.stackColorStyle[index] = cItem.itemStyle.color;
              } else {
                this.stackColorStyle.push(cItem.itemStyle.color);
              }
              index++;
            }
          });
        });
      }
      data.forEach((item, i) => {
        let obj = {
          ...item,
        };
        obj.value = item.zb * tempSeries[0].thresholdCode;
        obj.name = item.name;
        obj.number = item.value;
        obj.original = item.original;
        obj.numberZb = item.numberZb;
        obj.category = item.category || "";
        if (itemStyleArr[i]) {
          obj.itemStyle = { color: itemStyleArr[i] };
        } else {
          obj.itemStyle = {
            color: this.stackColorStyle[i] ? this.stackColorStyle[i] : this.getRandomColor(),
          };
        }
        newData.push(obj);
      });
      let resArr = newData.reduce((prev, cur) => {
        const { category } = cur;
        prev[category] = prev[category] ?? [];
        prev[category].push(cur);
        return prev;
      }, {});
      let i = 0;
      for (let key in resArr) {
        newSeries.push(this.getStackSeries(resArr[key], tempSeries[0], pieSize, key, i));
        i++;
      }
      let canvasWidth = this.getCanvasWidth(newSeries, tempSeries[0], chart);
      let shiftPadding = [0, 0, 0, 0];
      if (tempSeries[0].clockWise) {
        shiftPadding[1] = canvasWidth;
        shiftPadding[3] = 0;
      } else {
        shiftPadding[1] = 0;
        shiftPadding[3] = canvasWidth;
      }
      newSeries.forEach((item) => {
        item.data[item.data.length - 1].label.padding = shiftPadding;
      });
      return newSeries;
    },
    getDefaultSeries(settingSeries, circleStyle, pieSize) {
      let series = [];
      let shiftPadding = [0, 0, 0, 0];
      series.push({
        name: "",
        type: "pie",
        clockWise: settingSeries.clockWise, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [pieSize[0] + "%", pieSize[0] - pieSize[1] + "%"],
        center: settingSeries.center,
        thresholdCode: settingSeries?.thresholdCode ? settingSeries.thresholdCode : 0.5,
        label: {
          show: false,
        },
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          borderWidth: settingSeries.itemStyle.borderWidth,
        },
        data: [
          {
            value: 0,
            itemStyle: {
              color: "transparent",
            },
          },
          {
            value: 100,
            name: "",
            itemStyle: {
              color: "transparent",
            },
            tooltip: {
              show: false,
            },
            hoverAnimation: false,
          },
          {
            value: 0,
            name: "",
            itemStyle: {
              color: "transparent",
            },
            label: {
              show: settingSeries.data[settingSeries.data.length - 1].label.show,
              fontSize: settingSeries.data[settingSeries.data.length - 1].label.fontSize,
              color: settingSeries.data[settingSeries.data.length - 1].label.color,
              position: "inner",
              padding: shiftPadding,
            },
            tooltip: {
              show: false,
            },
          },
        ],
      });
      series.push({
        name: "",
        type: "pie",
        silent: true,
        z: 1,
        clockWise: settingSeries.clockWise, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [pieSize[0] + "%", pieSize[0] - pieSize[1] + "%"],
        center: settingSeries.center,
        thresholdCode: settingSeries?.thresholdCode ? settingSeries.thresholdCode : 0.5,
        label: {
          show: false,
        },
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          borderWidth: 5,
        },
        data: [
          {
            value: circleStyle.data[0].value,
            itemStyle: {
              color: "transparent",
            },
            tooltip: {
              show: false,
            },
            hoverAnimation: false,
          },
          {
            value: circleStyle.data[1].value,
            itemStyle: {
              color: "rgba(0,0,0,0)",
              borderWidth: 0,
            },
            tooltip: {
              show: false,
            },
            hoverAnimation: false,
          },
        ],
      });
      return series;
    },
    getDefaultStackSeries(settingSeries, pieSize) {
      let series = [];
      series.push({
        name: "",
        type: "pie",
        clockWise: settingSeries.clockWise, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [pieSize[0] + "%", pieSize[0] - pieSize[1] + "%"],
        center: settingSeries.center,
        thresholdCode: settingSeries.thresholdCode,
        label: {
          show: false,
        },
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          borderWidth: settingSeries.itemStyle.borderWidth,
        },
        data: [
          {
            value: 0,
            itemStyle: {
              color: "transparent",
            },
          },
          {
            value: 100,
            name: "",
            itemStyle: {
              color: "transparent",
            },
            tooltip: {
              show: false,
            },
            hoverAnimation: false,
          },
          {
            value: 0,
            name: "",
            itemStyle: {
              color: "transparent",
            },
            label: {
              show: settingSeries.data[settingSeries.data.length - 1].label.show,
              fontSize: settingSeries.data[settingSeries.data.length - 1].label.fontSize,
              color: settingSeries.data[settingSeries.data.length - 1].label.color,
              position: "inner",
              padding: settingSeries.data[settingSeries.data.length - 1].label.padding,
            },
            tooltip: {
              show: false,
            },
          },
        ],
      });
      return series;
    },
    handleSeriesData(styleObj) {
      let itemColors = styleObj.itemColors;
      this.chart.series.forEach((item, index) => {
        let oneData = item.data[0];
        if (!item.z) {
          // 圆环颜色系列
          let colorArr = itemColors[index];
          if (colorArr) {
            oneData.itemStyle.color = colorArr[1];
          }
        } else {
          // 圆环底色系列
          let colorArr = itemColors[index - 1];
          if (colorArr) {
            let baseColor = colorArr[0];
            if (baseColor) {
              oneData.itemStyle.color = baseColor;
            }
          }
        }
      });
    },
    // 操作Series颜色风格切换
    handleStyleChangeComponentSeries(styleObj) {
      if (this.chart.active === 0) {
        let index = 0;
        this.chart.series.forEach((item) => {
          if (styleObj["colors"][index]) {
            if (!item.z) {
              item.data[0].itemStyle.color = this.getHexColor(styleObj["colors"][index][2]);
              this.color;
            } else {
              item.data[0].itemStyle.color = this.getHexColor(styleObj["colors"][index][0]) + "33";
              index++;
            }
          }
          if (!item.z) {
            item.data[2].label.color = styleObj["labelColor"];
          }
        });
      } else {
        let tempIndex = 0;
        this.chart.series.forEach((item) => {
          if (styleObj["colors"][tempIndex]) {
            item.data.forEach((cItem, index) => {
              if (index !== item.data.length - 2 && index !== item.data.length - 1) {
                cItem.itemStyle.color = this.getHexColor(styleObj["colors"][tempIndex][2]);
                tempIndex++;
              }
              if (index === item.data.length - 1) {
                cItem.label.color = styleObj["labelColor"];
              }
            });
          }
        });
      }
    },
    // 获取新的series
    getSeries(settingSeries, circleStyle, data, color, backColor, pieSize, shiftPadding) {
      let series = [];
      for (let i = 0; i < data.length; i++) {
        let obj = {
          ...data[i],
        };
        obj.value = (data[i].zb * (circleStyle.data[0].value / 10)).toFixed(1);
        obj.name = data[i].name;
        obj.number = data[i].value;
        obj.original = data[i].original;
        obj.category = data[i].category;
        obj.numberZb = data[i].numberZb;
        obj.itemStyle = {
          color: color[i],
        };
        series.push({
          name: "",
          type: "pie",
          clockWise: settingSeries.clockWise, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [pieSize[0] - i * pieSize[2] + "%", pieSize[0] - pieSize[1] - i * pieSize[2] + "%"],
          center: settingSeries.center,
          thresholdCode: settingSeries?.thresholdCode ? settingSeries.thresholdCode : 0.5,
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: settingSeries.itemStyle.borderWidth,
          },
          data: [
            obj,
            {
              value: 100 - Number((data[i].zb * (circleStyle.data[0].value / 10)).toFixed(1)),
              name: "",
              itemStyle: {
                color: "transparent",
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
            {
              value: 0,
              name: data[i].formatter,
              itemStyle: {
                color: "transparent",
              },
              label: {
                show: settingSeries.data[settingSeries.data.length - 1].label.show,
                fontSize: settingSeries.data[settingSeries.data.length - 1].label.fontSize,
                color: settingSeries.data[settingSeries.data.length - 1].label.color,
                position: "inner",
                padding: shiftPadding,
              },
              tooltip: {
                show: false,
              },
            },
          ],
        });
        series.push({
          name: "",
          type: "pie",
          silent: true,
          z: 1,
          clockWise: settingSeries.clockWise, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [pieSize[0] - i * pieSize[2] + "%", pieSize[0] - pieSize[1] - i * pieSize[2] + "%"],
          center: settingSeries.center,
          thresholdCode: settingSeries?.thresholdCode ? settingSeries.thresholdCode : 0.5,
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: 5,
          },
          data: [
            {
              value: circleStyle.data[0].value,
              itemStyle: {
                color: backColor[i],
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
            {
              value: circleStyle.data[1].value,
              itemStyle: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0,
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
          ],
        });
      }
      return series;
    },
    // 获取堆叠series
    getStackSeries(data, settingSeries, pieSize, name, i) {
      let sum = 0;
      data.forEach((item) => {
        sum = sum + item.value;
      });
      let series = {
        name: "",
        type: "pie",
        clockWise: settingSeries.clockWise, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [pieSize[0] - i * pieSize[2] + "%", pieSize[0] - pieSize[1] - i * pieSize[2] + "%"],
        center: settingSeries.center,
        thresholdCode: settingSeries.thresholdCode,
        label: {
          show: false,
        },
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          borderWidth: settingSeries.itemStyle.borderWidth,
        },
        data: [
          ...data,
          {
            value: 100 - sum,
            name: "",
            itemStyle: {
              color: "transparent",
            },
            tooltip: {
              show: false,
            },
            hoverAnimation: false,
          },
          {
            value: 0,
            name: name === "" ? `未分类${Math.random().toString(16).slice(12)}` : name,
            itemStyle: {
              color: "transparent",
            },
            label: {
              show: settingSeries.data[settingSeries.data.length - 1].label.show,
              fontSize: settingSeries.data[settingSeries.data.length - 1].label.fontSize,
              color: settingSeries.data[settingSeries.data.length - 1].label.color,
              position: "inner",
              padding: settingSeries.data[settingSeries.data.length - 1].label.padding,
            },
            tooltip: {
              show: false,
            },
          },
        ],
      };
      return series;
    },
    // rgba转16进制
    getHexColor(color) {
      var values = color
        .replace(/rgba?\(/, "")
        .replace(/\)/, "")
        .replace(/[\s+]/g, "")
        .split(",");
      var a = parseFloat(values[3] || 1),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
      return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
    },
  },
});
</script>
<style scoped></style>
