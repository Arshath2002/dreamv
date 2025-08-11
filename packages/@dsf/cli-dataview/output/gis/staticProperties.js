/*
 * @Description: 不同地图的风格
 * @Author: zhanghang
 * @Date: 2023-09-04 15:50:18
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-14 10:21:04
 */


import { showBMapFeatureList } from "./BMap/BMapConfig";

let AMap = {
  styleList: [
    {
      name: "标准",
      value: "amap://styles/normal",
    },
    {
      name: "幻影黑",
      value: "amap://styles/dark",
    },
    {
      name: "月光银",
      value: "amap://styles/light",
    },
    {
      name: "远山黛",
      value: "amap://styles/whitesmoke",
    },
    {
      name: "草色青",
      value: "amap://styles/fresh",
    },
    {
      name: "雅士灰",
      value: "amap://styles/grey",
    },
    {
      name: "涂鸦",
      value: "amap://styles/graffiti",
    },
    {
      name: "马卡龙",
      value: "amap://styles/macaron",
    },
    {
      name: "靛青蓝",
      value: "amap://styles/blue",
    },
    {
      name: "极夜蓝",
      value: "amap://styles/darkblue",
    },
    {
      name: "酒红",
      value: "amap://styles/wine",
    },
  ],
  featureList: [
    {
      name: "区域面",
      value: "bg",
    },
    {
      name: "道路",
      value: "road",
    },
    {
      name: "建筑物",
      value: "building",
    },
    {
      name: "标注",
      value: "point",
    },
  ],
};

let MineMap = {
  styleList: [
    {
      name: "标准",
      value: "11001",
    },
    {
      name: "都市黑夜",
      value: "11002",
    },
    {
      name: "极夜蓝",
      value: "11003",
    },
    {
      name: "淡雅白",
      value: "11004",
    },
  ],
  featureList: [
    {
      name: "区域面",
      value: "bg",
    },
    {
      name: "道路",
      value: "road",
    },
    {
      name: "建筑物",
      value: "building",
    },
    {
      name: "标注",
      value: "point",
    },
  ],
};
let BMap = {
  styleList: [
    {
      name: "默认",
      value: "",
    },
    {
      name: "暗黑",
      value: "BMapDark",
    },
  ],
  featureList: Object.values(showBMapFeatureList)
};

export default new Map([
  ["AMap", AMap],
  ["MineMap", MineMap],
  ["BMap", BMap],
]);






