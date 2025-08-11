/*
 * @Description: 3D地球
 * @Author: shenah
 * @Date: 2024-07-24 09:18:03
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-22 09:38:00
 */

import common from "../../chartDefault/common";
import { createFlySeries } from "./flyLineSeries";

export function createGlobeMap() {
  return dsf.mix(
    true,
    {
      tooltip: {
        show: false,
        trigger: "item",
      },
      baseTextureOptions: {
        backgroundColor: "rgba(3,28,72,1)",
        series: [
          {
            type: "map",
            map: "world",
            name: "",
            seriesNameRelation: "",
            //是否包含系类名称映射
            hasNameRelation: false,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            boundingCoords: [
              [-180, 90],
              [180, -90],
            ],
            zoom: 0,
            roam: false,
            itemStyle: {
              areaColor: "#2455ad",
              borderColor: "#000c2d",
              borderWidth: 1,
              emphasis: {
                areaColor: "#357cf8",
              },
            },
            select: {
              disabled: false,
              label: {
                show: true,
                fontSize: 12,
                color: "#FFF",
              },
              itemStyle: {
                areaColor: "#fcdc30",
              },
            },
            emphasis: {
              disabled: false,
            },
            label: {
              show: true,
              fontSize: 20,
              color: "#fff",
              emphasis: {
                show: true,
                fontSize: 30,
                color: "yellow",
              },
            },
            data: [],
          },
        ],
        visualMap: {
          show: false,
          type: "continuous",
          calculable: true,
          min: 0,
          max: 1000,
          left: "left",
          bottom: "auto",
          right: "auto",
          top: "top",
          showLabel: true,
          seriesIndex: 0,
          orient: "vertical",
          text: ["高", "低"],
          textStyle: {
            color: "#ededed",
            fontSize: 12,
          },
          inRange: {
            color: ["#04387b", "#467bc0"], // 蓝绿
          },
          pieces: [
            {
              gte: 0,
              lt: 50,
              color: "#ff8c71",
            },
            {
              gte: 50,
              lt: 100,
              color: "#ff5428",
            },
            {
              gte: 100,
              color: "#7f1100",
            },
          ],
        },
      },
      globe: {
        baseTextureType: "default", // 基本纹理的类型(自定义)
        baseTexture: "",
        environmentType: "no", // 无、色彩、贴图
        environment: "auto",
        environmentImgObj: {
          // 自定义
          active: "custom",
          custom: {
            image: "",
            size: "contain",
            repeat: "no-repeat",
            position: ["center", "middle"],
            static: true,
          },
        },
        atmosphere: {
          show: false,
          offset: 0, // 外部大气层相对于默认位置的偏移。
          color: "#fff", // 外部大气层的颜色。
          glowPower: "6", // 外部大气层发光功率。
          innerGlowPower: "2", // 外部大气层内发光功率。
        },
        baseTextureImgObj: {
          // 自定义
          active: "custom",
          custom: {
            image: "",
            size: "contain",
            repeat: "no-repeat",
            position: ["center", "middle"],
            static: true,
          },
        },
        globeRadius: 150,
        globeOuterRadius: 150,
        shading: "color",
        light: {
          // 光照阴影
          main: {
            color: "rgba(255,255,255,1)", // 光照颜色
            intensity: 0, // 光照强度
            shadowQuality: "high", //阴影亮度
            shadow: false, // 是否显示阴影
            alpha: 0,
            beta: 0,
            show: false,
          },
          ambient: {
            color: "rgba(255,255,255,1)",
            intensity: 1,
            show: false,
          },
        },
        viewControl: {
          alpha: 30,
          beta: 190,
          autoRotate: false,
          autoRotateAfterStill: 10,
          distance: 240,
          autoRotateDirection: "cw",
          autoRotateSpeed: 10,
        },
      },
      series: [
        {
          ...createFlySeries(),
        },
      ],
    },
    common,
    { legend: null, backgroundColor: "rgba(0,0,0,0)" }
  );
}
