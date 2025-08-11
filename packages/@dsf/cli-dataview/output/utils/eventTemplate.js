/*
 * @Editor: chenqy
 * @Description: 组件事件模板
 * @Date: 2023-03-28 15:37:09
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-14 14:34:18
 */

import { dataAnalysis } from "./dataAnalysisEventTemplate";
import { chartCommon, dataEvent, commonEvents } from "./commonEvent";

//自定义伪代码事件
let eventTemplate = dsf.dataview.eventTemplate;
//自动注入默认事件
if (eventTemplate) {
  Object.keys(eventTemplate).forEach((key) => {
    let event = eventTemplate[key];
    eventTemplate[key] = {
      ...commonEvents,
      ...event,
    };
  });
}
let $eventTemplate = {
  //公共页面事件
  page: {
    请求: function fn() {
      return this.handleHTTP(...arguments);
    },
    跳转页面: function fn() {
      return this.handleTurnPage(...arguments);
    },
    大屏弹框: function fn() {
      return this.handleOpenDataViewDialog(...arguments);
    },
    悬浮弹框: function fn() {
      return this.handleOpenDVPopup(...arguments);
    },
    关闭悬浮框: function fn() {
      return this.handleClosePageDVPopup(...arguments);
    },
    取消请求: function fn(fakeCodeName) {
      return this.cancelDvRequest(...arguments);
    },
  },
  // 图形类
  chart: {
    ...chartCommon,
    设置目标线: function fn(name, type, label, color) {
      return this.handleSetTargetLine(...arguments);
    },
    删除目标线: function fn(name) {
      return this.handleDeletTargetLine(...arguments);
    },
    设置柱体颜色: function (name, color) {
      return this.handleSetBarColor(...arguments);
    },
    设置动态图表: function (interval) {
      return this.handleSetdynamicChart(...arguments);
    },
  },
  //gis类
  gis: {
    ...dataEvent,
    地图下钻: function fn(code, layerId, data) {
      return this.handleDownMap(...arguments);
    },
    设置图层数据: function (layerId, data) {
      return this.handleSettingLayerData(...arguments);
    },
    添加点图层: function fn(id, data, layerId) {
      return this.handleFakeAddPointTypeLayer("point", id, data, layerId);
    },
    添加面图层: function (id, data, adcode, layerId) {
      return this.handleFakeAddPloygonLayer(...arguments);
    },
    添加热力图层: function fn(id, data, layerId) {
      return this.handleFakeAddPointTypeLayer("heatMap", id, data, layerId);
    },
    添加贴地点图层: function fn(id, data, layerId) {
      return this.handleFakeAddPointTypeLayer("scatter", id, data, layerId);
    },
    添加飞行线图层: function fn(id, data, layerId) {
      return this.handleFakeAddPulseLinkLayer(...arguments);
    },
    添加平面柱图层: function fn(id, data, layerId) {
      return this.handleFakeAddPointTypeLayer("flatBar", id, data, layerId, {
        flatBar: {
          barType: "1",
        },
      });
    },
    添加圆柱图层: function fn(id, data, layerId) {
      return this.handleFakeAddPointTypeLayer("flatBar", id, data, layerId, {
        flatBar: {
          barType: "2",
        },
      });
    },
    添加棱柱图层: function fn(id, data, layerId) {
      return this.handleFakeAddPointTypeLayer("flatBar", id, data, layerId, {
        flatBar: {
          barType: "3",
        },
      });
    },
    添加图标图层: function fn(id, data, layerId) {
      return this.handleFakeAddPointTypeLayer("icon", id, data, layerId);
    },
    设置地图缩放层级: function fn(zoom) {
      return this.handleSetMapZoom(...arguments);
    },
    设置地图状态: function fn(status) {
      return (this.mapStatus = status);
    },
    Gis跳转页面: function (path) {
      return this.gisToPage(path);
    },
    隐藏图层: function fn() {
      return this.handleHiddenMapLayer(...arguments);
    },
    显示图层: function fn() {
      return this.handleShowMapLayer(...arguments);
    },
    删除图层: function fn() {
      return this.handleDeleteMapLayer(...arguments);
    },
    刷新: function fn() {
      return this.init();
    },
  },
  map: {
    ...dataEvent,
    切换地图: function fn(url, mapName) {
      return this.handleChangeMap(...arguments);
    },
    清除地图数据: function fn(name) {
      return this.handleDeleteMapData(...arguments);
    },
    刷新: function fn() {
      return this.init();
    },
  },
  globeMap: {
    刷新: function fn() {
      return this.init();
    },
  },
  threeGlobalEarth: {
    ...dataEvent,
    刷新: function fn() {
      return this.init();
    },
  },
  threeMap: {
    ...dataEvent,
    地图下钻: function fn(url, mapName) {
      return this.handleInChangeMap(...arguments);
    },
    切换地图: function fn(url, mapName) {
      return this.handleChangeMap(...arguments);
    },

    设置相机: function fn(x, y, z) {
      return this.setCamera(...arguments);
    },
    设置缩放: function fn(depth, scale) {
      return this.setConfig(...arguments);
    },
    刷新: function fn() {
      return this.init();
    },
  },
  swiper: {
    ...dataEvent,
    切换滑块: function (index) {
      return this.changeActive(index);
    },
  },
  carousel3d: {
    ...dataEvent,
    切换卡片: function (index) {
      return this.changeActive(index);
    },
  },
  //轮播面板
  carousel: {
    ...commonEvents,
    下一屏: function fn() {
      return this.next();
    },
    上一屏: function fn() {
      return this.prev();
    },
    显示屏: function fn(name) {
      return this.changeActive(name);
    },
  },
  navTab: {
    切换选项卡: function fn(active) {
      return this.handleChange(...arguments);
    },
    获取当前值: function fn() {
      return this.handleGetValue();
    },
    刷新: function fn() {
      return this.init();
    },
    ...commonEvents,
  },
  date: {
    获取当前值: function fn() {
      return this.handleGetValue();
    },
    获取当前类型: function fn() {
      return this.handleGetType();
    },
    设置当前值: function fn() {
      return this.handleSetValue(...arguments);
    },
    只选择今年: function fn(type) {
      return this.handleAllowNowYear(type);
    },
    自定义选择时间: function fn(type, val) {
      return this.handleAllowCustomYear(type, val);
    },
    清空禁用: function fn(type) {
      return this.clearDisabled(type);
    },
    ...commonEvents,
  },
  treeCatalog: {
    ...dataEvent,
    获取复选框的值: function fn() {
      return this.getCheckNodes();
    },
    获取选中项的值: function fn() {
      return this.getSelectNodes();
    },
    选中复选框: function fn(keys) {
      return this.setCheckNodes(...arguments);
    },
    选中项: function fn(keys) {
      return this.setSelectNodes(...arguments);
    },
  },

  changeBusiness: {
    ...commonEvents,
    切换业务组件: function fn(id) {
      return this.changeComponent(id);
    },
  },
  select: {
    更换选项: function fn(items) {
      return this.handleUpdateItems(items);
    },
    设置值: function fn(value) {
      return this.handleSetValue(value);
    },
    获取当前值: function fn() {
      return this.handleGetValue();
    },
    获取当前值对应中文: function fn() {
      return this.handleGetValueName();
    },
    ...commonEvents,
  },
  search: {
    ...commonEvents,
    获取当前值: function fn() {
      return this.state;
    },
  },
  exportBtn: {
    导出页面: function fn(name) {
      return this.exportImage(name);
    },
    ...commonEvents,
  },
  commonEvent: {
    ...commonEvents,
  },
  menu: {
    添加菜单: function fn(menu) {
      return this.handleAddMenu(menu);
    },
    隐藏菜单: function fn(name) {
      return this.handleHiddenMenu(name);
    },
    显示菜单: function fn(name) {
      return this.handleShowMenu(name);
    },
    高亮菜单: function fn(name) {
      return this.handleLightMenu(name);
    },
    更新菜单: function fn(menu) {
      return this.handleUpdateMenu(menu);
    },
    选中某菜单: function fn(name) {
      return this.handleSelectMenu(name);
    },
    获取当前值: function fn() {
      return this.handleGetValue();
    },
    ...commonEvents,
  },
  navMenu: {
    添加菜单: function fn(menu) {
      return this.handleAddMenu(menu);
    },
    隐藏菜单: function fn(id) {
      return this.handleHiddenMenu(id);
    },
    显示菜单: function fn(id) {
      return this.handleShowMenu(id);
    },
    高亮菜单: function fn(id) {
      return this.highlightMenu(id, false);
    },
    更新菜单: function fn(menu) {
      return this.handleUpdateMenu(menu);
    },
    选中某菜单: function fn(id) {
      return this.highlightMenu(id);
    },
    获取当前值: function fn() {
      return this.handleGetValue();
    },
    ...commonEvents,
  },
  viewPart: {
    切换路径: function fn(url) {
      return this.pathChange(url);
    },

    ...commonEvents,
  },
  dataAnalysis: {
    ...dataEvent,
    ...dataAnalysis,
  },
  text: {
    设置标题: function fn(title) {
      return this.setTitleEvent(...arguments);
    },
    设置副标题: function fn(subTitle) {
      return this.setSubTitleEvent(...arguments);
    },
    ...commonEvents,
  },
  video: {
    播放: function fn() {
      return this.palyVideoEvent();
    },
    暂停: function fn() {
      return this.pauseVideoEvent();
    },
    更新视频地址: function fn(src) {
      return this.updateVideoSrcEvent(...arguments);
    },
    ...commonEvents,
  },
  screen: {
    ...commonEvents,
    全屏: function fn() {
      return this.screenAction();
    },
    退出全屏: function fn() {
      return this.exitScreenAction();
    },
  },
  keyTrades: {
    ...dataEvent,
    ...dataAnalysis,
    获取选中状态: function fn() {
      return this.getSelectStatus();
    },
  },
  cascader: {
    显示: function fn() {
      this.handleShow();
      return this;
    },
    隐藏: function fn() {
      this.handleHidden();
      return this;
    },
    获取当前值: function fn() {
      return this.handleGetValue();
    },
    获取实例: function fn() {
      return this;
    },
  },
};
export const EVENT_TEMPLATE = dsf.mix({}, $eventTemplate, eventTemplate ? eventTemplate : {});
// 数据处理函数事件
export const DATA_HANDLE = {
  data: {
    循环: "forEach",
    过滤: "filter",
    映射: "map",
    升序: "sort",
    降序: "sort",
  },
};
