/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-03-22 16:24:13
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-26 13:49:27
 */
let eventTemp = "";

let dealTemp = `function $dealData(data,self) {
// data 接口返回数据
// self 当前组件
}`;

let initPageTemp = "";

//gis 依赖事件模板
let gisRelativeEventsTemp = {
  load: {
    relatives: [],
    fn: "",
  },
  click: {
    relatives: [],
    fn: "",
    hidden: true,
  },
  //区域点击事件
  districtClick: {
    relatives: [],
    fn: "",
  },
  //普通点点击事件
  loadGisPointClick: {
    relatives: [],
    fn: "",
  },
  //贴地点点击事件
  loadGisScatterClick: {
    relatives: [],
    fn: "",
  },
  //热力图点击事件
  loadGisHeatMapClick: {
    relatives: [],
    fn: "",
  },
  //柱体点击事件
  loadGisFlatBarClick: {
    relatives: [],
    fn: "",
  },
  //飞行线点击事件
  // loadGisPulseLinkClick: {
  //   relatives: [],
  //   fn: "",
  // },
  //图标点击事件
  loadGisIconClick: {
    relatives: [],
    fn: "",
  },
};
//事件中文名映射表
let eventKeyNames = {
  //生命周期事件
  mounted: "初始化事件",
  dataLoad: "数据加载完成事件",
  load: "数据处理完成事件",
  //公共组件事件
  click: "点击事件",
  change: "切换事件",
  search: "搜索事件",
  clickCell: "单元格点击事件",
  dblclick: "双击事件",
  back: "返回事件",
  more: "点击更多事件",
  check: "复选框事件",
  mouseenter:"鼠标移入事件",
  mouseleave:"鼠标移出事件",
  //gis 事件
  districtClick: "区域点击事件",
  loadGisPointClick: "普通点点击事件",
  loadGisScatterClick: "贴地点点击事件",
  loadGisHeatMapClick: "热力图点击事件",
  loadGisFlatBarClick: "柱体点击事件",
  loadGisIconClick: "图标点击事件",
 
  //屏幕事件
  fullscreen: "全屏事件",
  noFullscreen: "退出全屏事件",
};
export {
  eventTemp,
  dealTemp,
  initPageTemp,
  gisRelativeEventsTemp,
  eventKeyNames,
};
