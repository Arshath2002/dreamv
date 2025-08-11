import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
export default function () {
  return [
    {
      // 默认菜单背景颜色
      backgroundColor: ["rgba(100,148,234,0.1)", "rgba(79,174,255,0.5)"],
      //激活菜单背景颜色
      activeBackgroundColor: ["rgba(33,128,246,0.6)", "rgba(79,174,255,0.5)"],
      // 根菜单边线颜色
      bottomLineColor: ["#3F5E77", "#01EAED"],
      // 根菜单外圈颜色
      outLineColor: ["rgba(100,148,234,0.2)", "rgba(79,174,255,1)"],
      // 文字样式
      textStyle: createCommonTextStyle({
        fontSize: "16", // 字号
      }),
      activeTextStyle: createCommonTextStyle({
        // 采用单色,渐变等
        color: "#01EAED",
        fontSize: "16", // 字号
      }),
    },
    {
      // 默认菜单背景颜色
      backgroundColor: ["rgba(100,148,234,0.1)", "rgba(79,174,255,0.5)"],
      //激活菜单背景颜色
      activeBackgroundColor: ["rgba(33,128,246,0.6)", "rgba(79,174,255,0.5)"],
      // 根菜单边线颜色
      bottomLineColor: ["#3F5E77", "#01EAED"],
      // 根菜单外圈颜色
      outLineColor: ["rgba(100,148,234,0.2)", "rgba(79,174,255,1)"],
      // 文字样式
      textStyle: createCommonTextStyle({
        fontSize: "14", // 字号
      }),
      activeTextStyle: createCommonTextStyle({
        // 采用单色,渐变等
        color: "#01EAED",
        fontSize: "14", // 字号
      }),
    },
  ];
}
