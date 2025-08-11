/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-11-14 10:49:13
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 15:23:42
 */
import dataviewUtils from "_dataview/output/utils/index.js";

import { selectThemeMapList } from "_dataview/output/config/themeList.js";

import { unitValueMap, fontList } from "_dataview/output/config/commonConfig.js";

import tinycolor from "tinycolor2";

window.tinycolor = tinycolor;

if (!dsf.dataview) {
  dsf.dataview = {};
}
!(function (global) {
  let $$dataviewConfig = global.$$dataviewConfig || {};

  const { $eventTemplate, $dataviewFonts = [], $dataviewStyles = [], $dataviewThemes = [], $extendSelectThemeConfig = {}, $extendGis, $eventKeyNames = {} } = $$dataviewConfig;
  //拓展伪代码事件
  dsf.dataview.eventTemplate = $eventTemplate;
  //拓展gis
  dsf.dataview.extendGis = $extendGis;
  //拓展组件依赖事件
  dsf.dataview.eventKeyNames = $eventKeyNames;

  //预留字段
  dsf.dataview.designer = {};

  //字体文件
  const productFonts = fontList;
  $dataviewFonts.forEach((it) => {
    if (!productFonts.find((_) => _.value == it.value)) {
      productFonts.push(it);
    }
  });
  dsf.dataview.designer.fonts = [...productFonts];

  //大屏单位
  dsf.dataview.units = unitValueMap;

  // 大屏工具对象
  dsf.dataview.utils = dataviewUtils;

  //大屏风格
  dsf.dataview.extendStyle = $dataviewStyles;
  //主题名称分类
  dsf.dataview.selectThemes = dsf.mix(true, [], $dataviewThemes, selectThemeMapList);
  dsf.dataview.extendSelectThemeConfig = $extendSelectThemeConfig;
})(dsf.global || (dsf.global = {}));
