/*
 * @Description: K线图相关配置
 * @Author: shenah
 * @Date: 2024-07-03 15:55:53
 * @LastEditors: shenah
 * @LastEditTime: 2024-07-08 11:58:24
 */

import common from "./common";
import xaxis from "./xaxis";
import yaxis from "./yaxis";
function createOneCandlestick() {
  return {
    type: "candlestick",
    name: "示例_0",
    //对应x轴下标
    yAxisIndex: 0,
    //对应y轴下标
    xAxisIndex: 0,
    barWidth: 20, // 柱的宽度
    itemStyle: {
      // k线图形的样式
      color: "rgba(239,35,42,1)", // 阳线
      color0: "rgba(20,177,67,1)", // 阴线
      isShowBorder: true, // 是否显示边框,阳线与阴线公用一个边框
      borderColor: "rgba(239,35,42,1)", // 阳线边线
      borderColor0: "rgba(20,177,67,1)", //阴线边线颜色
      borderColorDoji: "rgba(239,35,42,1)", // 十字准星线颜色描边
      borderWidth: 1, // 边框的宽度
    },
    data: [
      [220.26, 220.26, 187.3, 262.94],
      [200, 191.3, 188.26, 208.38],
      [195.35, 246.5, 195.35, 246.92],
      [247.22, 258.98, 237.35, 263.8],
      [260.75, 282.48, 247.89, 283.76],
      [283.43, 285.42, 271.23, 291.82],
      [277.41, 319.02, 269.57, 321.15],
    ],
    // 标记线
    markLine: {
      symbol: ["circle", "arrow"],
      symbolSize: 10,
      data: [],
    },
    //数据名称映射
    seriesNameRelation: "",
    //是否包含系类名称映射
    hasNameRelation: false,

    valueRelation: "value",
    openRelation: "open",
    closeRelation: "close",
    lowestRelation: "lowest",
    highestRelation: "highest",
  };
}

export function defaultCandlestick(name, arr) {
  let obj = createOneCandlestick();
  obj.name = name;
  obj.itemStyle.color = arr[0];
  obj.itemStyle.borderColor = arr[0];
  obj.itemStyle.color0 = arr[1];
  obj.itemStyle.borderColor0 = arr[1];
  obj.itemStyle.borderColorDoji = arr[0];
  return obj;
}
export function createCandlestick() {
  return dsf.mix(
    true,
    {},
    {
      //数据系配置
      series: [createOneCandlestick()],
      //提示配置
      tooltip: {
        trigger: "axis",
        textStyle: {
          align: "left",
        },
        confine: true,
      },
    },
    common,
    xaxis,
    yaxis
  );
}
