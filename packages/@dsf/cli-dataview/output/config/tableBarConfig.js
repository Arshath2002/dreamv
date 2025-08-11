/*
 * @Description: 表格柱体配置项
 * @Author: shenah
 * @Date: 2023-04-27 15:35:23
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-10-15 09:47:57
 */
import { createPrefixSuffixConFig } from "_dataview/output/config/prefixSuffixConFig";
export const createOneTableBar = () => {
  let obj = {
    field: "",
    fieldSuffix: "",
    unitField: "", // 单位
    showValue: true,
    height: "10",
    width: "100%",
    borderRadius: "0 0 0 0",
    isAutoCalc: true,
    minBarPercent: undefined,
    barBaseColor: "rgba(220, 227, 243, 0.2)",
    barBgColor: "rgba(55, 162, 218, 1)",
    bgColorRuleList: [],
    suffixRuleConfig: createPrefixSuffixConFig(),
    barTextPosition: "barRight", // 柱体右侧,柱体内侧
    barTextInnerAlign: "left", // 柱体里面的文字的对齐方式
    pointType: "no", // line、point
    pointColor: "rgba(255,255,255,1)",
    pointBaseColor: "rgba(255,255,255,0.3)",
    isPointBreathe: false,
    animation: {
      flag: true,
      duration: 3, //秒,
    },
  };
  delete obj.suffixRuleConfig.icon;
  delete obj.suffixRuleConfig.image;
  return obj;
};
