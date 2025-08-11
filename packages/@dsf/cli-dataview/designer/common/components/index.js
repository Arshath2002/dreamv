
/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-07-26 13:51:01
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 17:30:40
 */

const registerDesignerProperty = function (showType, name, defineAsyncComponent) {
  Vue.component(name, defineAsyncComponent);
  showType && dsf.designer.registerPropsEditor({ [showType]: defineAsyncComponent });
};

function install(Vue) {
  registerDesignerProperty(
    "dv_slider",
    "DesDVSlider",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVSlider.vue"))
  );
  registerDesignerProperty(
    "dv_list_tree_index",
    "DesDVListTreeIndex",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVListTreeIndex.vue"))
  );

  registerDesignerProperty(
    "dv_custom_list_group",
    "DesDVMoreCustomListGroup",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVMoreCustomListGroup.vue"))
  );

  registerDesignerProperty(
    "dv_animate_list",
    "DesDVAnimateList",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVAnimateList.vue"))
  );
  registerDesignerProperty(
    "dv_shadow",
    "DesDVShadow",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVShadow.vue"))
  );

  registerDesignerProperty(
    "dv_three_model",
    "DesDVThreeModelConfig",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVThreeModelConfig.vue"))
  );

  registerDesignerProperty(
    "dv_area_cascader",
    "DesDVAreaCascader",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVAreaCascader.vue"))
  );

  registerDesignerProperty(
    "dv_text",
    "DesDVText",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVText.vue"))
  );
  registerDesignerProperty(
    "dv_number",
    "DesDVNumber",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVNumber.vue"))
  );
  registerDesignerProperty(
    "dv_text_style",
    "DesDVTextStyle",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVTextStyle.vue"))
  );

  registerDesignerProperty(
    "dv_dialog",
    "DesDVDialog",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVDialog.vue"))
  );

  registerDesignerProperty(
    "dv_url",
    "DesDVInputUrl",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVInputUrl.vue"))
  );

  registerDesignerProperty(
    "dv_text_align",
    "DesDVTextAlign",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVTextAlign.vue"))
  );

  registerDesignerProperty(
    "dv_color",
    "DesDVColorPicker",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./colorPicker/index.vue"))
  );

  registerDesignerProperty(
    "dv_radio_group",
    "DesDVRadioGroup",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVRadioGroup.vue"))
  );

  registerDesignerProperty(
    "dv_border_radius",
    "DesDVBorderRadius",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVBorderRadius.vue"))
  );

  registerDesignerProperty(
    "dv_switch",
    "DesDVSwitch",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVSwitch.vue"))
  );
  registerDesignerProperty(
    "dv_select",
    "DesDVSelect",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVSelect.vue"))
  );

  registerDesignerProperty(
    "dv_margins",
    "DesDVMargins",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVMargins.vue"))
  );

  registerDesignerProperty(
    "dv_margins_group",
    "DesDVMarginsGroup",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVMarginsGroup.vue"))
  );

  registerDesignerProperty(
    "dv_pixel",
    "DesDVPixel",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVPixel.vue"))
  );

  registerDesignerProperty(
    "dv_border",
    "DesDVBorder",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVBorder.vue"))
  );

  registerDesignerProperty(
    "dv_more_color",
    "DesDVMoreModeColor",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVMoreModeColor.vue"))
  );

  registerDesignerProperty(
    "dv_more_icon",
    "DesDVMoreIcon",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVMoreIcon.vue"))
  );

  registerDesignerProperty(
    "dv_more_img",
    "DesDVMoreImg",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVMoreImg.vue"))
  );

  registerDesignerProperty(
    "dv_more_img_layout",
    "DesDVMoreImgLayout",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVMoreImgLayout.vue"))
  );

  registerDesignerProperty(
    "dv_line",
    "DesDVHorizonLine",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVHorizonLine.vue"))
  );

  registerDesignerProperty(
    "dv_video_upload",
    "DesDVVideoUploadDialog",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVVideoUploadDialog.vue"))
  );

  registerDesignerProperty(
    "dv_prefix_suffix",
    "DesDVPrefixSuffix",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVPrefixSuffix.vue"))
  );

  registerDesignerProperty(
    null,
    "DesDVToolTipsIcon",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVToolTipsIcon.vue"))
  );

  registerDesignerProperty(
    "dv_gauge_menu",
    "DesDVGaugeMenu",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVGaugeMenu.vue"))
  );

  registerDesignerProperty(
    "dv_rich_text",
    "DesDVRichText",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVRichText.vue"))
  );

  registerDesignerProperty(
    "dv_designer_ratio",
    "DesDVPropertyRatio",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVPropertyRatio.vue"))
  );

  registerDesignerProperty(
    "dv_icon_radio",
    "DesDVPropertyIconRadio",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVPropertyIconRadio.vue"))
  );

  registerDesignerProperty(
    "dv_svg_ring",
    "DesDVSvgRing",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVSvgRing.vue"))
  );

  registerDesignerProperty(
    "dv_single_table_style",
    "DesDVSingleTableStyle",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/special/DesDVSingleTableStyle.vue"))
  );

  registerDesignerProperty(
    "dv_datetime_weather_style",
    "DesDVDateTimeWeatherStyle",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/special/DesDVDateTimeWeatherStyle.vue"))
  );

  registerDesignerProperty(
    "dv_index_key_trades_style",
    "DesDVIndexKeyTradesStyle",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/special/DesDVIndexKeyTradesStyle.vue"))
  );

  registerDesignerProperty(
    "dv_chart_legend",
    "DesDVChartLegend",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/DesDVChartLegend.vue"))
  );

  registerDesignerProperty(
    "dv_map",
    "DesDVMapIndex",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/map/index.vue"))
  );

  registerDesignerProperty(
    "dv_map_series",
    "DesDVMapSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/map/DesDVMapSeries.vue"))
  );

  registerDesignerProperty(
    "dv_three_map",
    "DesDVThreeMap",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/three/DesDVThreeMap.vue"))
  );

  registerDesignerProperty(
    "dv_three_earth",
    "DesDVThreeEarth",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/three/DesDVThreeEarth.vue"))
  );

  registerDesignerProperty(
    "dv_three_earth_series",
    "DesDVThreeEarthSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/three/DesDVThreeEarthSeries.vue"))
  );

  registerDesignerProperty(
    "dv_three_map_series",
    "DesDVThreeMapSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/three/DesDVThreeMapSeries.vue"))
  );
  registerDesignerProperty(
    "dv_three_map_tooltip",
    "DesDVThreeMapTooltip",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/three/DesDVThreeMapTooltip.vue"))
  );
  registerDesignerProperty(
    "dv_map_gl_style",
    "DesDVGlobeMapStyle",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/globeMap/DesDVGlobeMapStyle.vue"))
  );
  registerDesignerProperty(
    "dv_map_gl_globe",
    "DesDVGlobeMapGlobe",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/globeMap/DesDVGlobeMapGlobe.vue"))
  );

  registerDesignerProperty(
    "dv_map_gl_series",
    "DesDVGlobeMapSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/globeMap/DesDVGlobeMapSeries.vue"))
  );
  registerDesignerProperty(
    "dv_tooltip",
    "DesDVChartTooltip",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/DesDVChartTooltip.vue"))
  );

  registerDesignerProperty(
    "dv_high_tooltip",
    "DesDVChartHighTooltip",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/DesDVChartHighTooltip.vue"))
  );
  registerDesignerProperty(
    "dv_chart_grid",
    "DesDVChartGrid",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/DesDVChartGrid.vue"))
  );

  registerDesignerProperty(
    "dv_chart_polar_series",
    "DesDVChartPolarSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/polar/DesDVChartPolarSeries.vue"))
  );

  registerDesignerProperty(
    "dv_chart_polar_axis",
    "DesDVChartPolarAxis",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/polar/DesDVChartPolarAxis.vue"))
  );

  registerDesignerProperty(
    "dv_chart_mixin_axis",
    "DesDVChartMixinAxis",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/mixinAxis/DesDVChartMixinAxis.vue"))
  );

  registerDesignerProperty(
    "dv_chart_axis_series",
    "DesDVChartAxisSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/mixinAxis/DesDVChartAxisSeries.vue"))
  );
  registerDesignerProperty(
    "dv_chart_funnel_series",
    "DesDVChartFunnelSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/funnel/DesDVChartFunnelSeries.vue"))
  );

  registerDesignerProperty(
    "dv_chart_sunburst",
    "DesDVChartSunburstSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/sunburst/DesDVChartSunburstSeries.vue"))
  );

  registerDesignerProperty(
    "dv_double_bar_category",
    "DesDVDoubleBarCategory",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/doubleBar/DesDVDoubleBarCategory.vue"))
  );
  registerDesignerProperty(
    "dv_double_bar_series",
    "DesDVDoubleBarSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/doubleBar/DesDVDoubleBarSeries.vue"))
  );

  registerDesignerProperty(
    "dv_chart_gauge",
    "DesDVChartGauge",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/gauge/DesDVChartGauge.vue"))
  );

  registerDesignerProperty(
    "dv_chart_bar3d_series",
    "DesDVChartBar3dSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/bar3d/DesDVChartBar3dSeries.vue"))
  );
  registerDesignerProperty(
    "dv_chart_pie3d_series",
    "DesDVChartPie3dSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/pie3d/DesDVChartPie3dSeries.vue"))
  );
  registerDesignerProperty(
    "dv_chart_high_legend",
    "DesDVChartHighLegend",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/DesDVChartHighLegend.vue"))
  );

  registerDesignerProperty(
    "dv_chart_pie_series",
    "DesDVChartPieSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/pie/DesDVChartPieSeries.vue"))
  );
  registerDesignerProperty(
    "dv_chart_hot_word_series",
    "DesDVChartHotWordSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/hotWord/DesDVChartHotWordSeries.vue"))
  );
  registerDesignerProperty(
    "dv_chart_tree_map_series",
    "DesDVChartTreeMapSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/treeMap/DesDVChartTreeMapSeries.vue"))
  );

  registerDesignerProperty(
    "dv_chart_multi_ring",
    "DesDVChartMultiRingSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/multiRing/DesDVChartMultiRingSeries.vue"))
  );

  registerDesignerProperty(
    "dv_chart_san_key",
    "DesDVChartSanKeySeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/sanKey/DesDVChartSanKeySeries.vue"))
  );
  registerDesignerProperty(
    "dv_chart_word_cloud_series",
    "DesDVChartWordCloudSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/wordCloud/DesDVChartWordCloudSeries.vue"))
  );

  registerDesignerProperty(
    "dv_chart_radar_series",
    "DesDVChartRadarSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/radar/DesDVChartRadarSeries.vue"))
  );

  registerDesignerProperty(
    "dv_chart_relation_series",
    "DesDVChartRelationSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/relation/DesDVChartRelationSeries.vue"))
  );
  registerDesignerProperty(
    "dv_chart_parallel_axis",
    "DesDVParallelAxis",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/parallel/DesDVParallelAxis.vue"))
  );
  registerDesignerProperty(
    "dv_chart_parallel_series",
    "DesDVParallelSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/parallel/DesDVParallelSeries.vue"))
  );
  registerDesignerProperty(
    "dv_chart_candlestick_series",
    "DesDVCandlestickSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/candlestick/DesDVCandlestickSeries.vue"))
  );

  registerDesignerProperty(
    "dv_chart_water_wave_series",
    "DesDVChartWaterWaveSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/waterWave/DesDVChartWaterWaveSeries.vue"))
  );

  registerDesignerProperty(
    "dv_chart_tree_series",
    "DesDVChartTreeSeries",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/echarts/tree/DesDVChartTreeSeries.vue"))
  );
  registerDesignerProperty(
    "dv_gis_info",
    "DesDVGisInfo",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/gis/index.vue"))
  );
  registerDesignerProperty(
    "dv_gis_layer",
    "DesDVGisLayer",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/gis/DesDVGisLayer.vue"))
  );
  registerDesignerProperty(
    "dv_gis_legend",
    "DesDVGisLegend",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/gis/DesDVGisLegend.vue"))
  );
  registerDesignerProperty(
    "dv_field_input",
    "SelectInput",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../setting/graph/selectInput.vue"))
  );
  registerDesignerProperty(
    "dv_graph_change",
    "DesDVGraphChange",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVGraphChange.vue"))
  );
  registerDesignerProperty(
    "dv_popover",
    "DesDVDesignerPopover",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "./DesDVDesignerPopover.vue"))
  );
  registerDesignerProperty(
    "dv_keytrades_icon",
    "DesDVKeyTradesIcon",
    Vue.defineAsyncComponent(() => import(/* webpackChunkName: "dataview_design_property", webpackMode: "lazy" */ "../../propertyEditor/special/DesDVKeyTradesIcon.vue"))
  );
}
export default install;
