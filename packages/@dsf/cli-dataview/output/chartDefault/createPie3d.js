/*
 * @Description: 饼图3d
 * @Author: zhanghang
 * @Date: 2022-10-28 17:59:56
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-12-24 11:00:12
 */
const createPie3d = function () {
  return {
    chart: {
      type: "pie",
      backgroundColor: "rgba(0,0,0,0)",
      options3d: {
        enabled: true, // 开启3d
        alpha: 50,
        beta: 0,
      },
    },
    title: {
      align: "center",
      text: "",
      style: {
        color: "#DCF0FF",
        fontSize: "18",
      },
      x: 0,
      y: 0,
    },
    // 千以上的数字去掉空格
    lang: {
      thousandsSep: "",
    },
    // 图例
    legend: {
      align: "center",
      verticalAlign: "bottom",
      enabled: true,
      layout: "horizontal",
      floating: false,
      x: 0,
      y: 0,
      itemStyle: {
        color: "#DCF0FF",
        fontSize: 12,
        fontFamily: "Microsoft Yahei",
        fontWeight: "normal",
      },
    },
    // 隐藏版权信息
    credits: {
      enabled: false,
    },
    colors: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc", "#546570", "#c4ccd3"],
    plotOptions: {
      pie: {
        showInLegend: true,
        dataLabels: {
          enabled: true,
        },
        slicedOffset: 20,
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#ffffff",
      borderColor: "#ffffff",
      borderWidth: 1,
      padding: 8,
      headerFormat: "",
      pointFormat: "{point.name}: {point.y}",
      style: {
        align: "left",
        color: "#333",
        fontSize: 12,
        fontFamily: "Microsoft Yahei",
        fontWeight: "normal",
      },
    },
    series: [createPie3dSeries()],
  };
};

const createPie3dSeries = function (options = {}) {
  return {
    type: "pie",
    zIndex: 1,
    startAngle: 150, // 调整饼图的角度   方向：顺时针
    allowPointSelect: false,
    center: ["50%", "50%"],
    size: "95%",
    innerSize: "50%", // 设置同心圆
    depth: 45,
    cursor: "pointer",
    showInLegend: true,
    dataLabels: {
      enabled: true,
      format: "{point.name}:{point.y}",
      formatters: ["{point.name}:{point.y}"],
      distance: "30",
      style: {
        textOutline: "none",
        color: "#ffffff",
        fontSize: 12,
        fontFamily: "Microsoft Yahei",
        fontWeight: "normal",
      },
    },
    name: "3D 饼图",
    singleData: [],
    //名称映射
    nameRelation: "",
    //系列名映射
    seriesNameRelation: "",
    //数据值映射
    valueRelation: "",
    //是否包含系类名称映射
    hasNameRelation: false,
    data: [],
    ...options,
  };
};

export { createPie3d, createPie3dSeries };
