/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-08-23 15:35:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 09:24:31
 */
import common from "../chartDefault/common";

export function createMap() {
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
        seriesIndex: 0,
        orient: "vertical",
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
          name: "基础地图",
          //添加系列名称映射值
          seriesNameRelation: "基础地图",
          //是否包含系类名称映射
          hasNameRelation: false,
          roam: true,
          zoom: 1.1,
          animationDurationUpdate: 0,
          //数据名称映射
          nameRelation: "",
          //数据值映射
          valueRelation: "",
          isDrag: false,
  
          map: "customMap",
          itemStyle: {
            areaColor: "#031525",
            borderColor: "#3B5077",
            borderWidth: 1,
            emphasis: {
              areaColor: "#2B91B7",
            },
          },
          emphasis: {
            disabled: false,
          },
          label: {
            show: true,
            color: "#1DE9B6",
            fontSize: 12,
            formatter: "{b}",
            formatters: ["{b}"],
            isFormatter: false,
            emphasis: {
              show: true,
              fontSize: 12,
              color: "#FFF",
            },
          },
          select: {
            disabled: false,
            label: {
              show: true,
              fontSize: 12,
              color: "#FFF",
            },
            itemStyle: {
              areaColor: "#fcdc30",
            },
          },
          data: [],
        },
      ],
    },
    common,
    { legend: null }
  );
}
