/*
 * @Description: 三菱锥默认配置
 * @Author: shenah
 * @Date: 2024-01-22 18:21:46
 * @LastEditors: shenah
 * @LastEditTime: 2024-01-23 14:54:04
 */

export const createDefaultThreePyramidConfig = () => ({
  // 间距
  distance: 5,
  //项目圆的颜色
  itemCircleColorArr: [
    "rgb(69,16,161)",
    "rgb(31,63,148)",
    "rgb(0,99,131)",
    "rgb(26,91,61)",
    "rgb(0,99,131)",
  ],
  // 项目颜色
  itemColorArr: [
    "rgb(205,158,28)",
    "rgb(134,71,248)",
    "rgb(76,120,241)",
    "rgb(39,246,194)",
    "rgb(0,188,103)",
    "rgb(2,149,227)",
  ],
  isShowLegend: false,
  legendPosition: "bottom",
  legendDirection: "row",
  // legendFontFamily: "Microsoft Yahei",
  // legendFontSize: "20",
  // legendColor: "rgba(1,132,148,1)",
  legendTextConfig:{},
  legendDirectionV: "center",
  legendDirectionH: "center",
  textLineColor: "rgba(2,85,134,1)",
  // textFontFamily: "Microsoft Yahei",
  // textFontSize: "20",
  // textColor: "rgba(1,132,148,1)",
  contentTextConfig:{}
});
