/*
 * @Description: y轴公用配置
 * @Author: zhanghang
 * @Date: 2021-07-27 14:17:09
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-11 17:38:34
 */
export default {
  //y 轴配置
  yAxis: [
    {
      type: "value",
      inverse: false,
      // 坐标轴线设置
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(220,240,255,0.3)",
          type: "solid",
        },
      },
      splitNumber: 5,
      // 坐标刻度设置
      axisTick: {
        show: false,
      },
      // 坐标标签设置
      axisLabel: {
        show: true,
        fontSize: 12,
        rotate: 0,
        color: "#A5C9FF",
      },
      //分割线设置
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(220,240,255,0.1)",
        },
      },
      min: null,
      max: null,
      //坐标轴名字
      name: "",
      nameShow: true,
      // 坐标名称映射
      nameRelation: "",
      // 坐标值映射
      valueRelation: "",
      isCustomData: false,
      // 坐标轴名字位置
      nameLocation: "end",
      nameTextStyle: {
        color: "#ccc",
        fontSize: 12,
      },
      //名字与轴线距离
      nameGap: 18,
      //坐标轴位置
      position: "left",
      triggerEvent: true,
    },
  ],
};
const createYAxis = function () {
  return {
    type: "value",
    inverse: false,
    // 坐标轴线设置
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(220,240,255,0.3)",
        type: "solid",
      },
    },
    splitNumber: 5,
    // 坐标刻度设置
    axisTick: {
      show: false,
    },
    // 坐标标签设置
    axisLabel: {
      show: true,
      fontSize: 12,
      rotate: 0,
      color: "#A5C9FF",
    },
    //分割线设置
    splitLine: {
      show: true,
      lineStyle: {
        color: "rgba(220,240,255,0.1)",
      },
    },
    min: null,
    max: null,
    //坐标轴名字
    name: "",
    nameShow: true,
    // 坐标名称映射
    nameRelation: "",
    // 坐标值映射
    valueRelation: "",
    isCustomData: false,
    // 坐标轴名字位置
    nameLocation: "end",
    nameTextStyle: {
      color: "#ccc",
      fontSize: 12,
    },
    //名字与轴线距离
    nameGap: 18,
    //坐标轴位置
    position: "left",
    triggerEvent: true,
  };
};
export { createYAxis };
