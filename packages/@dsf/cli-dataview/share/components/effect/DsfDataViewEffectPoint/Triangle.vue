<!--
 * @Description: 生成三角形
 * @Author: shenah
 * @Date: 2024-12-16 09:52:45
 * @LastEditors: shenah
 * @LastEditTime: 2024-12-16 15:03:54
-->

<template>
  <svg
    :width="itemWidth"
    :height="itemHeight"
    :style="svgStyle"
    class="triangle-container"
  >
    <!-- 定义滤镜 -->
    <defs>
      <filter :id="outerTriangleId">
        <feDropShadow
          :dx="outerShadowAttr.dx"
          :dy="outerShadowAttr.dy"
          :stdDeviation="outerShadowAttr.stdDeviation"
          :flood-color="outerShadowAttr.color"
          :flood-opacity="outerShadowAttr.opacity"
        />
      </filter>
      <filter :id="innerTriangleId">
        <feDropShadow
          :dx="innerShadowAttr.dx"
          :dy="innerShadowAttr.dy"
          :stdDeviation="innerShadowAttr.stdDeviation"
          :flood-color="innerShadowAttr.color"
          :flood-opacity="innerShadowAttr.opacity"
        />
      </filter>
    </defs>
    <!-- 外层三角形 -->
    <polygon
      :points="trianglePoints"
      :style="outerTriangleStyle"
      :filter="outerShadowConfig.flag ? `url(#${outerTriangleId})` : ''"
      class="outer-triangle"
    />
    <!-- 内层三角形 -->
    <polygon
      :points="innerTrianglePoints"
      :style="innerTriangleStyle"
      :filter="innerShadowConfig.flag ? `url(#${innerTriangleId})` : ''"
      class="inner-triangle"
    />
  </svg>
</template>

<script>
import commonMixin from "./mixins.js";
import threeTool from "_dataview/output/utils/threeTool.js";
export default {
  name: "Triangle",
  mixins: [commonMixin],
  props: {
    triangleDirection: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      outerTriangleId: "triangle-outer-shadow" + dsf.uuid(),
      innerTriangleId: "triangle-inner-shadow" + dsf.uuid(),
    };
  },
  computed: {
    svgStyle() {
      return {
        overflow: "visible",
      };
    },
    trianglePoints() {
      const w = this.itemWidth;
      const h = this.itemWidth;
      const size = Math.min(w, h);
      const triangleHeight = (size * Math.sqrt(3)) / 2;
      const offsetX = (w - size) / 2;
      const offsetY = (h - triangleHeight) / 2;

      const points = {
        top: `${w / 2},${offsetY} ${size + offsetX},${
          triangleHeight + offsetY
        } ${offsetX},${triangleHeight + offsetY}`,
        bottom: `${offsetX},${offsetY} ${size + offsetX},${offsetY} ${w / 2},${
          triangleHeight + offsetY
        }`,
        left: `${offsetX},${h / 2} ${size + offsetX},${offsetY} ${
          size + offsetX
        },${h - offsetY}`,
        right: `${offsetX},${offsetY} ${size + offsetX},${h / 2} ${offsetX},${
          h - offsetY
        }`,
      };

      return points[this.triangleDirection] || points.top;
    },
    innerTrianglePoints() {
      const innerSize = Math.min(this.itemInnerWidth, this.itemInnerWidth);
      const innerTriangleHeight = (innerSize * Math.sqrt(3)) / 2;
      const offsetX = (this.itemWidth - innerSize) / 2;
      const offsetY = (this.itemWidth - innerTriangleHeight) / 2;

      const points = {
        top: `${this.itemWidth / 2},${offsetY} ${innerSize + offsetX},${
          innerTriangleHeight + offsetY
        } ${offsetX},${innerTriangleHeight + offsetY}`,
        bottom: `${offsetX},${offsetY} ${innerSize + offsetX},${offsetY} ${
          this.itemWidth / 2
        },${innerTriangleHeight + offsetY}`,
        left: `${offsetX},${this.itemHeight / 2} ${
          innerSize + offsetX
        },${offsetY} ${innerSize + offsetX},${this.itemHeight - offsetY}`,
        right: `${offsetX},${offsetY} ${innerSize + offsetX},${
          this.itemHeight / 2
        } ${offsetX},${this.itemHeight - offsetY}`,
      };

      return points[this.triangleDirection] || points.top;
    },
    outerTriangleStyle() {
      return {
        fill: "none",
        stroke: this.borderConfig.commonBorderColor,
        strokeWidth: this.borderConfig.commonBorderWidth,
        strokeDasharray:
          this.borderConfig.commonBorderStyle === "dashed" ? "2,2" : "none",
      };
    },
    innerTriangleStyle() {
      const style = {
        fill: this.itemInnerColor,
        filter: `url(#${this.innerTriangleId})`,
      };

      if (this.animationConfig.flag) {
        Object.assign(style, {
          animation: `ripple ${this.animationConfig.duration}s ${
            this.animationConfig.isCycle ? "infinite" : "1"
          }`,
        });
      }
      return style;
    },
    outerShadowAttr() {
      return this.analyze(this.outerShadowConfig.boxShadow);
    },
    innerShadowAttr() {
      return this.analyze(this.innerShadowConfig.boxShadow);
    },
  },
  methods: {
    analyze(shadowConfig) {
      const reg = /(\d+(?:px)?)\s+(\d+(?:px)?)\s+(\d+(?:px)?)\s+(\d+(?:px)?)\s+(#.{3,6}|rgb[a]?\(.+\))/g;
      let res = reg.exec(shadowConfig);
      let obj = {
        dx: 0,
        dy: 0,
        stdDeviation: 0,
        color: "#fff",
        opacity: 1,
      };
      if (res && res.length) {
        let color = res[5] || "rgba(255,255,255,0)";
        let opacity = threeTool.getColorOpacity(color);
        let newColor = threeTool.changeColorType(color, "sixteen");
        obj = {
          dx: parseInt(res[1]),
          dy: parseInt(res[2]),
          stdDeviation: parseInt(res[3]),
          color: newColor,
          opacity,
        };
      }
      return obj;
    },
  },
};
</script>
