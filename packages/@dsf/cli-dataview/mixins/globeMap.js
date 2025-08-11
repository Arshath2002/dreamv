/*
 * @Description: 全球地图
 * @Author: shenah
 * @Date: 2024-07-29 09:20:56
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-11 13:52:34
 */

import graph from "./graph.js";
import { eventTemp } from "_dataview/output/utils/relativeEvent";
/**
 * @name: 随机取数
 * @param {*} arr 数组
 * @param {*} n 最大取多少个
 * @return {*}
 */
const getRandomIndices = function (arr, n) {
  const indices = Array.from({ length: arr.length }, (_, i) => i);
  const result = [];
  // Fisher-Yates 洗牌算法
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]; // 交换元素
  }
  // 选择前 n 个下标
  for (let i = 0; i < n; i++) {
    result.push({
      index: indices[i],
      item: arr[indices[i]],
    });
  }
  return result;
};
export default {
  mixins: [graph],
  props: {
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          //组件初始化事件
          mounted: {
            relatives: [],
            fn: eventTemp,
          },
          //数据加载完成事件
          dataLoad: {
            relatives: [],
            fn: eventTemp,
          },
          load: {
            relatives: [],
            fn: eventTemp,
          },
          click: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
  },
  watch: {},
  data() {
    return {
      mapjson: {},
      otherEvents: [],
      // 图表对象
      chartObj: null,
      clickTimer: null,
      //地图列表
      mapNames: [],
      coordMap: new Map(),
    };
  },
  methods: {
    //双击依赖组件关联方法
    loaddbClickEvents(data) {
      let { fn } = this.eventRelativeDeal.dbclick;
      this.currentComponentData = data;
      this.handleCommonEmit(fn, data);
    },
    //区域分段等数据
    areaHotData(data, chart = this.chart) {
      let valData = [];
      let areaSeries = chart.baseTextureOptions.series[0];
      let nameRelation = areaSeries.nameRelation || "name";
      let valueRelation = areaSeries.valueRelation || "value";
      let seriesNameRelation = areaSeries.seriesNameRelation;
      data.forEach((item, index) => {
        if (index == 0 && seriesNameRelation != undefined) {
          let seriesName = item[seriesNameRelation] ? item[seriesNameRelation] : seriesNameRelation;
          areaSeries.name = seriesName;
        }
        if (item[valueRelation] != undefined) {
          let name = nameRelation ? item[nameRelation] : nameRelation;
          valData.push({
            ...item,
            name: name,
            value: item[valueRelation],
          });
        }
      });
      areaSeries.data = valData;
    },
    /**
     * @name: 添加散点
     * @param {*} data 数据
     * @param {*} seriesName 数据系列名称
     * @param {*} chart 配置项
     * @return {*} 返回符合
     */
    addScatter(data, seriesName, chart = this.chart) {
      let series = chart.series.find((it) => it.name == seriesName);
      if (!series) return false;
      series.data = data
        .map((it) => {
          let coordMap = this.coordMap;
          // 兼容坐标系
          if (typeof it.value === "string" && it.value.indexOf(",") > -1) {
            return {
              ...it,
              name: it.name,
              visualMap: false,
              value: it.value.split(","),
            };
          } else if (Array.isArray(it.value)) {
            return {
              ...it,
              name: it.name,
              visualMap: false,
              value: it.value,
            };
          }
          //过滤出有数值的数据
          if (coordMap.get(it.name) && it.value != "" && it.value != null) {
            return {
              ...it,
              name: it.name,
              visualMap: false,
              value: coordMap.get(it.name) ? coordMap.get(it.name).concat(it.value) : [],
            };
          } else {
            return null;
          }
        })
        .filter((it) => it);
    },
    /**
     * @name: 添加飞行线
     * @param {*} data 数据
     * @param {*} seriesName 数据系列名称
     * @param {*} chart 配置项
     * @return {*} 返回符合
     */
    addFlyLine(data, seriesName, chart = this.chart) {
      let series = chart.series.find((it) => it.name == seriesName);
      if (!series) return false;
      series.data = data.map((it) => {
        let coordMap = this.coordMap;
        let start = coordMap.get(it[0]) ? coordMap.get(it[0]) : [];
        let end = coordMap.get(it[1]) ? coordMap.get(it[1]) : [];
        //兼容坐标系
        if (typeof it[0] == "string" && it[0].indexOf(",") > -1) {
          start = it[0].split(",");
        } else if (Array.isArray(it[0])) {
          start = it[0];
        }
        if (typeof it[1] == "string" && it[1].indexOf(",") > -1) {
          end = it[1].split(",");
        } else if (Array.isArray(it[1])) {
          end = it[1];
        }

        return {
          ...it,
          visualMap: false,
          coords: [start, end],
        };
      });
    },
    /**
     * @name: 静态数据创建随机数据
     * @param {*} type 类型
     * @return {*} 返回符合
     */
    createdDataRandom(type) {
      let res = [];
      let coordMap = this.coordMap;
      let keys = [...coordMap.keys()];
      let newArr = getRandomIndices(keys, 10);
      let start = coordMap.get("中国") || [116.2, 39.56];
      newArr.forEach((item) => {
        let end = coordMap.get(item.item);
        if (type === "lines3D") {
          res.push({
            coords: [start, end],
            name: item.item,
            value: parseInt(1000 * Math.random()),
          });
        } else if (type === "scatter3D") {
          res.push({
            name: item.item,
            value: [end[0], end[1], parseInt(1000 * Math.random())],
          });
        }
      });
      return res;
    },
    addDomeData(data, seriesName, chart = this.chart) {
      let series = chart.series.find((it) => it.name == seriesName);
      if (!series) return false;
      series.data = data;
    },
    // 散点图
    getMapShapeScatter(item) {
      // 是否存在基准值
      if (!item.baseValue) {
        item.baseValue = 12;
      }
      item.isBaseValue = !!item.isBaseValue;
      item.data = this.dealScatterDataSymbolSize(item);
      return item;
    },
    /**
     * @name: 散点大小计算方式, base表示当前最大数据的size
     * @param {*} params
     * @return {*} 散点的options以及尺寸
     */
    dealScatterDataSymbolSize(params) {
      const { data, baseValue = 12, isBaseValue = false, symbolSize = 12 } = params;
      // 散点取数据的方式
      const calculateData = data.map((item) => item.value[2]);
      const total = calculateData.reduce((max, item) => {
        let value = parseFloat(item);
        if (isNaN(value)) {
          value = 0;
        }
        return Math.max(max, value);
      }, 0);

      return data.map((item, idx) => {
        let value = parseFloat(calculateData[idx]);
        if (isNaN(value)) {
          value = 0;
        }
        return {
          ...item,
          symbolSize: isBaseValue ? Math.round((value / total) * baseValue) : symbolSize,
        };
      });
    },
    //事件添加
    resetCallback() {
      let chart = this.chartObj;
      let baseTextureCanvas = this.baseTextureCanvas;
      try {
        chart.off("click");
        if (baseTextureCanvas) {
          baseTextureCanvas.off("click");
        }
      } catch (error) {
        console.log(error);
      }

      chart.on("click", (params) => {
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => {
          // echarts 点击事件
          let item = null;
          if (Array.isArray(this.data)) {
            item = this.data.find((it) => it.name === params.name);
          }
          if (item) {
            params = item;
          }
          if (this.$listeners["chart-click"]) {
            this.$dispatch("chart-click", params);
          }
          this.loadClickEvents({
            ...params,
            clickType: "point",
          });
        }, 500);

        if (baseTextureCanvas) {
          baseTextureCanvas.on("click", (params) => {
            clearTimeout(this.clickTimer);
            this.clickTimer = setTimeout(() => {
              // echarts 点击事件
              let item = null;
              if (Array.isArray(this.data)) {
                item = this.data.find((it) => it.name === params.name);
              }
              if (item) {
                params = item;
              }
              if (this.$listeners["chart-click"]) {
                this.$dispatch("chart-click", params);
              }
              this.loadClickEvents({
                ...params,
                clickType: "area",
              });
            }, 500);
          });
        }
      });
    },
  },
};
