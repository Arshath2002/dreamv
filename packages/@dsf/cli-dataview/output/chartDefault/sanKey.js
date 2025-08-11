/*
 * @Description: 桑基图默认配置
 * @Author: shenah
 * @Date: 2023-11-29 09:09:26
 * @LastEditors: shenah
 * @LastEditTime: 2024-04-12 11:33:36
 */

import common from "./common";
let options = dsf.mix(
  true,
  {
    series: [
      {
        type: "sankey",
        left: "5%",
        top: "5%",
        right: "10%",
        bottom: "5%",
        name: "示例",
        draggable: false,
        orient: "horizontal",
        label: {
          show: true,
          position: "right",
          color: "rgba(25, 14, 234, 1)",
          fontSize: "12",
          offset: [0, 0],
        },
        edgeLabel: {
          show: false,
          color: "#fff",
          fontSize: "12",
          offset: [0, 0],
          formatter: "{c}",
        },
        lineStyle: {
          isCustomColor: false,
          isShade: false,
          startColor: "#314656",
          endColor: "#314656",
          color: "gradient",
          opacity: 0.2,
          curveness: 0.5,
        },
        itemStyle: {
          color: null,
          borderColor: "#aaa",
          borderWidth: 1,
          borderType: "solid",
          opacity: 1,
        },
        data: [
          {
            name: "进入",
          },
          {
            name: "首页",
          },
          {
            name: "个人中心",
          },
          {
            name: "购物车",
          },
          {
            name: "商品",
          },
          {
            name: "订单",
          },
        ],
        links: [
          {
            source: "进入",
            target: "首页",
            value: 5,
          },
          {
            source: "进入",
            target: "个人中心",

            value: 3,
          },
          {
            source: "个人中心",
            target: "购物车",
            value: 8,
          },
          {
            source: "购物车",
            target: "商品",
            value: 8,
          },
          {
            source: "个人中心",
            target: "订单",
            value: 9,
          },
        ],
        sourceRelation: "",
        targetRelation: "",
        targetValueRelation: "",
        layoutIterations: 1,
      },
    ],
    //提示配置
    tooltip: {
      trigger: "item",
      textStyle: {
        align: "left",
      },
      confine:true
    },
  },
  common
);
delete options.legend;
delete options.grid;
export default options;
