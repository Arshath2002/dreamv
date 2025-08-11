/*
 * @Description: webGL飞线的配置
 * @Author: shenah
 * @Date: 2024-07-24 16:55:59
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 09:25:46
 */



export function createFlySeries (){
  return  {
    type: "lines3D",
    name: "飞行线",
    //添加系列名称映射值
    seriesNameRelation: "飞行线",
    //是否包含系类名称映射
    hasNameRelation: false,
    //数据名称映射
    nameRelation: "",
    //数据值映射
    valueRelation: "",
    zlevel: 3,
    coordinateSystem: "globe",
    //开始名称映射
    startRelation: "",
    //结束映射
    endRelation: "",
    effect: {
      show: true,
      period: 4,
      trailWidth: 4,
      trailOpacity: null,
      trailColor: "#fff",
      constantSpeed: null,
      trailLength: 0.2,
    },
    lineStyle: {
      color: "rgb(58,115,192)",
      width: 1,
      opacity: 0.5,
    },
    blendMode: "source-over",
    data: [],
  };
}
