/*
 * @Description: 3D球体相关配置
 * @Author: shenah
 * @Date: 2024-08-22 09:14:40
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-06 14:42:01
 */
import createScatter from "./createScatter.js";
import createFlight from "./createFlight.js";
import createMarker from "./createMarker.js";
import createSatellite from "./createSatellite.js";

import { tooltip } from "./createTooltip.js";
import createLabel from "./createLabel";
const label = createLabel();
label.show = false;
export default {
  // 配置
  config: {
    radius: 40,
  },
  camera: {
    x: -17,
    y: 47,
    z: -120,
  },
  world: {
    seriesName: "",
    show: false,
    label,
    labelScale: 8,
    itemStyle: {
      //线条颜色
      lineStyle: {
        color: "rgba(255,255,255,0.4)",
      },
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
        color: ["rgb(6,130,158)", "#006EDD"],
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
      color: "rgba(0,62,98,0.4)", //面颜色
    },
    //悬浮面样式
    emphasis: {
      show: true, //有效
      color: "#00E6E6", //面的顶面颜色
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
    nameRelation: "",
    valueRelation: "",
    districtRelation: "",
    data: [],
  },
  // 地球
  earth: {
    texture: "default",
    // 光环
    aureola: {
      color: "#0cd1eb",
    },
    border: {
      show: true,
      color: "rgba(96, 212, 212, 0.5)",
      radius: 45,
      size: 1,
    },
  },
  // 卫星配置
  satellite: {
    show: true,
    data: [createSatellite()],
  },
  markerTooltip: tooltip,
  viewControl: {
    autoRotate: true, // 转动
    autoRotateDirection: "cww", // 顺时针cw,逆时针cww
    autoRotateSpeed: 1, // 转动的速度
  },
  series: [createScatter(), createFlight(), createMarker()],
};
