/*
 * @Description: 热词
 * @Author: shenah
 * @Date: 2023-09-27 15:18:45
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-03-26 10:25:36
 */

import common from "./common";

let resultData = {
  data: [
    {
      name: "金融",
      value: 1421,
      zb: "10",
    },
    {
      name: "信息传输",
      value: 1200,
      zb: "10",
    },
    {
      name: "软件",
      value: 33,
      zb: "10",
    },
    {
      name: "工业",
      value: 1035,
      zb: "10",
    },
    {
      name: "科学研究和技术",
      value: 935,
      zb: "10",
    },
    {
      name: "批发和零售",
      value: 835,
      zb: "10",
    },
    {
      name: "房地产",
      value: 735,
      zb: "10",
    },
  ],
};

let colors = [
  "radial-gradient(circle at 50% 50%, rgba(94,50,169, 0.2) 0%, rgba(255,44,105, 1) 100%)",
  "radial-gradient(circle at 50% 50%,  rgba(36,141,255, 0) 0%, rgba(36,141,255,1) 100%)",
  "radial-gradient(circle at 50% 50%,  rgba(139,54,255, 0) 0%, rgba(139,54,255, 1) 100%)",
];
export const defaultOptions = dsf.mix(
  true,
  {
    nameRelation: "",
    valueRelation: "",
    percentRelation: "",
    unitRelation: "",
    title: {},
    tooltip: {
      trigger: "none", // item
      formatter: function (params) {
        if (params["data"]["name"] !== "") {
          return "<b>" + params["data"]["name"] + "</b>：<b>" + params["data"]["value"] + " </b>";
        }
      },
    },
    series: [
      {
        overrideLabe:false,
        seriesColorList: [...colors],
        name: "",
        type: "graph",
        layout: "none",
        force: {
          repulsion: 500,
        },
        padding:10,
        roam: true,
        draggable: true,
 
        topFlag: false,
        topNum: 3,
        topFontSize: 14,
        topColor: "#fff", //top排名字体颜色
        nameFontSize: 16,
        nameColor: "#fff", //名称字体颜色
        valueFlag: true,
        valueFontSize: 14,
        valueColor: "#fff",
        unitFontSize: 14,
        unitColor: "#DCF0FF",
        proportionFlag: false,
        proportionFontSize: 14,
        proportionColor: "#fff", //占比字体颜色

        maxSymbolSize: 150,
        bubbleSizeType: "auto",
        // 名字换行字数
        nameSplit: 0,
        unit: "",
        data: resultData.data,
      },
    ],
  },
  common
);

