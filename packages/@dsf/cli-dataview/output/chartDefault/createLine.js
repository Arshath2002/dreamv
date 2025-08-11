import common from "./common.js";
import xaxis from "./xaxis.js";
import yaxis from "./yaxis.js";
import visualMap from "./defaultVisualMap.js";
const createLine = function () {
  return dsf.mix(
    true,
    {
      visualMap,
      //数据系配置
      series: [createLineSeries("示例", common.color[0])],
      //y 轴配置
      yAxis: [
        {
          type: "value",
          // 坐标轴线设置
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(220,240,255,0.5)",
            },
          },
          // 坐标刻度设置
          axisTick: {
            show: false,
          },
          // 坐标标签设置
          axisLabel: {
            show: true,
            fontSize: 12,
            rotate: 0,
            color: "#A5C9FF",
          },
          //分割线设置
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(220,240,255,0.1)",
            },
          },
          min: null,
          //坐标轴名字
          name: "",
          // 坐标轴名字位置
          nameLocation: "end",
          nameTextStyle: {
            color: "#ccc",
            fontSize: 12,
          },
          //名字与轴线距离
          nameGap: 18,
          //坐标轴位置
          position: "left",
        },
      ],
      //提示配置
      tooltip: {
        trigger: "axis",
        textStyle: {
          align: "left",
        },
        confine: true,
      },
    },
    common,
    xaxis,
    yaxis
  );
};

const createLineSeries = function (name, color) {
  return {
    type: "line",
    name,
    //对应x轴下标
    yAxisIndex: 0,
    //对应y轴下标
    xAxisIndex: 0,
    // 标记图形
    symbol: "emptyCircle",
    //标记大小
    symbolSize: 4,
    //是否添加视觉映射
    isVisualMap: false,
    //是否展示标记
    showSymbol: false,
    //标签是否展示
    label: {
      show: false,
      color: "#fff",
      position: "top",
      fontSize: 12,
    },
    //是否平滑
    smooth: true,
    isShowAreaStyle: false, // 是否显示区域颜色
    // 线条样式
    itemStyle: {
      color,
    },
    lineStyle: {
      width: 2,
      type: "solid",
    },
    //系列名称映射
    seriesNameRelation: "",
    //是否包含系类名称映射
    hasNameRelation: false,
    //数据值映射
    valueRelation: "value",
    //数据
    data: [],

    //单个标记点
    markPoint: {
      symbol: "pin",
      symbolSize: 50,
      symbolOffset: [0, 0],
      label: {
        show: true,
        color: "#fff",
        position: "inside",
        fontSize: 12,
      },
      data: [],
    },
  };
};

export { createLineSeries, createLine };
