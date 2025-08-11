/*
 * @Description: 飞行线
 * @Author: zhanghang
 * @Date: 2023-08-28 14:26:58
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-09-09 18:58:22
 */
import tooltip from "./tooltip.js";
import dataField from "./dataField.js";
import legend from "./legend.js";
/**
 * 创建飞行图层
 */
export default function createPulseLink() {
  return dsf.mix(true, {}, tooltip, legend, dataField, {
    seriesType: "pulseLink",
    pulseLink: {
      show: true,
      seriesName: "飞行线",
      zooms: [2, 20],
      zIndex: 120,
      opacity: 1,
      depth: true,

      itemStyle: {
        unit: "meter",
        dash: [40000, 0, 40000, 0],
        lineWidth: function () {
          return [20000, 1000]; //连接线的头尾宽度设置：[起点宽度，终点宽度];
        },
        height: function (feat) {
          //高度，单位为米，代表弧顶的高度。
          return feat.distance / 3 + 10;
        },
        smoothSteps: 30, //平滑步数，代表弧线的分隔段数，越大平滑度越好，但更消耗性能，默认为50。
        speed: 100000, //速度，每个脉冲点行进的速度 单位：米/秒 或者 像素/秒
        lineColors: ["rgb(255,228,105)"],
        maxHeightScale: 0.3, // 弧顶位置比例
        headColor: "rgba(255, 255, 0, 1)", //脉冲点的头部颜色
        trailColor: "rgba(255, 255,0,0)", //脉冲点的尾部颜色
        flowLength: 100000, //脉冲点的长度
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
