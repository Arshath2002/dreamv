/*
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-05-27 10:49:43
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 17:12:52
 */
import common from "./common";
import xaxis from "./xaxis";
import yaxis from "./yaxis";
const createScatter = function () {
  return dsf.mix(
    true,
    {
      //数据系配置
      series: [createScatterSeries("示例", common.color[0])],
      // 散点图x轴是否为数值
      isXValue:false,
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

const createScatterSeries = function (name, color) {
  return {
    type: "scatter",
    name,
    //对应x轴下标
    yAxisIndex: 0,
    //对应y轴下标
    xAxisIndex: 0,
    // 标记图形
    symbol: "circle",
    //标记大小
    symbolSize: 10,
    //标签是否展示
    label: {
      show: true,
      color: "#333",
      position: "top",
      formatter: "{b}",
      fontSize: 12,
    },
    itemStyle: {
      color,
    },
    isSetSize: false, // 控制散点图大小
    isSetYAxis: true, // 散点大小基准轴
    // 基准值
    referenceValue: 200,
    //系列名称映射
    seriesNameRelation: "",
    //是否包含系类名称映射
    hasNameRelation: false,
    // 数据值映射
    valueRelation: "",
    // 数据标签名称映射
    labelRelation: "",
    singleData: [],
    //数据
    data: [
      { name: "直接访问", value: 135 },
      { name: "联盟广告", value: 148 },
      { name: "邮件营销", value: 234 },
      { name: "搜索引擎", value: 448 },
      { name: "直播访问", value: 135 },
    ],
  };
};

export { createScatter, createScatterSeries }