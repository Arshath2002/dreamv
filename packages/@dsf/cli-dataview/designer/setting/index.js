/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-07-26 13:51:01
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-12 09:10:50
 */

function install(Vue) {
  // dataview_design_setting
  
  Vue.component(
    "DesDVDataFontStyleRules",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVDataFontStyleRules.vue"))
  );
  Vue.component(
    "DesDVAdvancedQuery",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVAdvancedQuery.vue"))
  );
  Vue.component(
    "DesDVAdvancedQueryBind",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVAdvancedQueryBind.vue"))
  );
  Vue.component(
    "DesDVBgSettingExtend",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVImage/DesDVBgSettingExtend.vue"))
  );
  Vue.component(
    "DesDVBorderStyleSetting",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVBorderStyleSetting.vue"))
  );

  Vue.component(
    "DesDVCarouselEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVCarouselEdit.vue"))
  );
  Vue.component(
    "DesDVPopupSetting",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVPopupSetting.vue"))
  );

  Vue.component(
    "DesDVDataSetting",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVDataSetting.vue"))
  );
  Vue.component(
    "DesDVDateTimeWeatherSetting",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVDateTimeWeatherSetting.vue"))
  );
  Vue.component(
    "DesDVDealDataFunction",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVDealDataFunction.vue"))
  );
  Vue.component(
    "DesDVDialogSetting",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVDialogSetting.vue"))
  );
  Vue.component(
    "DesDVImgBatchPathEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVImgBatchPathEdit.vue"))
  );
  Vue.component(
    "DesDVMapDataEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVMapDataEdit.vue"))
  );

  Vue.component(
    "DesDVCommonMenuEditor",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVCommonMenuEditor.vue"))
  );
  Vue.component(
    "DesDVNavStyleEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVNavStyleEdit.vue"))
  );
  Vue.component(
    "DesDVNavTabEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVNavTabEdit.vue"))
  );
  Vue.component(
    "DesDVReportDateTabEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVReportDateTabEdit.vue"))
  );

  Vue.component(
    "DesDVTableEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVTableEdit.vue"))
  );
  Vue.component(
    "DesDVVideoUpload",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVVideoUpload.vue"))
  );
  Vue.component(
    "DesDVWaterLevelConfigEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVWaterLevelConfigEdit.vue"))
  );
  Vue.component(
    "DesDVPageCustom",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVPageCustom.vue"))
  );
  Vue.component(
    "DesDVEventEditor",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./dataEventEditor/DesDVEventEditor.vue"))
  );
  Vue.component(
    "DesDVPageGisEventEditor",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./dataEventEditor/DesDVPageGisEventEditor.vue"))
  );
  Vue.component(
    "DesDVDynamicFieldStyleSetting",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./dynamicField/DesDVDynamicFieldStyleSetting.vue"))
  );

  Vue.component(
    "DesDVUniversalRuleConfig",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVUniversalRuleConfig/index.vue"))
  );
  Vue.component(
    "DesDVLineSpace",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVLineSpace.vue"))
  );
  // graph
  Vue.component(
    "DesDVCustomGisEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./gis/DesDVCustomGisEdit.vue"))
  );
  Vue.component(
    "DesDVCustomChartEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVCustomChartEdit.vue"))
  );
  Vue.component(
    "DesDVDataZoomEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVDataZoomEdit.vue"))
  );
  Vue.component(
    "DesDVMapRelationSetting",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./mapRelation/DesDVMapRelationSetting.vue"))
  );

  //新-地图映射字段
  Vue.component(
    "DesDVBaseMapRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./map/DesDVBaseMapRelation.vue"))
  );
  //新-极坐标映射字段
  Vue.component(
    "DesDVPolarRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVPolarRelation.vue"))
  );
  //新-折柱字段映射字段
  Vue.component(
    "DesDVMixinAxisRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVMixinAxisRelation.vue"))
  );
  //新-散点图字段映射字段
  Vue.component(
    "DesDVScatterRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVScatterRelation.vue"))
  );
  //新-双柱图映射字段
  Vue.component(
    "DesDVDoubleBarRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVDoubleBarRelation.vue"))
  );
  //新-特殊3d柱体映射字段
  Vue.component(
    "DesDVBar3dRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVBar3dRelation.vue"))
  );
  //gis-映射字段
  Vue.component(
    "DesDVGisRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_gis", webpackMode: "lazy" */ "./gis/DesDVGisRelation.vue"))
  );
  //新-饼状图映射字段
  Vue.component(
    "DesDVPieRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVPieRelation.vue"))
  );
  //新-热词气泡映射字段
  Vue.component(
    "DesDVHotWordRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVHotWordRelation.vue"))
  );
  //新-矩形树图映射字段
  Vue.component(
    "DesDVTreeMapRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVTreeMapRelation.vue"))
  );
  //新-多圆环映射字段
  Vue.component(
    "DesDVMultiRingRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVMultiRingRelation.vue"))
  );
  //新-桑基图映射字段
  Vue.component(
    "DesDVSanKeyRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVSanKeyRelation.vue"))
  );
  //新-漏斗图映射字段
  Vue.component(
    "DesDVFunnelRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVFunnelRelation.vue"))
  );
  //新-词云映射字段
  Vue.component(
    "DesDVWordCloudRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVWordCloudRelation.vue"))
  );
  //新-雷达映射字段
  Vue.component(
    "DesDVRadarRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVRadarRelation.vue"))
  );
  //新-旭日图映射字段
  Vue.component(
    "DesDVSunburstRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVSunburstRelation.vue"))
  );
  //新-关系图谱映射字段
  Vue.component(
    "DesDVRelationRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVRelationRelation.vue"))
  );
  //新-平行坐标映射字段
  Vue.component(
    "DesDVParallelRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVParallelRelation.vue"))
  );
  //K线图映射字段
  Vue.component(
    "DesDVCandlestickRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVCandlestickRelation.vue"))
  );
  Vue.component(
    "DesDVThreeMapRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_three", webpackMode: "lazy" */ "./three/DesDVThreeMapRelation.vue"))
  );
  Vue.component(
    "DesDVCustomThreeEdit",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_three", webpackMode: "lazy" */ "./three/DesDVCustomThreeEdit.vue"))
  );
  //新-地球仪映射字段
  Vue.component(
    "DesDVGlobeMapRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./map/DesDVGlobeMapRelation.vue"))
  );
  //新-水波图映射字段
  Vue.component(
    "DesDVWaterWaveRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVWaterWaveRelation.vue"))
  );
  //新-树图映射字段
  Vue.component(
    "DesDVTreeRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_graph", webpackMode: "lazy" */ "./graph/DesDVTreeRelation.vue"))
  );
  // three 地球
  Vue.component(
    "DesDVThreeEarthRelation",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_three", webpackMode: "lazy" */ "./three/DesDVThreeEarthRelation.vue"))
  );
  // 多级导航菜单
  Vue.component(
    "DesDVCascadeMenuEditor",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVCascadeMenuEditor.vue"))
  );
  // 波纹绘制
  Vue.component(
    "DesDVPaintImage",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVPaintImage.vue"))
  );
  // 翻牌器悬浮
  Vue.component(
    "DesDVScrollDigitalConfig",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVScrollDigitalConfig.vue"))
  );
  // 图片配置悬浮
  Vue.component(
    "DesDVImageConfig",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVImage/index.vue"))
  );
  // 大屏业务组件选择
  Vue.component(
    "DesDVBusinessComponents",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_setting", webpackMode: "lazy" */ "./DesDVBusinessComponents.vue"))
  );
}

export default install;
