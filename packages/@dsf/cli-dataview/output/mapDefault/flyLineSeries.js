/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-04-09 17:35:20
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 09:26:41
 */

export function createFlySeries() {
  return {
    type: "lines",
    name: "飞行线",
    //添加系列名称映射值
    seriesNameRelation: "飞行线",
    //是否包含系类名称映射
    hasNameRelation: false,
    zlevel: 3,
    coordinateSystem: "geo",
    //开始名称映射
    startRelation: "",
    //结束映射
    endRelation: "",
    symbol: "none",
    symbolSize: 10,
    large: true,
    effect: {
      show: true,
      delay: 0,
      period: 4,
      symbol: "arrow",
      constantSpeed: 0,
      symbolSize: 8,
      trailLength: 0.2,
      loop: true,
    },
    lineStyle: {
      color: "rgb(58,115,192)",
      width: 1,
      type: "solid",
      opacity: 0.5,
      curveness: 0.3,
    },
    label: {
      show: false,
      position: "end",

      color: "#fff",
      fontSize: 12,
    },
    animationDurationUpdate: 0,
    data: [],
  };
}
