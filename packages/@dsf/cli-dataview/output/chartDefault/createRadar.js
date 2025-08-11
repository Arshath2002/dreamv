/*
 * @Description: 雷达图默认配置项
 * @Author: zhanghang
 * @Date: 2021-07-30 17:05:15
 * @LastEditors: shenah
 * @LastEditTime: 2023-09-28 13:45:10
 */
import common from "./common";

const createRadar = function () {
  return dsf.mix(
    true,
    {
      //雷达图数据系
      radar: [
        {
          name: {
            textStyle: {
              color: "#918080",
              backgroundColor: "transparent",
              fontSize: 12,
              borderRadius: 3,
              padding: [3, 5],
            },
          },
          //坐标轴线
          axisLine: {
            lineStyle: {
              color: "#666",
            },
          },
          //分割线
          splitLine: {
            lineStyle: {
              color: "#ccc",
            },
          },
          //分割区域
          splitArea: {
            areaStyle: {
              color: ["rgba(114, 172, 209, 0.2)"],
            },
          },
          indicator: [
            {
              name: "销售",
              axisLabel: {
                show: false,
                color: "#918080",
                fontSize: 12,
              },
            },
            { name: "管理" },
            { name: "信息技术" },
            { name: "客服" },
            { name: "研发" },
            { name: "市场" },
          ],
          // 圆点位置
          center: ["50%", "50%"],
          // 雷达大小
          radius: "75%",
          // 形状
          shape: "polygon",
          //开始角度
          startAngle: 90,
          // 分割份数
          splitNumber: 5,
        },
      ],
      //雷达图数据值
      series: [createRadarSeries()],
      //提示配置
      tooltip: {
        textStyle: {
          align: "left",
        },
        confine: true,
      },
    },
    common
  );
};

const createRadarSeries = function () {
  return {
    type: "radar",
    //顶点取值字段
    radarKey: "",
    data: [
      {

        name: "预算分配",
        //数据名称映射
        seriesNameRelation: "",
        //是否包含系类名称映射
        hasNameRelation: false,
        //数据值映射
        valueRelation: "value",
        symbol: "circle",
        symbolSize: 4,
        label: {
          show: false,
          position: "top",
          color: "#FFF",
          fontSize: 12,
          fontWeight: "normal",
        },
        itemStyle: {
          color: common.color[0],
        },
        lineStyle: {
          color: common.color[0],
          width: 1,
          type: "solid",
        },
        areaStyle: {
          color: "rgba(255,255,255,0)",
        },
        value: [430, 1000, 2800, 3500, 5000, 4000],
      },
    ],
  };
};

export { createRadar, createRadarSeries };
