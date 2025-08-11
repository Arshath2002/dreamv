/*
 * @Description: 百度地图常量
 * @Author: shenah
 * @Date: 2023-08-16 15:38:20
 * @LastEditors: shenah
 * @LastEditTime: 2023-10-08 17:19:04
 */

// 地图显示要素
const showBMapFeatureList = {
  bMapTraffic: {
    name: "路况",
    value: "bMapTraffic",
    useObj: "map",
    method: ["setTrafficOn", "setTrafficOff"],
  },
};

/**
 * 地图选项
 * key对应高德地图哪个类型的options
 * key对应的值:{
 *  key=>对应高德地图key
 *  value=>对应的是百度地图option对应的key
 * }
 *
 */
const infoMapKeyMap = {
  map: {},
};

export { infoMapKeyMap, showBMapFeatureList };
