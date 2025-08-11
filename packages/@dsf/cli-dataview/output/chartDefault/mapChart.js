// 地图图表
import common from "./common";
export default dsf.mix(
  true,
  {
    tooltip: {
      trigger: "item",
      textStyle: {
        align: "left",
      },
      confine:true
    },
    visualMap: {
      show: false,
      min: 0,
      max: 22,
      text: ["High", "Low"],
      realtime: false,
      calculable: true,
      inRange: {
        color: [
          "rgba(84,112,198,0.5)",
          "rgba(145,204,117,0.5)",
          "rgba(250,200,88,0.5)",
          "rgba(238,102,102,0.5)",
          "rgba(115,192,222,0.5)",
          "rgba(59,162,114,0.5)",
          "rgba(252,132,82,0.5)",
          "rgba(154,96,180,0.5)",
          "rgba(234,124,204,0.5)",
          "rgba(84,101,112,0.5)",
          "rgba(196,204,211,0.5)",
        ],
      },
    },
    series: [
      {
        name: "区域图",
        type: "map",
        map: "coord",
        label: {
          show: true,
        },
        itemStyle: {
          emphasis: {
            opacity: 0.4,
          },
        },
        showLegendSymbol: false,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        data: [
          {
            name: "成都市",
            value: 1,
          },
          {
            name: "自贡市",
            value: 2,
          },
          {
            name: "攀枝花市",
            value: 3,
          },
          {
            name: "泸州市",
            value: 4,
          },
          {
            name: "德阳市",
            value: 5,
          },
          {
            name: "绵阳市",
            value: 6,
          },
          {
            name: "广元市",
            value: 7,
          },
          {
            name: "遂宁市",
            value: 8,
          },
          {
            name: "内江市",
            value: 9,
          },
          {
            name: "乐山市",
            value: 10,
          },
          {
            name: "南充市",
            value: 11,
          },
          {
            name: "眉山市",
            value: 12,
          },
          {
            name: "宜宾市",
            value: 13,
          },
          {
            name: "广安市",
            value: 14,
          },
          {
            name: "达州市",
            value: 15,
          },
          {
            name: "雅安市",
            value: 16,
          },
          {
            name: "巴中市",
            value: 17,
          },
          {
            name: "资阳市",
            value: 18,
          },
          {
            name: "阿坝藏族羌族自治州",
            value: 19,
          },
          {
            name: "甘孜藏族自治州",
            value: 20,
          },
          {
            name: "凉山彝族自治州",
            value: 21,
          },
        ],
      },
    ],
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: false,
      backgroundColor: "transparent",
    },
    color: []
  },
  common,
  {
    title: {
      show: false,
    },
    legend: {
      show: false,
    }
  }
);
