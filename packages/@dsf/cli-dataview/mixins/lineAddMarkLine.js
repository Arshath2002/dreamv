/*
 * @Author: liuhu liuhu@dreamdt.cn
 * @Date: 2023-06-19 11:13:08
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-23 09:59:23
 * @Description: 给series中为line的类型添加下划线设置方式
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// 折线增加markLine逻辑
export default {
  // markline控制参数
  props: {
    isLineAndMarkLine: {
      type: Boolean,
      default: false,
    },
    lineAndMarkLineColor: {
      type: Array,
      default() {
        return [];
      },
    },
    lineAndMarkLineInterval: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    lineAndMarkLineOptions() {
      return {
        symbol: "none",
        splitNum: this.lineAndMarkLineInterval,
        colors: this.lineAndMarkLineColor, // 颜色控制
        lineStyle: {
          width: 1, // 线宽度设置
        },
        data: [],
      };
    },
  },
  watch: {
    lineAndMarkLineOptions() {
      this.$nextTick(() => {
        if (this.isDesign) {
          this.reset();
        }
      });
    },
    isLineAndMarkLine: {
      handler(v) {
        if (this.chart) {
          this.reset();
        }
      },
    },
  },
  methods: {
    addMarkLineToLine(chart = this.chart) {
      if (!chart?.xAxis) {
        return;
      }
      const isXCategory = chart.xAxis[0].type === "category";
      const categoryData = isXCategory ? chart.xAxis[0].data : chart.yAxis[0].data;

      const series = chart.series;

      // 只用于线计数，用于找到对应的标记线颜色
      let lineIdx = 0;
      series.forEach((it) => {
        //属性添加标记线
        if (it.type === "line") {
          if (this.isLineAndMarkLine) {
            this.getMarkLineToLineSeries(it, isXCategory, lineIdx);
            lineIdx++;
          } else {
            this.deleteMarkLineToLineSeries(it);
          }
        }
        //处理标记点
        if (it.markPoint && it.markPoint.data.length) {
          const data = it.data;
          const firstData = data[0];
          const lastData = data[data.length - 1];
          const firstValue = dsf.isObject(firstData) ? firstData.value : firstData;
          const lastValue = dsf.isObject(lastData) ? lastData.value : lastData;
          it.markPoint.data.forEach((it) => {
            switch (it.type) {
              case "first":
                it.coord = [0, firstValue];
                it.value = firstValue;
                break;
              case "last":
                it.coord = [categoryData.length - 1, lastValue];
                it.value = lastValue;
                break;
            }
          });
        }
      });
    },
    /**
     * @description: 生成构造下划线需要配置
     * @param {Object} params
     * @return {Object} 返回新生成的series
     */
    getMarkLineToLineSeries(params, isXCategory, colorIdx) {
      const { markLine, data = [], itemStyle } = params;
      let common = this.lineAndMarkLineOptions;
      // 间隔数
      const splitNum = common.splitNum || 0;
      let startInterVal = 0;
      const markData = [];
      data.forEach((item, idx) => {
        const value = item?.value ? item.value : item;
        if (startInterVal !== idx) {
          return;
        }
        if (isXCategory) {
          markData.push([
            {
              name: "",
              type: "property",
              coord: [idx, 0],
              lineStyle: {
                color: common.colors[colorIdx] || itemStyle.color,
              },
            },
            {
              coord: [idx, value],
            },
          ]);
        } else {
          markData.push([
            {
              name: "",
              type: "property",
              coord: [0, idx],
              lineStyle: {
                color: common.colors[colorIdx] || itemStyle.color,
              },
            },
            {
              coord: [value, idx],
            },
          ]);
        }
        startInterVal += splitNum + 1;
      });
      let targetLineData = [];
      let property = {};
      //兼容已设置的markerLine
      if (markLine) {
        const { data, ...properties } = markLine;
        property = properties;
        // 过滤出原有
        targetLineData = data.filter((item) => !this.isPropertyLine(item));
      }
      params.markLine = {
        ...common,
        ...property,
        data: [...targetLineData, ...markData],
      };
      return params;
    },
    //删除折线图的标线
    deleteMarkLineToLineSeries(params) {
      const { markLine } = params;
      if (markLine) {
        markLine.data = markLine.data.filter((item) => !this.isPropertyLine(item));
        if (!markLine.data.length) {
          Reflect.deleteProperty(params, "markLine");
        }
      }
      return params;
    },
    isPropertyLine(it) {
      return Array.isArray(it) && it[0].type === "property";
    },
  },
};
