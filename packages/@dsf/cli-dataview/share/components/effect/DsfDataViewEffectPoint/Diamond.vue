<!--
 * @Description: 生成菱形
 * @Author: shenah
 * @Date: 2024-12-16 10:59:50
 * @LastEditors: shenah
 * @LastEditTime: 2024-12-16 14:03:44
-->
<template>
  <div class="diamond-container">
    <!-- 外层菱形 -->
    <div class="diamond-outer" :style="outerDiamondStyle">
      <!-- 内层菱形 -->
      <div class="diamond-inner" :style="innerDiamondStyle"></div>
    </div>
  </div>
</template>

<script>
import commonMixin from "./mixins.js";
export default {
  name: "Diamond",
  mixins: [commonMixin],
  props: {
  },
  computed: {
    outerDiamondStyle() {
      return {
        width: dsf.dataview.utils.transformPx(this.itemWidth),
        height: dsf.dataview.utils.transformPx(this.itemWidth), // 使用相同的宽度确保是正菱形
        border: this.borderConfig.border,
        boxShadow: this.outerShadowConfig.flag
          ? this.outerShadowConfig.boxShadow
          : "none",
      };
    },
    innerDiamondStyle() {
      const style = {
        width: dsf.dataview.utils.transformPx(this.itemInnerWidth),
        height: dsf.dataview.utils.transformPx(this.itemInnerWidth), // 使用相同的宽度确保是正菱形
        backgroundColor: this.itemInnerColor,
        boxShadow: this.innerShadowConfig.flag
          ? this.innerShadowConfig.boxShadow
          : "none",
      };
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
};
</script>
