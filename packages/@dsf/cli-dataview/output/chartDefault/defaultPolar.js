/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-04-23 17:23:00
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-04-26 18:05:04
 */
export default function (name, color, type = "bar") {
  return {
    type,
    data: [1, 2, 3, 4, 3, 5, 1],
    coordinateSystem: "polar",
    name,
    valueRelation: "value",
    //数据名称映射
    seriesNameRelation: "",
    //是否包含系类名称映射
    hasNameRelation: false,

    stack: type,
    roundCap: false,

    smooth: false,
    label: {
      show: false,
      color: "#ffffff",
      fontSize: 12,
      position: "top",
    },
    z: 0,
    itemStyle: {
      color,
    },
    lineStyle: {
      width: 3,
    },
    lineSymbol: {
      symbolSize: 4,
      symbol: "circle",
    },
    scatterSymbol: {
      symbolSize: 8,
      symbol: "circle",
    },
    isSize: false,
    scatterBase: 50,
    showSymbol: true,
    symbolSize: 4,
    symbol: "circle",
  };
}
