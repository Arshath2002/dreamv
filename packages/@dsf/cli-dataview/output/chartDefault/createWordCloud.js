/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2025-05-22 17:25:25
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-22 17:28:57
 */
import common from "./common";
const createData = function () {
  return [
    {
      name: "双柱图",
      value: "3000",
    },
    {
      name: "折线图",
      value: "2990",
    },
    {
      name: "柱状图",
      value: "2980",
    },
    {
      name: "饼环图",
      value: "2970",
    },
    {
      name: "折柱图",
      value: "2960",
    },
    {
      name: "仪表盘",
      value: "2950",
    },
    {
      name: "多环图",
      value: "2940",
    },
    {
      name: "3D饼图",
      value: "2930",
    },
    {
      name: "旭日图",
      value: "2920",
    },
    {
      name: "桑基图",
      value: "2910",
    },
    {
      name: "水波图",
      value: "2900",
    },
    {
      name: "热词气泡",
      value: "2890",
    },
    {
      name: "雷达图",
      value: "2880",
    },
    {
      name: "散点图",
      value: "2870",
    },
    {
      name: "词云",
      value: "2860",
    },
    {
      name: "矩形树图",
      value: "2850",
    },
    {
      name: "象形图",
      value: "2840",
    },
    {
      name: "漏斗图",
      value: "2830",
    },
    {
      name: "平行坐标系",
      value: "2820",
    },
    {
      name: "特殊形状柱状图",
      value: "2810",
    },
    {
      name: "圆三棱锥",
      value: "2800",
    },
    {
      name: "树图",
      value: "2790",
    },
    {
      name: "极坐标图",
      value: "2780",
    },
    {
      name: "关系图谱",
      value: "2770",
    },
    {
      name: "k线图",
      value: "2760",
    },
    {
      name: "3D字符云",
      value: "2750",
    },
    {
      name: "水位图组",
      value: "2740",
    },
    {
      name: "表格",
      value: "2730",
    },
    {
      name: "数据看板",
      value: "2720",
    },
    {
      name: "排名",
      value: "2710",
    },
    {
      name: "图文组件",
      value: "2700",
    },
    {
      name: "占比条",
      value: "2690",
    },
    {
      name: "数字翻牌器",
      value: "2680",
    },
    {
      name: "文本跑马灯",
      value: "2670",
    },
    {
      name: "图标排名",
      value: "2660",
    },
    {
      name: "滚动胶囊",
      value: "2650",
    },
    {
      name: "进度池",
      value: "2640",
    },
    {
      name: "进度条",
      value: "2630",
    },
    {
      name: "环绕图文",
      value: "2620",
    },
  ];
};
const createWordCloud = function () {
  return dsf.mix(
    true,
    true,
    {
      nameRelation: "name",
      valueRelation: "value",
      tooltip: {
        show: true,
        textStyle: {
          align: "left",
        },
        confine: true,
      },
      series: [
        {
          width: "100%",
          height: "100%",
          top: "middle",
          left: "center",
          type: "wordCloud",
          gridSize: 0,
          sizeRange: [12, 26],
          rotationRange: [0, 0],
          rotationStep: 0,
          arrayMethod: "horizontal",
          textPadding: 0,
          shape: "circle",
          autoSize: {
            enable: true,
            minSize: 6,
          },
          singleData: [],
          animation: false,
          animationDuration: 2000,
          animationEasing: "linear",
          animationDelay: 500,
          textStyle: {
            isRandomColor: false,
            color: "#5470c6",
            // 是否显示阴影
            showTextShadow: false,
            copyTextShadowColor: "#c6c6c6",
            // 阴影颜色
            textShadowColor: "",
            // 阴影模糊
            textShadowBlur: 5,
            // 阴影角度
            textShadowOffsetX: 3,
            textShadowOffsetY: 3,
          },
          data: [],
        },
      ],
    },
    common
  );
};
export { createWordCloud, createData };
