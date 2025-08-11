/*
 * @Description: 圆环的默认配置
 * @Author: shenah
 * @Date: 2024-01-19 13:33:20
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-29 14:47:32
 */

// svg的相关的属性配置
export const createDefaultRingConfig = () => ({
  nodeCircleStrokeArr: [
    // 圆环节点
    "rgba(30,43,85,1)",
    "rgba(30,43,85,1)",
    "rgba(30,43,85,1)",
    "rgba(30,43,85,1)",
  ],
  bigCircleStrokeArr: [
    ["rgba(30,43,85,1)", "rgba(195,198,152,1)", "rgba(30,43,85,1)", "rgba(30,43,85,0.5)"],
    ["rgba(30,43,85,1)", "rgba(126,170,181,1)", "rgba(30,43,85,1)", "rgba(30,43,85,0.5)"],
    ["rgba(30,43,85,1)", "rgba(103,137,145,1)", "rgba(30,43,85,1)", "rgba(30,43,85,0.5)"],
    ["rgba(30,43,85,1)", "rgba(166,122,203,1)", "rgba(30,43,85,1)", "rgba(30,43,85,0.5)"],
  ],
  linesColors: [
    "linear-gradient(0deg, rgba(231,167,103,1) 0%,rgba(221,126,83,1) 100%)",
    "linear-gradient(0deg, rgba(150,201,242,1) 0%,rgba(111,167,221,1) 100%)",
    "linear-gradient(0deg, rgba(144,245,241,1) 0%,rgba(111,208,212,1) 100%)",
    "linear-gradient(0deg, rgba(182,138,242,1) 0%,rgba(117,73,199,1) 100%)",
  ],
  commonCircleStrokeWidth: 2, // 1,2,3,4圆公用的线宽
  rectNum: 20, // 进度条矩形一共的个数
  rectWidth: 8, // 进度条矩形的宽度
  rectHeight: 24, // 进度条矩形的高度
  gradientDirection:"vec"
});
