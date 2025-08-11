/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-08-30 17:24:33
 * @LastEditors: shenah
 * @LastEditTime: 2023-09-08 14:06:08
 */
import label from "./label.js";
import tooltip from "./tooltip.js";
import legend from "./legend.js";
import dataField from "./dataField.js";

/**
 * 创建点图层
 */
export default function createPoint() {
  return dsf.mix(true, {}, label, tooltip, legend, dataField, {
    seriesType: "point",
    point: {
      show: true,
      seriesName: "点",
      zIndex: 120,
      zooms: [2, 20],
      blend: "normal",
      opacity: 1,

      itemStyle: {
        isCalcSize: false, // 是否是自动计算
        basicSize: 50,
        sizeMin: 10,
        sizeMax: 20,
        size: 20,
        unit: "px",
        borderWidth: 0,
        borderColor: "#FFF",
        blurWidth: -1,
        color: "#FFF",
      },
      //悬浮样式
      emphasis: {
        show: false, //有效
        itemStyle: {
          color: "#FFF",
        },
      },
    },
  });
}
