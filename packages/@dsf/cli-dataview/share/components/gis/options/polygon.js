/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2023-08-18 14:37:34
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-10-23 14:36:13
 */
import label from "./label.js";
import tooltip from "./tooltip.js";
import line from "./line.js";
import legend from "./legend.js";
import visualMap from "./visualMap.js";
import dataField from "./dataField.js";
/**
 * 创建面图层
 */
export default function createPolygon() {
  return dsf.mix(true, {}, label, tooltip, line, legend, dataField, {
    seriesType: "polygon",
    polygon: {
      show: true,
      seriesName: "面",
      zIndex: 120,
      zooms: [2, 20],
      opacity: 1,
      isShowHighAttr: false, // 是否显示高级属性
      acceptLight: true, //是否接受光照
      shininess: 30, //表面粗糙度
      hasSide: true, //是否有侧面-针对有高度的面
      hasBottom: false, //是否有地面-针对有高度的面
      cullface: "none", //剔除面-针对有高度的面
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
          color: ["rgba(51, 139, 156, 0.3)", "#006EDD"],
          min: 0,
          max: 1000,
        },
        //是否含有遮罩
        mask: {
          show: false,
          strokeColor: "rgba(255,255,255,0.5)",
          color: "#ededed",
          opacity: 0.4,
        },
        topColor: "rgba(6,130,158,0.3)", //面的顶面颜色
        sideTopColor: "#055e72", //面的侧面顶部的颜色
        sideBottomColor: "#055e72", //面的侧面底部的颜色
        altitude: 0, //海拔高度
        height: 1, //面的厚度支持函数回调
        texture: null, //纹理
        labelAltitude: 0, //文字标注相对于顶面的海拔高度
        ...visualMap, // 视觉映射
      },
      //悬浮样式
      emphasis: {
        show: true, //有效
        itemStyle: {
          topColor: "#7fccf6", //面的顶面颜色
          sideTopColor: "#5f99b9", //面的侧面顶部的颜色
          sideBottomColor: "#5f99b9", //面的侧面底部的颜色
          height: 1, //面的厚度支持函数回调
        },
      },
    },
    line: {
      show: true,
      itemStyle: {
        color: "#35c9cc",
      },
      emphasis: {
        show: true, //是否有效
        itemStyle: {
          color: "#35c9cc",
        },
      },
    },
  });
}
