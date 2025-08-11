<!--
 * @Description: 生成矩形与圆形
 * @Author: shenah
 * @Date: 2024-12-16 13:56:59
 * @LastEditors: shenah
 * @LastEditTime: 2024-12-16 14:13:24
-->

<template>
  <div class="effect-point-inner" :style="effectPatternInnerStyle">
    <div class="center-shape" :style="effectShapeStyle"></div>
  </div>
</template>

<script>
import commonMixin from "./mixins.js";
export default {
  name: "RectShape",
  mixins: [commonMixin],
  props: {
  },
  data(){
    return {}
  },
  computed: {
    effectPatternInnerStyle() {
      const width = this.itemWidth;
      const height = this.shape === "circle" ? this.itemWidth : this.itemHeight;
      const style = this.getBaseRectCircleStyle(
        width,
        height,
        this.outerShadowConfig,
        this.borderConfig,
      );
      if (this.shape === "circle") {
        Object.assign(style, {
          borderRadius: "50%",
        });
      }
      return style;
    },
    effectShapeStyle() {
      const width = this.itemInnerWidth;
      const height =
        this.shape === "circle" ? this.itemInnerWidth : this.itemInnerHeight;
      const style = {
        ...this.getBaseRectCircleStyle(width, height, this.innerShadowConfig),
        backgroundColor: this.itemInnerColor,
      };
      if (this.shape === "circle") {
        style.borderRadius = "50%";
      }
      if (this.animationConfig.flag) {
        Object.assign(style, {
          "animation-duration": `${this.animationConfig.duration}s`,
          "animation-name": "ripple",
          "animation-iteration-count": this.animationConfig.isCycle
            ? "infinite"
            : "1",
        });
      }
      return style;
    },
  },
  methods:{
    getBaseRectCircleStyle(width, height, shadowConfig,borderConfig) {
      return {
        width: dsf.dataview.utils.transformPx(width),
        height: dsf.dataview.utils.transformPx(height),
        boxShadow: shadowConfig.flag ? shadowConfig.boxShadow : "none",
        ...borderConfig,
      };
    },
  },
};
</script>
