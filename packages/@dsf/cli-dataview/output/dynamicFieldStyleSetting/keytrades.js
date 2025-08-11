/*
 * @Description: 图文组件的相关的默认配置
 * @Author: shenah
 * @Date: 2023-04-23 13:55:39
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-16 10:13:14
 */
import { createOneExpendStyle } from "_dataview/output/config/dynamicFieldConfig";

// 创建图文组件静态数据
export const createDefault = () => {
  return [
    {
      uuid: dsf.uuid(),
      title: "name",
      field: "",
      nameColor: "#fff",
      nameFontSize: "18",
      valueFontSize: "16",
      layoutMethods: 24,
      style: createOneExpendStyle({
        nameFontSize: "18",
        nameMarginLeft: 5,
        valueFontSize: "16",
        valueColor: "rgba(220,240,255,1)",
        valueMarginBottom: 8,
        unitColor: "rgba(220,240,255,1)",
        unitGap: "5",
      }),
      unit: "",
      nameRuleList: [],
      valueRuleList: [],
      unitRuleList: [],
      error: false,
    },
    {
      uuid: dsf.uuid(),
      title: "零售额",
      field: "value",
      nameColor: "#fff",
      nameFontSize: "18",
      valueFontSize: "18",
      layoutMethods: 24,
      style: createOneExpendStyle({
        nameFontSize: "18",
        valueFontSize: "18",
        valueColor: "rgba(220,240,255,1)",
        unitColor: "rgba(220,240,255,1)",
        unitGap: "5",
      }),
      unit: "亿元",
      nameRuleList: [],
      valueRuleList: [],
      unitRuleList: [],
      error: false,
    },
    {
      uuid: dsf.uuid(),
      title: "占比",
      nameFontSize: "18",
      valueFontSize: "18",
      valueColor: "#rgba(220,240,255,1)",
      layoutMethods: 24,
      field: "percent",
      nameColor: "#fff",
      style: createOneExpendStyle({
        nameFontSize: "18",
        valueFontSize: "18",
        valueColor: "rgba(220,240,255,1)",
        unitGap: "5",
      }),
      unit: "",
      nameRuleList: [],
      valueRuleList: [],
      unitRuleList: [],
      error: false,
    },
  ];
};

export const createOneKeyTrades = () => ({
  uuid: dsf.uuid(),
  title: "",
  layoutMethods: 24,
  error: false,
  // 名称相关
  nameColor: "",
  nameFontSize: "14",
  nameRuleList: [],
  // 值相关
  field: "",
  valueFontSize: "14",
  valueColor: "",
  valueRuleList: [],
  // 单位
  unit: "",
  unitRuleList: [],
  // 额外相关包含名称、值、单位等
  style: createOneExpendStyle(),
});
