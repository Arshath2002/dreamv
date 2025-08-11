/*
 * @Description: 柱图默认的配置选项
 * @Author: zhanghang
 * @Date: 2021-07-21 15:00:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 16:43:03
 */
import common from "./common";
import xaxis from "./xaxis";
import yaxis from "./yaxis";

/**
 * 创建柱图系列
 * @param {*} name
 * @param {*} color
 * @returns
 */
const createBarSeries = function (name, color) {
  return {
    type: "bar",
    isStack: false, // 是否数据堆叠
    stack: "", // 数据堆叠分组
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
      isCanvas: false,
      barColor: color,
      canvasConfig: {
        lineWidth: 5,
        distance: 2,
      },
    },
    // 不同柱系间隙
    barGap: "30%",
    // 相同柱系间隙
    barCategoryGap: "10%",
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
    //数据
    data: [],
    // 单个数据颜色设置
    singleData: [],
  };
};
/**
 * 创建柱图option
 * @returns
 */
const createBar = function () {
  return dsf.mix(
    true,
    {},
    {
      //数据系配置
      series: [createBarSeries("示例", common.color[0])],
      //提示配置
      tooltip: {
        trigger: "axis",
        textStyle: {
          align: "left",
        },
        confine: true,
      },
      isReturn: false,
    },
    common,
    xaxis,
    yaxis
  );
};
export { createBarSeries, createBar };
