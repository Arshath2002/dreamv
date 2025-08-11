/*
 * @Description:平面柱
 * @Author: zhanghang
 * @Date: 2023-08-18 14:37:34
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-11 15:44:14
 */
import label from "./label.js";
import tooltip from "./tooltip.js";
import legend from "./legend.js";
import visualMap from "./visualMap.js";
import dataField from "./dataField.js";
/**
 * 创建2d圆柱图层
 */
export default function createFlatBar() {
  return dsf.mix(true, {}, label, tooltip, legend, dataField, {
    seriesType: "flatBar",
    flatBar: {
      show: true,
      seriesName: "柱体",
      isShowHighAttr: false,
      zIndex: 120, // 显示层级
      zooms: [2, 20],
      opacity: 1,
      barType: "1", // 1代表的是柱体2代表的是圆柱3代表的棱柱
      itemStyle: {
        //开启色阶
        range: {
          show: false,
          mode: "range",
          rules: [
            {
              value: 0,
              color: "#00FF15",
              label: ">=0",
            },
          ],
          color: ["rgba(197, 20, 20, 1)", "rgba(0, 110, 221, 1)"],
          min: 0,
          max: 1000,
        },
        topColor: "#06829e", //面的顶面颜色
        sideLeftColor: "#06829e", //面的侧面左面的颜色
        sideRightColor: "#06829e", //面的侧面右面的颜色
        width: 10,
        height: 100, // 高度
        borderColor: "rgba(255,255,255,0)",
        borderWidth: 0,
        isCalcHeight: false, // 是否是自动计算
        basicHeight: 50,
        heightMin: 10,
        heightMax: 200,
        offset: [0, 0], // 偏移量
        ...visualMap, // 视觉映射
      },
      //悬浮样式
      emphasis: {
        show: false, //有效
        itemStyle: {
          topColor: "rgba(41, 158, 6, 1)", //面的顶面颜色
          sideLeftColor: "rgba(41, 158, 6, 1)", //面的侧面左面的颜色
          sideRightColor: "rgba(41, 158, 6, 1)", //面的侧面右面的颜色
        },
      },
    },
  });
}
