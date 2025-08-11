/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-08-23 15:35:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 09:24:55
 */
import common from "../chartDefault/common";

export function createFlyMap(){
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
      // 勿删除对应的series的type，这里被用作了默认值在组件中使用
      series: [
        {
          type: "map",
          name: "热力图",
          //添加系列名称映射值
          seriesNameRelation: "热力图",
          //是否包含系类名称映射
          hasNameRelation: false,
          roam: true,
          isDrag: false,
          zoom: 1.1,
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
              color: "#FFF",
            },
          },
          emphasis: {
            disabled: false,
          },
          label: {
            show: true,
            color: "#1DE9B6",
            fontSize: 12,
            emphasis: {
              show: true,
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
        {
          type: "lines",
          name: "飞行线",
          //添加系列名称映射值
          seriesNameRelation: "飞行线",
          //是否包含系类名称映射
          hasNameRelation: false,
          zlevel: 3,
          coordinateSystem: "geo",
          //开始名称映射
          startRelation: "",
          //结束映射
          endRelation: "",
          symbol: "none",
          symbolSize: 10,
          large: true,
          effect: {
            show: true,
            delay: 0,
            period: 4,
            symbol: "arrow",
            constantSpeed: 0,
            symbolSize: 8,
            trailLength: 0.2,
            loop: true,
          },
          lineStyle: {
            color: "rgb(58,115,192)",
            width: 1,
            type: "solid",
            opacity: 0.5,
            curveness: 0.3,
          },
          label: {
            show: false,
            position: "end",
  
            color: "#fff",
            fontSize: 12,
          },
          animationDurationUpdate: 0,
          data: [],
        },
      ],
    },
    common,
    { legend: null }
  );
}
