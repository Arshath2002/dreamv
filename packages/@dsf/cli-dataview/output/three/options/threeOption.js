/*
 * @Editor: zhanghang
 * @Description:
 * @Date: 2024-06-12 10:53:36
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-19 19:07:39
 */
import createLabel from "./createLabel";
import createFlight from "./createFlight";
import createMarker from "./createMarker";
const marker = createMarker();
const flight = createFlight();
const label = createLabel();

export default {
  config: {
    autoScale: true,
    disableRotate: false,
    disableZoom: false,
    autoScaleFactor: 1,
    scale: 100,
    depth: 35,
  },
  autoRotate: {
    autoRotate: false,
    autoRotateSpeed: 2,
  },
  camera: {
    x: 0.8,
    y: 6,
    z: 3,
  },
  grid: {
    show: false,
    color: "#87CEFA",
    opacity: 0.2,
  },
  foundation: {
    show: false,
    size: 800,
    speed: 0.5,
    image: "default",
    isRotate: true,
    static: false,
  },
  tooltip: {
    show: true,
    content: "",
    styleType: "0",
    isFormatter: false, // 是否格式化
    formatterHtml: "", // 格式化的html
    formatter: function (data) {
      var name = data.name || "-- ";
      var value = data.value === undefined ? "-- " : data.value;
      return "<span>" + name + "：</span>" + "<span>" + value + "</span>";
    },
    itemStyle: {
      backgroundColor: "rgba(50,50,50,0.7)",
      borderColor: "#333",
      borderWidth: 0,
      padding: [10, 10, 10, 10],
      color: "#fff",
      fontSize: 14,
      minWidth: 80,
      width: "max-content",
      borderRadius: 5,
      borderStyle: "solid",
    },
  },
  mirror: {
    show: false,
    color: ["#000", "#10BEE5"],
  },
  wall: {
    show: false,
    height: 40,
    color: "#BEEFFF",
  },
  //地图纹理
  texture: {
    show: false,
    autoRepeat: false,
    repeat: {
      x: 0.0927,
      y: 0.124,
    },
    offset: {
      x: 0.528,
      y: 0.374,
    },
    image: "default",
  },
  map: "100000",
  mapName: "中国",
  //辉光设置
  glow: {
    show: true,
    threshold: 0,
    strength: 1,
    radius: 0,
  },
  //流光设置
  flow: {
    show: true,
    pointSpeed: 5,
    pointSize: 2.0,
    pointColor: "#4ec0e9",
  },
  itemStyle: {
    //开启色阶
    range: {
      show: false,
      mode: "range",
      rules: [
        {
          value: 0,
          color: "#00FF15",
          label: ">=0",
        },
      ],
      color: ["#15B3D6", "#006EDD"],
      min: 0,
      max: 1000,
      visualMap: {
        show: false,
        left: "2%",
        top: "2%",
        maxText: "高",
        minText: "低",
        textStyle: {
          fontSize: 12,
          color: "#FFF",
          fontStyle: "normal",
          fontWeight: "normal",
          fontFamily: "Microsoft Yahei",
          textDecoration: "",
          textShadow: "",
        },
      },
    },
    topColor: "#4470DF", //面的顶面颜色
    sideColor: "#80B2FF", //侧边颜色
    uColor: "#4D94FF", //侧边动画颜色
  },
  //悬浮样式
  emphasis: {
    show: false, //有效
    topColor: "#00E6E6", //面的顶面颜色
    textStyle: {
      fontSize: 12,
      color: "#FFF",
      fontStyle: "normal",
      fontWeight: "normal",
      fontFamily: "Microsoft Yahei",
      textDecoration: "",
      textShadow: "",
    },
  },
  //线条颜色
  lineStyle: {
    color: "#A5D0ED",
  },
  //轮廓样式
  outLineStyle: {
    color: "#BEEFFF",
  },
  //地区名称样式
  label,
  nameRelation: "name",
  valueRelation: "value",
  districtRelation: "adcode",
  seriesName: "map",
  data: [],
  //系列
  series: [marker,flight],
};
