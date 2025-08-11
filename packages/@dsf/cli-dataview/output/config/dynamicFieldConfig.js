/*
 * @Description: 动态字段配置信息
 * @Author: shenah
 * @Date: 2023-04-28 17:13:48
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-04 13:59:45
 */

import { createWholeConfig } from "_dataview/output/config/scrollDigital";

// 柱体配置
export const createBarConfig = () => ({
  minPercent: undefined, // 最小百分比
  width: "100px", // 柱体宽度
  height: "10px", // 柱体高度
  borderRadius: "0", // 边框圆角
  bgColor: "#37a2da", // 颜色
  basicBgColor: "rgba(220,227,243,0.2)", // 底色
  showValue: false,
  bgColorRuleList: [], // 柱体背景颜色规则
  pointInfo: {
    type: "no", // line、point
    color: "rgba(255,255,255,1)",
    baseColor: "rgba(255,255,255,0.3)",
    isBreathe:false,
  },
  animation: {
    flag: false,
    duration: 3, //秒,
  },
});

export const createOneExpendStyle = (options = {}) => {
  let digitalWholeConfig = createWholeConfig();
  digitalWholeConfig.config.autoplay = false;
  digitalWholeConfig.fontPadding = [0, 0, 0, 0];
  let obj = {
    //名称
    nameColor: "#fff",
    nameFontSize: "14",
    nameFontFamily: "Microsoft Yahei",
    nameFontWeight: "normal",
    nameFontStyle: "",
    nameTextDecoration: "",
    nameTextShadow: "",
    nameMarginTop: 0,
    nameMarginRight: 0,
    nameMarginBottom: 0,
    nameMarginLeft: 0,
    nameTextAlign: "left",
    lineNum: 0,
    lineBreak: 0,
    // 值
    valueFontSize: "14",
    valueColor: "#fff",
    valueFontWeight: "normal",
    valueFontStyle: "",
    valueTextDecoration: "",
    valueTextShadow: "",
    valueFontFamily: "Microsoft Yahei",
    valueMarginTop: 0,
    valueMarginRight: 0,
    valueMarginBottom: 0,
    valueMarginLeft: 10,
    isBar: false,
    barConfig: createBarConfig(),
    digitalWholeConfig,
    // 单位
    unitColor: "#fff",
    unitFontSize: "14",
    unitFontFamily: "Microsoft Yahei",
    unitFontWeight: "normal",
    unitFontStyle: "",
    unitTextDecoration: "",
    unitTextShadow: "",
    unitGap: "0",
    // 整体的
    relativeTop: 0,
    relativeRight: 0,
    relativeBottom: 0,
    relativeLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    align: "flex-start",
    verticalAlign: "center",
    height: "auto",
    lineHeight: "normal",
    //值单位换算配置(先不要了)
    valueUnitTransform: "",
    // 值是否走规则
    valueToRuleFlag: true,
    // 单位是否走规则
    unitToRuleFlag: false,
    ...options,
  };
  return obj;
};
