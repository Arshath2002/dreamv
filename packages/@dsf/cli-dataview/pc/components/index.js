/*
 * 组件的注册
 * @Author: zhanghang
 * @Date: 2022-07-21 11:10:05
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-10 15:05:24
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
// 大屏数据源选择弹框
export const DesDVDataSourceSetting = Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_dialog" */ "../../designer/setting/DesDVDataSourceSetting.vue"));

//大屏页面
export const DsfDataViewPage = defineAsyncComponent("大屏页面", "DsfDataViewPage", () => import(/*webpackChunkName:"dataview_page"*/ "../page/dataViewPage.vue"));

// 边框组件
export const DsfDataViewBorder1 = defineAsyncComponent("边框组件1", "DsfDataViewBorder1", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border1.vue"));
});

export const DsfDataViewBorder2 = defineAsyncComponent("边框组件2", "DsfDataViewBorder2", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border2.vue"));
});

export const DsfDataViewBorder3 = defineAsyncComponent("边框组件3", "DsfDataViewBorder3", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border3.vue"));
});
export const DsfDataViewBorder4 = defineAsyncComponent("边框组件4", "DsfDataViewBorder4", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border4.vue"));
});
export const DsfDataViewBorder5 = defineAsyncComponent("边框组件5", "DsfDataViewBorder5", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border5.vue"));
});
export const DsfDataViewBorder6 = defineAsyncComponent("边框组件6", "DsfDataViewBorder6", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border6.vue"));
});
export const DsfDataViewBorder7 = defineAsyncComponent("边框组件7", "DsfDataViewBorder7", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border7.vue"));
});
export const DsfDataViewBorder8 = defineAsyncComponent("边框组件8", "DsfDataViewBorder8", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border8.vue"));
});
export const DsfDataViewBorder9 = defineAsyncComponent("边框组件9", "DsfDataViewBorder9", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border9.vue"));
});
export const DsfDataViewBorder10 = defineAsyncComponent("边框组件10", "DsfDataViewBorder10", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border10.vue"));
});
export const DsfDataViewBorder11 = defineAsyncComponent("边框组件11", "DsfDataViewBorder11", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border11.vue"));
});
export const DsfDataViewBorder12 = defineAsyncComponent("边框组件12", "DsfDataViewBorder12", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border12.vue"));
});
export const DsfDataViewBorder13 = defineAsyncComponent("边框组件13", "DsfDataViewBorder13", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_border"*/ "../../share/components/border/border13.vue"));
});

//装饰器组件
export const DsfDataViewDecorateOne = defineAsyncComponent("装饰1", "DsfDataViewDecorateOne", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateOne.vue"));
});
export const DsfDataViewDecorateTwo = defineAsyncComponent("装饰2", "DsfDataViewDecorateTwo", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateTwo.vue"));
});
export const DsfDataViewDecorateThree = defineAsyncComponent("装饰3", "DsfDataViewDecorateThree", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateThree.vue"));
});
export const DsfDataViewDecorateFour = defineAsyncComponent("装饰4", "DsfDataViewDecorateFour", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateFour.vue"));
});
export const DsfDataViewDecorateFive = defineAsyncComponent("装饰5", "DsfDataViewDecorateFive", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateFive.vue"));
});
export const DsfDataViewDecorateSix = defineAsyncComponent("装饰6", "DsfDataViewDecorateSix", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateSix.vue"));
});
export const DsfDataViewDecorateSeven = defineAsyncComponent("装饰7", "DsfDataViewDecorateSeven", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateSeven.vue"));
});
export const DsfDataViewDecorateEight = defineAsyncComponent("装饰8", "DsfDataViewDecorateEight", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateEight.vue"));
});
export const DsfDataViewDecorateNine = defineAsyncComponent("装饰9", "DsfDataViewDecorateNine", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateNine.vue"));
});
export const DsfDataViewDecorateTen = defineAsyncComponent("装饰10", "DsfDataViewDecorateTen", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateTen.vue"));
});
export const DsfDataViewDecorateEleven = defineAsyncComponent("装饰11", "DsfDataViewDecorateEleven", () =>
  import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/decorateEleven.vue")
);
export const DsfDataViewRadarScanning = defineAsyncComponent("雷达扫描", "DsfDataViewRadarScanning", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/radarscanning.vue"));
});
export const DsfDataViewBottomCircle = defineAsyncComponent("底部旋转", "DsfDataViewBottomCircle", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/bottomCircle.vue"));
});
export const DsfDataViewRotate1 = defineAsyncComponent("旋转1", "DsfDataViewRotate1", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/rotate1.vue"));
});
export const DsfDataViewRotate2 = defineAsyncComponent("旋转2", "DsfDataViewRotate2", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/rotate2.vue"));
});
export const DsfDataViewDynamicArrow = defineAsyncComponent("动效箭头", "DsfDataViewDynamicArrow", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_decorate"*/ "../../share/components/decorate/dynamicArrow.vue"));
});

//数据组件
export const DsfDataViewScrollRankingBoard = defineAsyncComponent("排名轮播表", "DsfDataViewScrollRankingBoard", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/scrollRankingBoard.vue"));
});
export const DsfDataViewPercentPond = defineAsyncComponent("进度池", "DsfDataViewPercentPond", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/percentPond.vue"));
});

export const DsfDataViewDataPlane = defineAsyncComponent("数据看板", "DsfDataViewDataPlane", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/DsfDataViewDataPlane.vue"));
});
export const DsfDataViewLargeTable = defineAsyncComponent("表格", "DsfDataViewLargeTable", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data_table"*/ "../../share/components/data/largeTable.vue"));
});
export const DsfDataViewRatioBar = defineAsyncComponent("占比条", "DsfDataViewRatioBar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/DsfDataViewRatioBar.vue"));
});
export const DsfDataViewTextRoll = defineAsyncComponent("滚动文本", "DsfDataViewTextRoll", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/DsfDataViewTextRoll.vue"));
});
export const DsfDataViewBusinessKeyTrades = defineAsyncComponent("图文组件", "DsfDataViewBusinessKeyTrades", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/DsfDataViewBusinessKeyTrades.vue"));
});
export const DsfDataViewIconRate = defineAsyncComponent("icon评分", "DsfDataViewIconRate", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/iconRate.vue"));
});
export const DsfDataViewRingGroup = defineAsyncComponent("圆环组", "DsfDataViewRingGroup", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/DsfDataViewRingGroup.vue"));
});
export const DsfDataViewDataContainer = defineAsyncComponent("加载数据", "DsfDataViewDataContainer", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/dataContainer.vue"));
});
export const DsfDataViewTreeCatalog = defineAsyncComponent("大屏目录", "DsfDataViewTreeCatalog", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/treeCatalog.vue"));
});
export const DsfDataViewListTreeTable = defineAsyncComponent("树形表格", "DsfDataViewListTreeTable", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/listTreeTable.vue"));
});
export const DsfDataViewUniversalPagination = defineAsyncComponent("通用分页", "DsfDataViewUniversalPagination", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/universalPagination.vue"));
});
export const DsfDataViewRankProgress = defineAsyncComponent("排名", "DsfDataViewRankProgress", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/DsfDataViewRankProgress.vue"));
});
export const DsfDataViewTimeInfo = defineAsyncComponent("时间轴", "DsfDataViewTimeInfo", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/DsfDataViewTimeInfo.vue"));
});

// 图表组件
export const DsfDataViewPolyline = defineAsyncComponent("折线图表", "DsfDataViewPolyline", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewPolyline.vue"));
});
export const DsfDataViewBar = defineAsyncComponent("柱状图表", "DsfDataViewBar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewBar.vue"));
});
export const DsfDataViewPie3d = defineAsyncComponent("饼状图表3D", "DsfDataViewPie3d", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewPie3d.vue"));
});
export const DsfDataViewMixinAxis = defineAsyncComponent("折柱图表", "DsfDataViewMixinAxis", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewMixinAxis.vue"));
});
export const DsfDataViewPie = defineAsyncComponent("饼状图表", "DsfDataViewPie", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewPie.vue"));
});
export const DsfDataViewRadar = defineAsyncComponent("雷达图表", "DsfDataViewRadar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewRadar.vue"));
});
export const DsfDataViewGauge = defineAsyncComponent("仪表盘", "DsfDataViewGauge", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewGauge.vue"));
});
export const DsfDataViewFunnel = defineAsyncComponent("漏斗图", "DsfDataViewFunnel", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewFunnel.vue"));
});
export const DsfDataViewPictorialBar = defineAsyncComponent("象形图", "DsfDataViewPictorialBar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewPictorialBar.vue"));
});
export const DsfDataViewBar3d = defineAsyncComponent("特殊柱状图形图表", "DsfDataViewBar3d", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewBar3d.vue"));
});
export const DsfDataViewScatter = defineAsyncComponent("散点图表", "DsfDataViewScatter", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewScatter.vue"));
});
export const DsfDataViewWordCloud = defineAsyncComponent("词云", "DsfDataViewWordCloud", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewWordCloud.vue"));
});
export const DsfDataViewPolar = defineAsyncComponent("极坐标图表", "DsfDataViewPolar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewPolar.vue"));
});
export const DsfDataViewMultiRing = defineAsyncComponent("多环图表", "DsfDataViewMultiRing", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/multiRing.vue"));
});
export const DsfDataViewTreeMap = defineAsyncComponent("矩形树图图表", "DsfDataViewTreeMap", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/treeMap.vue"));
});
export const DsfDataViewRelation = defineAsyncComponent("关系图谱图表", "DsfDataViewRelation", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewRelation.vue"));
});

export const DsfDataViewVHDoubleBar = defineAsyncComponent("横竖双柱图", "DsfDataViewVHDoubleBar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewVHDoubleBar.vue"));
});
export const DsfDataViewBusinessHotWord = defineAsyncComponent("热词气泡图", "DsfDataViewBusinessHotWord", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/hotWord.vue"));
});
export const DsfDataViewWaterLevelPondGroup = defineAsyncComponent("水位图", "DsfDataViewWaterLevelPondGroup", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/waterLevelPondGroup.vue"));
});
export const DsfDataViewRuneClouds = defineAsyncComponent("字符云3D", "DsfDataViewRuneClouds", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewRuneClouds.vue"));
});
export const DsfDataViewSanKey = defineAsyncComponent("桑基图", "DsfDataViewSanKey", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/sanKey.vue"));
});
export const DsfDataViewThreePyramid = defineAsyncComponent("圆三棱锥", "DsfDataViewThreePyramid", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/threePyramid.vue"));
});
export const DsfDataViewSunburst = defineAsyncComponent("旭日图", "DsfDataViewSunburst", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewSunburst.vue"));
});
export const DsfDataViewParallel = defineAsyncComponent("平行坐标系", "DsfDataViewParallel", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewParallel.vue"));
});
export const DsfDataViewCandlestick = defineAsyncComponent("K线图", "DsfDataViewCandlestick", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewCandlestick.vue"));
});
export const DsfDataViewWaterWave = defineAsyncComponent("水波图", "DsfDataViewWaterWave", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/waterWave.vue"));
});
export const DsfDataViewTree = defineAsyncComponent("树图", "DsfDataViewTree", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_graph"*/ "../../share/components/graph/DsfDataViewTree.vue"));
});

//容器组件
export const DsfDataViewImage = defineAsyncComponent("图形容器", "DsfDataViewImage", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/DsfDataViewImage.vue"));
});
export const DsfDataViewVideo = defineAsyncComponent("Video播放器", "DsfDataViewVideo", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/video.vue"));
});
export const DsfDataListGroup = defineAsyncComponent("自定义分组", "DsfDataListGroup", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/datalistgroup.vue"));
});
export const DsfDataViewListGroup = defineAsyncComponent("自定义分组", "DsfDataViewListGroup", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/datalistgroup.vue"));
});
export const DsfDataViewNavTab = defineAsyncComponent("选项卡", "DsfDataViewNavTab", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/navTab.vue"));
});
export const DsfDataViewHtml = defineAsyncComponent("大屏html", "DsfDataViewHtml", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/DsfDataViewHtml.vue"));
});

export const DsfDataViewCarouselPanel = defineAsyncComponent("轮播容器(旧)", "DsfDataViewCarouselPanel", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/DsfDataViewCarouselPanel.vue"));
});
export const DsfDataViewIframe = defineAsyncComponent("iframe容器", "DsfDataViewIframe", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/DsfDataViewIframe.vue"));
});

export const DsfDataView3dCarouselContainer = defineAsyncComponent("旋转容器3D", "DsfDataView3dCarouselContainer", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/DsfDataView3dCarouselContainer/index.vue"));
});
export const DsfDataViewSwiper = defineAsyncComponent("轮播容器", "DsfDataViewSwiper", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/DsfDataViewSwiper.vue"));
});
export const DsfDataViewDynamicGroup = defineAsyncComponent("动态组件容器", "DsfDataViewDynamicGroup", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/DsfDataViewDynamicGroup.vue"));
});
export const DsfDataviewViewPart = defineAsyncComponent("内嵌视图", "DsfDataviewViewPart", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_container"*/ "../../share/components/container/DsfDataViewViewPart.vue"));
});

//地图控件
export const DsfDataViewBaseMap = defineAsyncComponent("基础地图", "DsfDataViewBaseMap", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_map"*/ "../../share/components/map/baseMap.vue"));
});
export const DsfDataViewScatterMap = defineAsyncComponent("撒点地图", "DsfDataViewScatterMap", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_map"*/ "../../share/components/map/scatterMap.vue"));
});
export const DsfDataViewFlyLineMap = defineAsyncComponent("飞行地图", "DsfDataViewFlyLineMap", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_map"*/ "../../share/components/map/flyLineMap.vue"));
});
export const DsfDataViewGis = defineAsyncComponent("gis地图", "DsfDataViewGis", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_map"*/ "../../share/components/gis/index.vue"));
});
export const DsfDataViewThreeMap = defineAsyncComponent("基础3D地图", "DsfDataViewThreeMap", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_three_gl"*/ "../../share/components/threeMap/index.vue"));
});
export const DsfDataViewGlobeMap = defineAsyncComponent("地球3D", "DsfDataViewGlobeMap", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_gl_map"*/ "../../share/components/map/globeMap.vue"));
});
export const DsfDataViewThreeGlobalEarth = defineAsyncComponent("threeD地球", "DsfDataViewThreeGlobalEarth", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_three_gl"*/ "../../share/components/threeGlobalEarth/DsfDataViewThreeGlobalEarth.vue"));
});

export const DsfDataViewModelViewer = defineAsyncComponent("三维查看器", "DsfDataViewModelViewer", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_three_gl"*/ "../../share/components/model/DsfDataViewModelViewer.vue"));
});
// 输入控件
export const DsfDataViewSelect = defineAsyncComponent("下拉框", "DsfDataViewSelect", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_input"*/ "../../share/components/input/DsfDataViewSelect.vue"));
});
export const DsfDataViewTextSerch = defineAsyncComponent("搜索框", "DsfDataViewTextSerch", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_input"*/ "../../share/components/input/DsfDataViewTextSerch.vue"));
});
export const DsfDataViewRadioGroup = defineAsyncComponent("单选组", "DsfDataViewRadioGroup", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_input"*/ "../../share/components/input/DsfDataViewRadioGroup.vue"));
});
export const DsfDataViewTextBox = defineAsyncComponent("文本框", "DsfDataViewTextBox", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_input"*/ "../../share/components/input/DsfDataViewTextBox.vue"));
});
export const DsfDataViewTimeline = defineAsyncComponent("时间线", "DsfDataViewTimeline", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_input"*/ "../../share/components/input/DsfDataViewTimeline.vue"));
});
export const DsfDataViewDateTimeWeather = defineAsyncComponent("时间天气", "DsfDataViewDateTimeWeather", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_input"*/ "../../share/components/input/dateTimeWeather.vue"));
});
export const DsfDataViewAdvancedQuery = defineAsyncComponent("高级搜索", "DsfDataViewAdvancedQuery", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_input"*/ "../../share/components/input/advancedQuery.vue"));
});
export const DsfDataViewAreaCascader = defineAsyncComponent("行政区划", "DsfDataViewAreaCascader", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_input"*/ "../../share/components/input/areaCascader/index.vue"));
});
export const DsfDataViewCascader = defineAsyncComponent("级联下拉框", "DsfDataViewCascader", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_input"*/ "../../share/components/input/DsfDataViewCascader.vue"));
});


export const DsfDataViewBusinessDefaultPanel = defineAsyncComponent("面板组件", "DsfDataViewBusinessDefaultPanel", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_general"*/ "../../share/components/general/DsfDataViewBusinessDefaultPanel.vue"));
});
export const DsfDataViewText = defineAsyncComponent("标题组件", "DsfDataViewText", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_general"*/ "../../share/components/general/DsfDataViewText.vue"));
});
export const DsfDataViewNavMenu = defineAsyncComponent("导航菜单", "DsfDataViewNavMenu", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_general"*/ "../../share/components/general/DsfDataViewNavMenu.vue"));
});
export const DsfDataViewSlideNavMenu = defineAsyncComponent("滑动导航菜单", "DsfDataViewSlideNavMenu", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_general"*/ "../../share/components/general/DsfDataViewSlideNavMenu.vue"));
});
export const DsfDataViewGaugeMenu = defineAsyncComponent("仪表盘菜单", "DsfDataViewGaugeMenu", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_general"*/ "../../share/components/general/DsfDataViewGaugeMenu.vue"));
});

export const DsfDataViewBusinessHeaderContent = defineAsyncComponent("页面标题", "DsfDataViewBusinessHeaderContent", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_general"*/ "../../share/components/general/DsfDataViewBusinessHeaderContent.vue"));
});
export const DsfDataViewTimeRange = defineAsyncComponent("时间范围", "DsfDataViewTimeRange", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_general"*/ "../../share/components/general/DsfDataViewTimeRange.vue"));
});
export const DsfDataViewFullscreen = defineAsyncComponent("全屏", "DsfDataViewFullscreen", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_general"*/ "../../share/components/general/DsfDataViewFullscreen.vue"));
});
export const DsfDataViewExport = defineAsyncComponent("导出", "DsfDataViewExport", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_general"*/ "../../share/components/general/DsfDataViewExport.vue"));
});

export const DsfDataViewBusinessRotate3D = defineAsyncComponent("三维旋转", "DsfDataViewBusinessRotate3D", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_bussiness"*/ "../../share/components/business/DsfDataViewBusinessRotate3D.vue"));
});

export const DsfDataViewConfidentialityWords = defineAsyncComponent("保密级", "DsfDataViewConfidentialityWords", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_bussiness"*/ "../../share/components/business/confidentialityWords.vue"));
});
export const DsfDataViewCircleMenu = defineAsyncComponent("环形菜单", "DsfDataViewCircleMenu", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_bussiness"*/ "../../share/components/business/DsfDataViewCircleMenu.vue"));
});
export const DsfDataViewFlowLine = defineAsyncComponent("流程线", "DsfDataViewFlowLine", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_business"*/ "../../share/components/business/DsfDataViewFlowLine.vue"));
});

// 动效组件
export const DsfDataViewEffectPattern = defineAsyncComponent("动效图案", "DsfDataViewEffectPattern", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_effect"*/ "../../share/components/effect/DsfDataViewEffectPattern.vue"));
});
// 动效组件
export const DsfDataViewEffectPoint = defineAsyncComponent("动效光点", "DsfDataViewEffectPoint", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_effect"*/ "../../share/components/effect/DsfDataViewEffectPoint/index.vue"));
});

export const DsfDataViewDialog = defineAsyncComponent("大屏弹框", "DsfDataViewDialog", () => import(/*webpackChunkName:"dataview_dialog"*/ "../../share/components/common/dialog.vue"));
export const DsfDataviewPopupWindow = defineAsyncComponent("大屏悬浮框", "DsfDataviewPopupWindow", () =>
  import(/*webpackChunkName:"dataview_dialog"*/ "../../share/components/common/DsfDataviewPopupWindow.vue")
);
// 年月旬组件
// export PeriodPicker from '../../share/components/date/periodPicker';
export const DsfDataViewScrollDigital = defineAsyncComponent("数字翻牌器", "DsfDataViewScrollDigital", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/scrollDigital.vue"));
});
//进度条
export const DsfDataViewProgressBar = defineAsyncComponent("进度条", "DsfDataViewProgressBar", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_data"*/ "../../share/components/data/progressBar.vue"));
});

// 圆环组组件
export const DsfDataViewMoreRingColor = defineAsyncComponent("多彩圆环占比组", "DsfDataViewMoreRingColor", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_ring"*/ "../../share/components/ring/moreRingColor/DsfDataViewMoreRingColor.vue"));
});

export const DsfDataViewCylinderSlide = defineAsyncComponent("圆柱幻灯片", "DsfDataViewCylinderSlide", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_three_gl"*/ "../../share/components/container/DsfDataViewCylinderSlide/index.vue"));
});

export const DsfDataViewChangeBusiness = defineAsyncComponent("业务组件", "DsfDataViewChangeBusiness", () => {
  return $mixins.dataView().then(() => import(/*webpackChunkName:"dataview_three_gl"*/ "../../share/components/container/DsfDataViewChangeBusiness/index.vue"));
});
