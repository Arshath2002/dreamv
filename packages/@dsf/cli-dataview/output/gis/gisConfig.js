/*
 * @Description: gis相应的配置
 * @Author: shenah
 * @Date: 2023-11-17 17:25:54
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-11-24 14:18:54
 */

const clickMapLayerType = [
  "polygon",
  "point",
  "scatter",
  "heatMap",
  "flatBar",
  "icon",
];
/**
 * 地图事件标志(这里不用for循环生成事件)
 * listenNameStr => 订阅的事件名
 * listenFnStr => 订阅的事件名 => 触发的方法名称(为了方便后面移除)
 * clickEvent => 组件依赖相对应的事件名称
 */
const createMapClickMapping = () => {
  let obj = {};
  clickMapLayerType.forEach((key) => {
    let keyUp = _.upperFirst(key);
    let listenNameStr = `GIS${keyUp}Click`;
    let listenFnStr = `${key}ClickEvent`;
    let clickEvent = `loadGis${keyUp}Click`;
    if (key === "polygon") {
      clickEvent = "districtClick";
    }
    obj[key] = {
      listenNameStr,
      listenFnStr,
      clickEvent,
    };
  });
  return obj;
};
// console.log('createMapClickMapping',createMapClickMapping())


export const mapClickMapping = createMapClickMapping();
