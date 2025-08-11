/*
 * @Description: 初始化默认配置,字段配置以及操作权限
 * @Author: shenah
 * @Date: 2023-03-30 09:09:57
 * @LastEditors: shenah
 * @LastEditTime: 2024-04-12 17:26:00
 */

// 默认主体部分配置
export const mainFieldConfigList = [
  {
    name: "名称字段",
    key: "firstNameKey",
    type: "fieldInput",
  },
  {
    name: "对应值字段",
    key: "secondValueKey",
    type: "fieldInput",
  },
];

// 默认动态增加的字段配置
export const dynamicFieldConfigList = [
  {
    name: "显示名称",
    key: "title",
    type: "input",
  },
  {
    name: "字段",
    key: "field",
    type: "fieldInput",
    isMust: true,
  },
  {
    name: "名称字号",
    key: "nameFontSize",
    type: "input",
  },
  {
    name: "名称颜色",
    key: "nameColor",
    type: "color",
  },
  {
    name: "值字号",
    key: "valueFontSize",
    type: "input",
  },
  // {
  //   name: "值颜色",
  //   key: "valueColorObj",
  //   type: "ruleColor",
  // },
  // {
  //   name: "值图标",
  //   key: "valueIconObj",
  //   type: "ruleIcon",
  // },
  {
    name: "值颜色图标",
    key: "valueIconObj,valueColorObj",
    type: "rule",
  },
];

// 操作权限

export const operateRights = {
  extra: true, // 额外新增的按钮
  insert: true, //插入
  del: true, // 删除
  up: true, //上移动
  down: true, // 下移动
};



// 公共的显示动态的配置
export const componentDynamicFieldConfigList = {
  keytrades: [
    {
      name: "名称/字段",
      key: "title",
      type: "fieldInput",
    },
    {
      name: "值字段",
      key: "field",
      type: "fieldInput",
      isMust: true,
    },
    {
      name: "单位",
      key: "unit",
      type: "fieldInput",
    }
  ],
};