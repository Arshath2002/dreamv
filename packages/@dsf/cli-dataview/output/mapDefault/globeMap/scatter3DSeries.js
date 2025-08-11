/*
 * @Description: webGL散点配置
 * @Author: shenah
 * @Date: 2024-07-25 10:32:33
 * @LastEditors: shenah
 * @LastEditTime: 2024-07-29 10:46:02
 */

export function createScatter() {
  return {
    type: "scatter3D",
    name: "散点",
    //添加系列名称映射值
    seriesNameRelation: "散点",
    //是否包含系类名称映射
    hasNameRelation: false,
    coordinateSystem: "globe",
    symbol: "circle",
    symbolSize: 15,
    symbolOffset: [0, 0],
    isBaseValue: false,
    baseValue: 15,
    itemStyle: {
      color: "red",
      opacity: 0.8,
      borderWidth: 0,
      borderColor: "rgba(255,255,255,0)",
    },
    label: {
      show: false,
      position: "top",
      textStyle: {
        color: "#fff",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0)",
        fontSize: 14,
        fontWeight: "normal",
      },
    },
    emphasis: {
      itemStyle: {
        color: "blue",
        opacity: 0.8,
        borderWidth: 0,
        borderColor: "rgba(255,255,255,0)",
      },
      label: {
        show: false,
        textStyle: {
          color: "#fff",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0)",
          fontSize: 14,
          fontWeight: "normal",
        },
      },
    },
    blendMode: "source-over",
    zlevel: 4,
    data: [],
    silent: false,
  };
}
