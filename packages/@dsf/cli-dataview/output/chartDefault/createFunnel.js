/*
 * @Description: 饼状图默认配置项
 * @Author: zhanghang
 * @Date: 2021-07-28 13:48:57
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 17:33:04
 */
import common from "./common";
const createFunnel = function () {
  return dsf.mix(
    true,
    {
      //数据系配置
      series: [createFunnelSeries()],
      //提示配置
      tooltip: {
        trigger: "item",
        textStyle: {
          align: "left",
        },
        confine: true,
      },
    },
    common
  );
};

const createFunnelSeries = function (name = "漏斗图示例") {
  return {
    name,
    type: "funnel",
    left: "10%",
    top: 30,
    bottom: 60,
    right: 10,
    width: "80%",
    height: "80%",
    min: 0,
    max: 100,
    minSize: "0%",
    maxSize: "100%",
    orient: "vertical",
    funnelAlign: "center",
    sort: "descending",
    gap: 2,
    label: {
      show: true,
      fontSize: 12,
      formatter: "{b}",
      color: "#A5C9FF",
      position: "inside",
    },
    emphasis: {
      label: {
        show: true,
        fontSize: "18",
        fontWeight: "bold",
      },
    },
    labelLine: {
      length: 20,
      show: true,
      lineStyle: {
        width: 1,
        type: "solid",
      },
    },
    itemStyle: {
      borderColor: "#fff",
      borderType: "solid",
      borderWidth: 1,
    },
    singleData: [],
    data: [
      { value: 60, name: "访问", itemStyle: { color: common.color[0] } },
      { value: 40, name: "咨询", itemStyle: { color: common.color[1] } },
      { value: 20, name: "订单", itemStyle: { color: common.color[2] } },
      { value: 80, name: "点击", itemStyle: { color: common.color[3] } },
      { value: 100, name: "展现", itemStyle: { color: common.color[4] } },
    ],
    //数据名称映射
    nameRelation: "",
    //数据值映射
    valueRelation: "",
    //数据名称映射
    seriesNameRelation: "",
    //是否包含系类名称映射
    hasNameRelation: false,
  };
};

export { createFunnelSeries, createFunnel };
