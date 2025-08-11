/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-08-25 18:01:46
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-09-27 14:56:25
 */
import tooltip from "./tooltip.js";
import legend from "./legend.js";
import visualMap from "./visualMap.js";
import dataField from "./dataField.js";

/**
 * 创建热力图层
 */
export default function createHeatMap() {
  return dsf.mix(true, {}, tooltip, legend, dataField, {
    seriesType: "heatMap",
    heatMap: {
      seriesName: "热力图",
      show: true,
      zIndex: 120,
      zooms: [2, 20],
      opacity: 1,
      itemStyle: {
        size: 20, //热力的聚合半径
        value: function (f) {
          return Number(f.properties.value);
        },
        gradient: {
          //热力的颜色梯度
          0.1: "#2A85B8",
          0.2: "#16B0A9",
          0.3: "#29CF6F",
          0.4: "#5CE182",
          0.5: "#7DF675",
          0.6: "#FFF100",
          0.7: "#FAA53F",
          1: "#D04343",
        },
        opacity: [0, 1],
        height: 1, //热力最高点的高度值
        heightBezier: [0.4, 0.2, 0.4, 0.8], //热力的最低点到最高点的变化曲线
        max: null,
        min: 0,
        unit: "px",
        difference: false,
        isCalcSize: false, // 是否是自动计算
        basicSize: 50, // 基准点
        sizeMin: 10, // 最大值
        sizeMax: 20, // 最小值
        ...visualMap, // 视觉映射
      },
      //悬浮样式
      emphasis: {
        show: false,
      },
    },
    tooltip: {
      show: false,
    },
  });
}
