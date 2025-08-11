/*
 * @Description: 折线柱图混合配置选项
 * @Author: zhanghang
 * @Date: 2021-07-28 17:34:40
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-03-27 15:38:05
 */
import common from "./common";
import xaxis from "./xaxis";
import yaxis from "./yaxis";
import { createBarSeries } from "_dataview/output/chartDefault/createBar.js";
import { createLineSeries } from "_dataview/output/chartDefault/createLine.js";

const createMixinAxis = function () {
  return dsf.mix(
    true,
    {
      //数据系配置
      series: [
        createBarSeries("示例_bar", common.color[0]),
        createLineSeries("示例_line", common.color[1]),
      ],
      //提示配置
      tooltip: {
        trigger: "axis",
        textStyle: {
          align: "left",
        },
        confine: true,
      },
      //数据名称映射
      nameRelation: "name",
    },
    common,
    xaxis,
    yaxis
  );
};

export { createMixinAxis };
