/*
 * @Description: x轴公用配置
 * @Author: zhanghang
 * @Date: 2021-07-27 14:17:01
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-03 14:47:30
 */
export default {
  //x 轴配置
  xAxis: [
    {
      type: "category",
      inverse: false,
      // 坐标轴线设置
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(220,240,255,0.3)",
        },
      },
      // 坐标刻度设置
      axisTick: {
        show: false,
        //刻度对齐数据系
        alignWithLabel: false,
      },
      // 坐标标签设置
      axisLabel: {
        show: true,
        fontSize: 12,
        rotate: 0,
        color: "#A5C9FF",
        interval: 0, //强制显示文字
      },
      //分割线设置
      splitLine: {
        show: false,
        lineStyle: {
          color: "rgba(220,240,255,0.1)",
          type: "solid",
        },
      },
      //坐标轴名字
      name: "",
      //x轴名称映射
      nameRelation: "",
      //x轴坐标值映射
      valueRelation: "",

      nameShow: false,
      // 坐标轴名字位置
      nameLocation: "center",
      nameTextStyle: {
        color: "#ccc",
        fontSize: 12,
      },
      //名字与轴线距离
      nameGap: 30,
      //两边留白策略
      boundaryGap: true,
      //坐标轴位置
      position: "bottom",
      //数据设置
      data: [],
      isCustomData:false,
      triggerEvent: true,
    },
  ],
};
