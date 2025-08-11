/*
 * @Description: 图标图片图层
 * @Author: shenah
 * @Date: 2023-10-30 09:26:27
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-11 15:44:45
 */
import label from "./label.js";
import tooltip from "./tooltip.js";
import legend from "./legend.js";
import dataField from "./dataField.js";

/**
 * 创建图标图层
 */
export default function createIcon() {
  return dsf.mix(true, {}, label, tooltip, legend, dataField, {
    seriesType: "icon",
    icon: {
      show: true,
      seriesName: "图标",
      zIndex: 120, // 显示层级
      zooms: [2, 20],
      opacity: 1,
      itemStyle: {
        unit: "px",
        icon: "default",
        iconObj: {},
        iconSize: [30, 30], // 图标大小
        offset: [0, 0], // 图标的偏移量
      },
      //悬浮样式
      emphasis: {
        show: false, //有效
        itemStyle: {},
      },
    },
    label: {
      show: true,
    },
  });
}
