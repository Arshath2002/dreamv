/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2025-05-13 15:42:35
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-21 15:06:04
 */
import common from "./common";

const createPie = function () {
  return dsf.mix(
    true,
    {
      //数据系配置
      series: [createPieSeries("示例")],
      //提示配置
      tooltip: {
        trigger: "item",
        textStyle: {
          align: "left",
        },
        confine: true,
      },
    },
    common
  );
};

function createPieSeries(name) {
  return {
    name,
    type: "pie",
    //饼图位置
    center: ["50%", "50%"],
    //饼图内外环
    radius: ["0", "70%"],
    // 防止标签重叠
    avoidLabelOverlap: true,
    //是否展示成南丁格尔
    roseType: false,
    // 标签
    label: {
      show: true,
      fontSize: 12,
      color: "#000000",
      position: "outside",
      lineHeight: 15,
      formatter: "{b}:{c}",
      formatters: ["{b}:{c}"],
    },
    itemStyle: {
      isShowBorder: false,
      borderWidth: 0,
      borderColor: "#ededed",
    },
    emphasis: {
      label: {
        show: true,
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    // 标签引导线
    labelLine: {
      show: true,
    },
    singleData: [],
    data: [],
    //数据名称映射
    nameRelation: "",
    //数据值映射
    valueRelation: "",
    //系列名称映射
    seriesNameRelation: "",
    //是否包含系类名称映射
    hasNameRelation: false,
  };
}

export { createPie, createPieSeries };
