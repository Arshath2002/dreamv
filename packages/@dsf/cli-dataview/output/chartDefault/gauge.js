/*
 * @Description: 仪表盘
 * @Author: zhanghang
 * @Date: 2022-08-18 16:57:09
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-10 14:22:30
 */
import common, { color } from "./common";
export default dsf.mix(
  true,
  {
    series: [
      {
        type: "gauge",
        radius: "75%",
        center: ["50%", "50%"],
        startAngle: 225,
        endAngle: -45,
        min: 0,
        max: 100,
        splitNumber: 10,
        // 进度条
        progress: {
          show: false,
          width: 6,
          itemStyle: {
            color: "#fff",
          }
        },
        // 轴线
        axisLine: {
          show: true,
          lineStyle: {
            width: 6,
            color: [
              [0.2, "#5470c6"],
              [0.8, "#91cc75"],
              [1, "#fac858"],
            ],
          },
        },
        // 分割线样式
        splitLine: {
          show: true,
          length: 30,
          lineStyle: {
            color: "auto",
            width: 5,
          },
        },
        // 刻度样式
        axisTick: {
          show: true,
          splitNumber: 5,
          length: 8,
          lineStyle: {
            color: "auto",
            width: 2,
          },
        },
        //指示器
        pointer: {
          show: true,
          length: "80%",
          width: 8,
          itemStyle: {
            color: "#fac858",
          },
        },
        itemStyle: {
          color: "#464646",
        },
        //刻度标签
        axisLabel: {
          show: true,
          color: "#464646",
          fontSize: 16,
          distance: 5,
        },
        //标题
        title: {
          show: true,
          offsetCenter: [0, "-40%"],
          color: "#23B7E5",
          fontSize: 15,
        },
        //数据
        detail: {
          show: true,
          fontSize: 20,
          offsetCenter: [0, "40%"],
          valueAnimation: true,
          formatterHtml: "@[value]",
          color: "#23B7E5",
        },
        //数据名称映射
        nameRelation: "",
        //数据值映射
        valueRelation: "",
        data: [
          {
            value: 60,
            name: "Grade Rating",
          },
        ],
      },
    ],
    tooltip: {
      show: false,
      textStyle: {
        align: "left",
      },
      confine:true
    },
  },
  common
);
