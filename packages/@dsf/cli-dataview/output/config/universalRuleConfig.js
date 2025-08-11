/*
 * @Description: 通用规则配置
 * @Author: shenah
 * @Date: 2024-04-15 11:04:48
 * @LastEditors: shenah
 * @LastEditTime: 2025-01-06 09:37:27
 */

// 规则内置的类型
export const ruleTypeList = [
  {
    label: "文字",
    value: "text",
  },
  {
    label: "色值",
    value: "color",
    config: {
      type: "color",
    },
  },
  {
    label: "多个色值",
    value: "moreColor",
    config: {
      type: "color",
    },
  },
  {
    label: "图片",
    value: "image",
  },
  {
    label: "图标",
    value: "icon",
  },
];
export const createDefaultRuleTypeAttr = () => ({
  text: {
    id: dsf.uuid(8),
    content: "",
    color: "",
    fontSize: "",
    fontFamily: "Microsoft Yahei",
    fontWeight: "",
    fontStyle: "",
    textDecoration: "",
  },
  color: {
    id: dsf.uuid(8),
    color: "",
  },
  moreColor: {
    id: dsf.uuid(8),
    colorList: [],
  },
  image: {
    id: dsf.uuid(8),
    position: "before",
    width: "auto",
    height: "auto",
    image: "",
  },
  icon: {
    id: dsf.uuid(8),
    position: "before",
    color: "",
    icon: "",
    fontSize: "",
  },
});
// 创建公用的配置
export const createDefaultRuleTypeConfig = (type) => {
  let ruleConfig = {
    field: "", // 字段
    condition: "", // 条件
    diffValue: "", // 对比值
    oldRule: "", // 旧的规则
  };
  let result = {
    id: dsf.uuid(8),
    type,
    ruleConfig,
  };
  let mapAttr = createDefaultRuleTypeAttr();
  if (type) {
    result.attr = mapAttr[type];
  }
  return result;
};
