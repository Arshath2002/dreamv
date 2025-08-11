/*
 * @Description: 极地坐标
 * @Author: shenah
 * @Date: 2023-06-08 10:54:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 18:20:44
 */

import common from "./common";
import defaultPolar from "./defaultPolar.js";

const createPolar = function () {
 return dsf.mix(
  true,
  {
    angleAxis: {
      type: "category",
      nameRelation: "name",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(51, 51, 51, 1)",
        },
      },
      // 坐标刻度设置
      axisTick: {
        show: true,
        //刻度对齐数据系
        alignWithLabel: false,
      },
      // 坐标标签设置
      axisLabel: {
        show: true,
        fontSize: 12,
        rotate: 0,
        color: "rgba(51, 51, 51, 1)",
        interval: 0, //强制显示文字
      },
      //分割线设置
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(51, 51, 51, 0.5)",
        },
      },
      //是否顺时针
      clockwise: true,
      //起始角度
      startAngle: 0,
    },
    radiusAxis: {
      nameRelation: "",
      // 坐标轴线设置
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(51, 51, 51, 1)",
        },
      },
      // 坐标刻度设置
      axisTick: {
        show: true,
        //刻度对齐数据系
        alignWithLabel: false,
      },
      // 坐标标签设置
      axisLabel: {
        show: true,
        fontSize: 12,
        rotate: 0,
        color: "rgba(51, 51, 51, 1)",
        interval: 0, //强制显示文字
      },
      //分割线设置
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(51, 51, 51, 0.5)",
        },
      },
    },
    polar: {
      center: ["50%", "50%"],
      radius: ["0%", "75%"],
    },
    series: [defaultPolar("极坐标", common.color[0])],
    tooltip: {
      trigger: "axis",
      textStyle: {
        align: "left",
      },
      confine: true,
    },
  },
  common
);

};
export {
  createPolar
} 