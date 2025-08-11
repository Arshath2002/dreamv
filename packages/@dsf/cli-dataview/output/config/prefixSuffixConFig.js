/*
 * @Description: 前后缀配置项
 * @Author: shenah
 * @Date: 2024-04-19 15:33:28
 * @LastEditors: shenah
 * @LastEditTime: 2024-10-23 14:46:16
 */

import { createDefaultRuleTypeAttr } from "_dataview/output/config/universalRuleConfig";

// 创建文字、图标、图片属性
const text = createDefaultRuleTypeAttr().text;
text.content = "";
const icon = createDefaultRuleTypeAttr().icon;
const img = createDefaultRuleTypeAttr().img;

export const prefixSuffixTypeOptions = [
  {
    text: "文字",
    value: "text",
  },
  {
    text: "图标",
    value: "icon",
  },
  {
    text: "图片",
    value: "image",
  },
];

export const createPrefixSuffixConFig = (options = {}) => {
  let obj = {
    ruleList: [],
    defaultConfig: {
      flag: false,
      type: "text",
      space: 0, // 间距
      positionType: "", // 前缀类型还是后缀
      text: dsf.mix(true, {}, text),
      icon: dsf.mix(true, {}, icon),
      image: dsf.mix(true, {}, img),
    },
  };
  obj = dsf.mix(true, obj, options);
  return obj;
};
