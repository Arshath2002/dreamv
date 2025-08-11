/*
 * @Description: 
 * @Author: zhanghang
 * @Date: 2024-01-24 09:42:54
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-02 11:18:40
 */
//数据类型
const dataTypes = [
  {
    value: "text",
    label: "文本",
  },
  {
    value: "number",
    label: "数字",
  },
  {
    value: "enum",
    label: "枚举",
  },
  {
    value: "date",
    label: "日期",
  },
  {
    value: "period",
    label: "季月年",
  }
];
//控件类型对应的操作符号
const operationTypes = new Map([
  [
    "text",
    [
      {
        label: "匹配",
        value: "L",
      },
      {
        label: "匹配开始",
        value: "LL",
      },
      {
        label: "匹配结尾",
        value: "RL",
      },
      {
        label: "等于",
        value: "E",
      },
      {
        label: "不等于",
        value: "NE",
      },
    ]],
  ["number", [
    {
      label: "等于",
      value: "E",
    },
    {
      label: "不等于",
      value: "NE",
    },
    {
      label: "大于",
      value: "GT",
    },
    {
      label: "小于",
      value: "LT",
    },
    {
      label: "大于等于",
      value: "GTE",
    },
    {
      label: "小于等于",
      value: "LTE",
    },
    {
      label: "区间",
      value: "B",
    },
  ]],
  ["date", [{
    label: "等于",
    value: "E",
  },
  {
    label: "不等于",
    value: "NE",
  },
  {
    label: "大于",
    value: "GT",
  },
  {
    label: "小于",
    value: "LT",
  },
  {
    label: "大于等于",
    value: "GTE",
  },
  {
    label: "小于等于",
    value: "LTE",
  },
  {
    label: "区间",
    value: "B",
  }]],
  ["period", [{
    label: "等于",
    value: "E",
  },
  {
    label: "不等于",
    value: "NE",
  },
  {
    label: "大于",
    value: "GT",
  },
  {
    label: "小于",
    value: "LT",
  },
  {
    label: "大于等于",
    value: "GTE",
  },
  {
    label: "小于等于",
    value: "LTE",
  },
  {
    label: "区间",
    value: "B",
  }]],

  ["enum", [
    {
      label: "包含(支持多选)",
      value: "I",
    },
    {
      label: "等于(仅单选)",
      value: "E",
    },
    {
      label: "匹配(支持多选)",
      value: "L",
    },
    {
      label: "匹配开始(支持多选)",
      value: "LL",
    },
    {
      label: "匹配结尾(支持多选)",
      value: "RL",
    }
  ]]
],
);
export {
  operationTypes,
  dataTypes
}