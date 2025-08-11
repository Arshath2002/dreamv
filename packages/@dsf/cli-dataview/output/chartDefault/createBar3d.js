import common from "./common";
import xaxis from "./xaxis";
import yaxis from "./yaxis";

const createBar3d = function () {
  return dsf.mix(true, {}, common, xaxis, yaxis, {
    //数据系配置
    series: [createBar3dSeries()],
    //提示配置
    tooltip: {
      trigger: "axis",
      textStyle: {
        align: "left",
      },
      confine: true,
    },
    isReturn: false,
  });
};
const createBar3dSeries = function (name = "示例", shape = "clinder") {
  return {
    type: "custom",
    clip: false, // 解决(一些柱体超出的部分)
    stack: false,
    name,
    //对应x轴下标
    yAxisIndex: 0,
    shape, // clinder 圆柱， cube 立方体
    //对应y轴下标
    xAxisIndex: 0,
    showAll: 1,
    //标签是否展示
    label: {
      show: false,
      color: "#fff",
      position: "inside",
      fontSize: 12,
    },

    barGap: "5",
    // 柱体样式
    itemStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 1,
            color: "#0048CB", // 0% 处的颜色
          },
          {
            offset: 0,
            color: "#0EC3FF", // 100% 处的颜色
          },
        ],
        global: false,
      },
      // 柱体圆角
      borderRadius: [0, 0, 0, 0],
      // 3d柱状图颜色
      cubeColors: [
        ["rgba(168,255,255,1)", "rgba(238,255,255,1)"],
        ["rgba(78,220,220,1)", "rgba(193,250,250,1)"],
        ["rgba(219,255,255,1)", "rgba(223,255,255,1)"],
      ],
    },
    // 柱体宽度
    barWidth: "20%",
    //柱子背景色
    showBackground: false,
     //数据名称映射
     seriesNameRelation: "",
     //是否包含系类名称映射
     hasNameRelation: false,
    //数据值映射
    valueRelation: "value",
    renderItem: null,
    //数据
    data: [888, 932, 901, 934, 1290, 1330, 1320],
  };
};

export { createBar3d, createBar3dSeries };
