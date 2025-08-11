/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-08-23 15:35:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-17 11:08:10
 */
import common from "../chartDefault/common";
export function createScatterMap (){
  return dsf.mix(
    true,
    {
      tooltip: {
        trigger: "item",
      },
      visualMap: {
        show: false,
        type: "continuous",
        calculable: true,
        min: 0,
        max: 1000,
        left: "left",
        bottom: "auto",
        right: "auto",
        top: "top",
        showLabel: true,
        seriesIndex: -1,
  
        text: ["高", "低"],
        textStyle: {
          color: "#ededed",
          fontSize: 12,
        },
        inRange: {
          color: ["#04387b", "#467bc0"], // 蓝绿
        },
        pieces: [
          {
            gte: 0,
            lt: 50,
            color: "#ff8c71",
          },
          {
            gte: 50,
            lt: 100,
            color: "#ff5428",
          },
          {
            gte: 100,
            color: "#7f1100",
          },
        ],
      },
      geo: {
        show: true,
        roam: true,
        zoom: 1.1,
        map: "customMap",
        label: {
          show: false,
          color: "#1DE9B6",
          fontSize: 12,
          emphasis: {
            show: false,
            color: "#FFF",
          },
        },
        itemStyle: {
          shadowColor: "rgba(58,115,192,0.5)",
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          shadowBlur: 1,
        },
        animationDurationUpdate: 0,
      },
      series: [
        {
          type: "map",
          name: "热力图",
          //添加系列名称映射值
          seriesNameRelation: "热力图",
          //是否包含系类名称映射
          hasNameRelation: false,
          roam: true,
          zoom: 1.1,
          isDrag: false,
          animationDurationUpdate: 0,
          //数据名称映射
          nameRelation: "",
          //数据值映射
          valueRelation: "",
          map: "customMap",
          itemStyle: {
            areaColor: "#031525",
  
            borderColor: "#3B5077",
            borderWidth: 1,
            emphasis: {
              areaColor: "#2B91B7",
            },
          },
          select: {
            label: {
              show: true,
              fontSize: 12,
              color: "#FFF",
            },
            itemStyle: {
              areaColor: "#fcdc30",
            },
          },
          emphasis: {
            disabled: false,
          },
          label: {
            show: true,
            disabled: false,
            color: "#1DE9B6",
            fontSize: 12,
            emphasis: {
              show: true,
              color: "#FFF",
            },
          },
          data: [],
        },
        {
          name: "撒点",
          type: "scatter",
          //添加系列名称映射值
          seriesNameRelation: "撒点",
          //是否包含系类名称映射
          hasNameRelation: false,
          coordinateSystem: "geo",
          symbol: "pin",
          //数据名称映射
          nameRelation: "",
          //数据值映射
          valueRelation: "",
          symbolSize: 20,
          tooltip: {
            formatter: function (params) {
              return params.data.name + "：" + params.data.value[2];
            },
          },
          symbolOffset: [0, 0],
          large: true,
          label: {
            formatter: "{b}：{c}",
            formatters: ["{b}：{c}"],
            isFormatter: false,
            show: false,
            position: "inside",
            distance: 5,
            color: "#fff",
            fontSize: 12,
            offset: [0, 0],
          },
          itemStyle: {
            color: "#F62157",
          },
          data: [],
          animationDurationUpdate: 0,
        },
      ],
    },
    common,
    { legend: null }
  );
  
}