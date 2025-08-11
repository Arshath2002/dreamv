/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-05-27 10:49:43
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 17:24:59
 */
import common from "./common";
import xaxis from "./xaxis";
import yaxis from "./yaxis";

const createPictorialBar = function () {
  return dsf.mix(
    true,
    {
      //数据系配置
      series: [createPictorialBarSeries("象形图", common.color[0])],
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

const createPictorialBarSeries = function (name, color) {
  return {
    type: "pictorialBar",
    name,
    //对应x轴下标
    yAxisIndex: 0,
    //对应y轴下标
    xAxisIndex: 0,
    //标签是否展示
    label: {
      show: false,
      color: "#fff",
      position: "inside",
      fontSize: 12,
    },
    // 柱体样式
    itemStyle: {
      color,
      // 柱体圆角
      barBorderRadius: [0, 0, 0, 0],
    },
    // 不同柱系间隙
    barGap: "0%",
    // 相同柱系间隙
    barCategoryGap: "20%",
    // 柱体宽度
    barWidth: "80%",
    //图形类型
    symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",

    $symbol: "",

    symbolSize: ["100%", "100%"],

    symbolPosition: "start",

    symbolOffset: [0, 0],

    symbolRepeat: false,
    //系列名称映射
    seriesNameRelation: "",
    //是否包含系类名称映射
    hasNameRelation: false,
    //数据值映射
    valueRelation: "value",
    //数据
    data: [820, 932, 901, 934, 1290, 1330, 1320],
  };
};

export { createPictorialBar, createPictorialBarSeries };
