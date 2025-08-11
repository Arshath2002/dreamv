import { color } from "./common.js";
const createTreeMap = function () {
  return {
    // 颜色控制
    color: [...color],
    //标题配置
    title: {
      show: true,
      //主标题
      text: "",
      //副标题
      subtext: "",
      //主标题与副标题间距
      itemGap: 10,
      //位置
      left: "auto",
      top: "auto",
      right: "auto",
      bottom: "auto",
      // 标题大小设置
      textStyle: {
        color: "#333",
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      show: true,
      textStyle: {
        align: "left",
      },
      confine: true,
    },
    series: [
      {
        type: "treemap",
        width: "100%",
        roam: false, // 平移和缩放控制
        height: "100%",
        nodeClick: false, // 点击控制
        breadcrumb: false, // 面包屑控制
        visualMin: 0,
        //数据名称映射
        nameRelation: "",
        //数据值映射
        valueRelation: "",
        itemStyle: {
          gapWidth: 0,
          borderColor: "#fff",
          decal: {
            symbolSize: 0,
            color: "#ccc",
            dashArrayX: 10,
            dashArrayY: 10,
            rotation: 45,
          },
        },
        data: [],
        singleData: [],
        label: {
          show: true,
          color: "#fff",
          fontSize: 12,
          formatter: "{b}:{c}",
        },
      },
    ],
  };
};
export { createTreeMap };
