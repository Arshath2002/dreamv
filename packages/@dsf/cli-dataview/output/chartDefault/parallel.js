/*
 * @Editor: zhanghang
 * @Description: 平行坐标系
 * @Date: 2024-05-30 11:47:08
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-08-01 09:38:33
 */
import createAxis from "./defaultParallelAxis.js";
import common from "./common";

const createParallel = function () {
  return dsf.mix(
    true,
    {
      parallel: {
        layout: "horizontal",
        parallelAxisDefault: {
          type: "value",
          nameLocation: "end",
          inverse: false,
          nameTextStyle: {
            fontSize: 12,
          },
          // 坐标轴线设置
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(220,240,255,0.6)",
            },
          },
          // 坐标刻度设置
          axisTick: {
            show: true,
            //刻度对齐数据系
            alignWithLabel: false,
          },
          // 坐标标签设置
          axisLabel: {
            show: true,
            fontSize: 12,
            rotate: 0,
            color: "#A5C9FF",
            interval: 0, //强制显示文字
          },
        },
      },
      parallelAxis: [
        {
          dim: 0,
          ...createAxis(),
          name: "价格",
          type: "value",
          defineMax: false,
          defineMin: false,
          valueRelation: "",
        },
        {
          dim: 1,
          ...createAxis(),
          type: "value",
          defineMax: false,
          defineMin: false,
          name: "权重",
          valueRelation: "",
        },
        {
          dim: 2,
          ...createAxis(),
          type: "value",
          defineMax: false,
          defineMin: false,
          name: "数量",
          valueRelation: "",
        },
        {
          dim: 3,
          ...createAxis(),
          type: "category",
          defineMax: false,
          defineMin: false,
          name: "分数",
          valueRelation: "",
        },
      ],
      //对线条颜色设置
      singleData: [
        {
          itemStyle: {
            color: common.color[0],
          },
        },
      ],

      //数据名称映射
      seriesNameRelation: "",
      //是否包含系类名称映射
      hasNameRelation: false,

      series: [
        {
          name: "平行坐标系",
          type: "parallel",
          smooth: false,
          lineStyle: {
            width: 1,
            type: "solid",
            opacity: 1,
          },

          data: [
            {
              value: [12.99, 100, 82, "好"],
            },
          ],
        },
      ],

      //提示配置
      tooltip: {
        trigger: "item",
        confine: true,
      },
    },
    common
  );
};

export { createParallel };
