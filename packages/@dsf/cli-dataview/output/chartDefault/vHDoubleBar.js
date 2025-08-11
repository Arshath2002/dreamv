/*
 * @Description: 横竖双柱图默认配置
 * @Author: shenah
 * @Date: 2023-03-22 18:17:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 14:40:08
 */
//横排
export const hOptions = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    textStyle: {
      align: "left",
    },
    confine: true,
    formatter: function (a) {
      var v = a[0];
      return v.name + "<br/>" + v.marker + v.seriesName + "：" + Math.abs(v.value);
    },
  },
  legend: {
    show: true,
    left: "auto",
    top: "auto",
    right: "center",
    bottom: "auto",
    orient: "horizontal",
    custom: true, // 自定义位置
    icon: "",
    textStyle: {
      color: "#777777",
      fontSize: 14,
      fontFamily: "Microsoft Yahei",
    },
    data: ["示例", "示例2"],
  },
  grid: [
    {
      show: false,
      left: 10,
      right: 10,
      top: 30,
      bottom: "50%",
      containLabel: true,
    },
    {
      show: false,
      left: 10,
      right: 10,
      top: "50%",
      bottom: 20,
      containLabel: true,
    },
  ],
  yAxis: [
    {
      gridIndex: 0,
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    {
      gridIndex: 1,
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
  ],
  xAxis: [
    {
      type: "category",
      gridIndex: 0,
      nameRelation: "",
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(220, 240, 255, 1)",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        interval: 0,
        color: "#777777",
        fontSize: 14,
        fontFamily: "Microsoft Yahei",
        textStyle: {
          padding: [-2, 0, 0, 0],
        },
      },
      splitLine: {
        show: false,
      },
      boundaryGap: true,
      interval: 0,
      data: [],
    },
    {
      gridIndex: 1,
      type: "category",
      nameRelation: "",
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(220, 240, 255, 1)",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      boundaryGap: true,
      interval: 0,
      data: [],
    },
  ],
  series: [
    {
      name: "示例",
      type: "bar",
      seriesNameRelation: "",
      //是否包含系类名称映射
      hasNameRelation: false,
      valueRelation: "value",
      barWidth: 20,
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgb(63, 178, 255)", // 0% 处的颜色
            },
            {
              offset: 0.99,
              color: "rgba(24, 39, 254,0)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        startColor: "rgb(63, 178, 255)",
        endColor: "rgba(24, 39, 254,0)",
        barBorderRadius: 4,
      },
      label: {
        color: "#777777",
        show: true,
        position: "top",
        fontFamily: "Microsoft Yahei",
        formatter: function (v) {
          return Math.abs(v.value);
        },
      },
      data: [],
    },
    {
      name: "示例2",
      type: "bar",
      seriesNameRelation: "",
      //是否包含系类名称映射
      hasNameRelation: false,
      valueRelation: "value2",
      barWidth: 20,
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(0, 128, 205, 0)", // 0% 处的颜色
            },
            {
              offset: 0.99,
              color: "rgb(47, 227, 220)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        startColor: "rgba(0, 128, 205, 0)",
        endColor: "rgb(47, 227, 220)",
        barBorderRadius: 4,
      },
      label: {
        color: "#777777",
        show: true,
        position: "bottom",
        fontFamily: "Microsoft Yahei",
        formatter: function (v) {
          return Math.abs(v.value);
        },
      },
      data: [],
    },
  ],
};
//竖排
export const vOptions = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    confine: true,
    formatter: function (a) {
      var v = a[0];
      return v.name + "<br/>" + v.marker + v.seriesName + "：" + Math.abs(v.value);
    },
  },
  legend: {
    show: true,
    left: "auto",
    top: "auto",
    right: "center",
    bottom: "auto",
    orient: "horizontal",
    icon: "",
    custom: true, // 自定义位置
    textStyle: {
      color: "#777777",
      fontSize: 14,
      fontFamily: "Microsoft Yahei",
    },
    data: ["示例", "示例2"],
  },
  grid: [
    {
      top: 30,
      right: "50%",
      left: 30,
      bottom: 5,
      containLabel: true,
      gridIndex: 0,
    },
    {
      top: 30,
      left: "50%",
      right: 30,
      containLabel: true,
      bottom: 5,
      gridIndex: 1,
    },
  ],
  xAxis: [
    {
      type: "value",
      gridIndex: 0,
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: {
        // Y轴轴线样式
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    {
      type: "value",
      gridIndex: 1,
      axisTick: {
        show: false,
      }, //是否显示刻度
      axisLine: {
        // Y轴轴线样式
        show: false, // 是否显示X轴
      },
      axisLabel: {
        show: false, //是否显示X轴内容
      },
      splitLine: {
        show: false,
      },
    },
  ],
  yAxis: [
    {
      type: "category",
      nameRelation: "",
      gridIndex: 0,
      inverse: true,
      data: [],
      axisTick: { show: false },
      axisLabel: { show: false, color: "#777777", fontSize: 14 },
      axisLine: {
        // Y轴轴线样式
        show: true,
        lineStyle: {
          color: "rgba(220, 240, 255, 1)",
        },
      },
    },
    {
      type: "category",
      nameRelation: "",
      gridIndex: 1,
      inverse: true,
      data: [],
      axisTick: { show: false },
      axisLabel: {
        show: true,
        interval: 0,
        color: "#777777",
        fontSize: 14,
        fontFamily: "Microsoft Yahei",
        textStyle: {
          padding: [0, -2, 0, 0],
        },
      },
      axisLine: {
        // Y轴轴线样式
        show: true,
        lineStyle: {
          color: "rgba(220, 240, 255, 1)",
        },
      },
    },
  ],
  series: [
    {
      name: "示例",
      type: "bar",
      barWidth: 20,
      seriesNameRelation: "",
      //是否包含系类名称映射
      hasNameRelation: false,
      valueRelation: "value",
      gridIndex: 0,
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "rgb(63, 178, 255)", // 0% 处的颜色
            },
            {
              offset: 0.99,
              color: "rgba(24, 39, 254,0)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        startColor: "rgb(63, 178, 255)",
        endColor: "rgba(24, 39, 254,0)",
        barBorderRadius: 4,
      },
      label: {
        color: "#777777",
        show: true,
        position: "left",
        formatter: function (v) {
          return Math.abs(v.value);
        },
      },
      data: [],
    },
    {
      name: "示例2",
      type: "bar",
      barWidth: "20",
      seriesNameRelation: "",
      //是否包含系类名称映射
      hasNameRelation: false,
      valueRelation: "value2",
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        show: true,
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "rgba(0, 128, 205, 0)", // 0% 处的颜色
            },
            {
              offset: 0.99,
              color: "rgb(47, 227, 220)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        startColor: "rgba(0, 128, 205, 0)",
        endColor: "rgb(47, 227, 220)",
        barBorderRadius: 4,
      },
      label: {
        color: "#777777",
        show: true,
        position: "right",
        formatter: function (v) {
          return v.value;
        },
      },
      data: [],
    },
  ],
};
