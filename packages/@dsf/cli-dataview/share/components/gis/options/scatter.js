/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2025-02-07 16:54:29
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-12 17:59:01
 */
import label from "./label.js";
import tooltip from "./tooltip.js";
import legend from "./legend.js";
import dataField from "./dataField.js";
/**
 * 创建贴地点图层
 */
export default function createScatter() {
  return dsf.mix(true, {}, label, tooltip, legend, dataField, {
    seriesType: "scatter",
    scatter: {
      show: true,
      seriesName: "贴地点",
      zIndex: 120,
      zooms: [2, 20],
      opacity: 1,
      isShowHighAttr: false, // 是否显示高级属性
      itemStyle: {
        size: [40, 40],
        rotation: 0,
        color: "#ff0000",
        altitude: 0,
        borderWidth: 0,
        borderColor: "#008000",
        texture: "default",
        textureObj: {},
        unit: "px",
        useDefaultTexture: true,
        animate: true,
        duration: 1000,
      },
      //悬浮样式
      emphasis: {
        show: false, //有效
        itemStyle: {
          color: "#0000ff",
          borderColor: "#fff",
        },
      },
    },
  });
}
