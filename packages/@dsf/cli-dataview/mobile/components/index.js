/*
 * 组件的注册
 * @Author: zhanghang
 * @Date: 2022-07-21 11:10:05
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-17 18:18:35
 */

/**
 * 组件命名不规范问题的组件
 * 用的比较多暂不修改:图文组件(keytrades)、字符云3D(runecloudsnew)、头部横栏(businessheadercontent)
 */
const defineAsyncComponent = function (ctrlCaption, name, options) {
  let factory = dsf.defineAsyncComponent(name, options);
  factory.ctrlCaption = ctrlCaption;
  return factory;
};

// 图表组件
export const DsfMobileDataViewPolyline = defineAsyncComponent("折线图表", "DsfMobileDataViewPolyline", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewPolyline.vue"));
});
export const DsfMobileDataViewBar = defineAsyncComponent("柱状图表", "DsfMobileDataViewBar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewBar.vue"));
});
export const DsfMobileDataViewPie3d = defineAsyncComponent("饼状图表3D", "DsfMobileDataViewPie3d", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewPie3d.vue"));
});
export const DsfMobileDataViewMixinAxis = defineAsyncComponent("折柱图表", "DsfMobileDataViewMixinAxis", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewMixinAxis.vue"));
});
export const DsfMobileDataViewPie = defineAsyncComponent("饼状图表", "DsfMobileDataViewPie", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewPie.vue"));
});
export const DsfMobileDataViewRadar = defineAsyncComponent("雷达图表", "DsfMobileDataViewRadar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewRadar.vue"));
});
export const DsfMobileDataViewGauge = defineAsyncComponent("仪表盘", "DsfMobileDataViewGauge", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewGauge.vue"));
});
export const DsfMobileDataViewFunnel = defineAsyncComponent("漏斗图", "DsfMobileDataViewFunnel", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewFunnel.vue"));
});
export const DsfMobileDataViewPictorialBar = defineAsyncComponent("象形图", "DsfMobileDataViewPictorialBar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewPictorialBar.vue"));
});
export const DsfMobileDataViewBar3d = defineAsyncComponent("特殊柱状图形图表", "DsfMobileDataViewBar3d", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewBar3d.vue"));
});
export const DsfMobileDataViewScatter = defineAsyncComponent("散点图表", "DsfMobileDataViewScatter", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewScatter.vue"));
});
export const DsfMobileDataViewWordCloud = defineAsyncComponent("词云", "DsfMobileDataViewWordCloud", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewWordCloud.vue"));
});
export const DsfMobileDataViewPolar = defineAsyncComponent("极坐标图表", "DsfMobileDataViewPolar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewPolar.vue"));
});
export const DsfMobileDataViewMultiRing = defineAsyncComponent("多环图表", "DsfMobileDataViewMultiRing", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewMultiRing.vue"));
});
export const DsfMobileDataViewTreeMap = defineAsyncComponent("矩形树图图表", "DsfMobileDataViewTreeMap", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewTreeMap.vue"));
});
export const DsfMobileDataViewRelation = defineAsyncComponent("关系图谱图表", "DsfMobileDataViewRelation", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewRelation.vue"));
});

export const DsfMobileDataViewVHDoubleBar = defineAsyncComponent("横竖双柱图", "DsfMobileDataViewVHDoubleBar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewVHDoubleBar.vue"));
});
export const DsfMobileDataViewBusinessHotWord = defineAsyncComponent("热词气泡图", "DsfMobileDataViewBusinessHotWord", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewBusinessHotWord.vue"));
});
export const DsfMobileDataViewWaterLevelPondGroup = defineAsyncComponent("水位图", "DsfMobileDataViewWaterLevelPondGroup", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewWaterLevelPondGroup.vue"));
});
export const DsfMobileDataViewRuneClouds = defineAsyncComponent("字符云3D", "DsfMobileDataViewRuneClouds", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewRuneClouds.vue"));
});
export const DsfMobileDataViewSanKey = defineAsyncComponent("桑基图", "DsfMobileDataViewSanKey", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewSanKey.vue"));
});
export const DsfMobileDataViewThreePyramid = defineAsyncComponent("圆三棱锥", "DsfMobileDataViewThreePyramid", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewThreePyramid.vue"));
});
export const DsfMobileDataViewSunburst = defineAsyncComponent("旭日图", "DsfMobileDataViewSunburst", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewSunburst.vue"));
});
export const DsfMobileDataViewParallel = defineAsyncComponent("平行坐标系", "DsfMobileDataViewParallel", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewParallel.vue"));
});
export const DsfMobileDataViewCandlestick = defineAsyncComponent("K线图", "DsfMobileDataViewCandlestick", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewCandlestick.vue"));
});
export const DsfMobileDataViewWaterWave = defineAsyncComponent("水波图", "DsfMobileDataViewWaterWave", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewWaterWave.vue"));
});
export const DsfMobileDataViewTree = defineAsyncComponent("树图", "DsfMobileDataViewTree", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_graph"*/ "./DsfMobileDataViewTree.vue"));
});

export const DsfMobileDataViewBaseMap = defineAsyncComponent("基础地图", "DsfMobileDataViewBaseMap", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_map"*/ "./DsfMobileDataViewBaseMap.vue"));
});
export const DsfMobileDataViewScatterMap = defineAsyncComponent("撒点地图", "DsfMobileDataViewScatterMap", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_map"*/ "./DsfMobileDataViewScatterMap.vue"));
});
export const DsfMobileDataViewFlyLineMap = defineAsyncComponent("飞行地图", "DsfMobileDataViewFlyLineMap", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_mobile_map"*/ "./DsfMobileDataViewFlyLineMap.vue"));
});
