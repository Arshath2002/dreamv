<!--
 * @Editor: zhanghang
 * @Description: 流程图
 * @Date: 2024-11-22 11:25:17
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-22 17:20:59
-->
<template>
  <div class="data-view-item-wrap dsf-dv-flow-line data-view-no-padding" :style="controlHeight">
    <div class="data-view-item-wrap-inner-box" :ref="ref" :style="propertyStyle">
      <svg class="border" :width="realWidth" :height="realHeight">
        <template v-for="index in topQuantity">
          <polyline :key="`top_line_${index}`" :points="getTopPoints(index)" :style="lineStyle" />
          <polyline class="dashed-line" :key="`top_dashed_line_${index}`" :points="getTopPoints(index)" :style="dashedLineStyle" />
        </template>
        <polyline :points="getCenterPoints" :style="lineStyle" />
        <polyline class="dashed-line" :points="getCenterPoints" :style="dashedLineStyle" />
        <template v-for="index in bottomQuantity">
          <polyline :key="`bottom_line_${index}`" :points="getBottomPoints(index)" :style="lineStyle" />
          <polyline class="dashed-line" :key="`bottom_dashed_line_${index}`" :points="getBottomPoints(index)" :style="dashedLineStyle" />
        </template>
      </svg>
    </div>
  </div>
</template>
<script>
import svg from "_dataview/mixins/svg.js";
export default dsf.component({
  name: "DsfDataViewFlowLine",
  ctrlCaption: "流程线",
  mixins: [$mixins.dataView, svg],
  props: {
    // 上部流程线数量
    topQuantity: {
      type: Number,
      default: 2,
    },
    // 下部流程线数量
    bottomQuantity: {
      type: Number,
      default: 2,
    },
    // 子节点的长度--百分比
    childrenLength: {
      type: Number,
      default: 50,
    },
    // 是否反向
    reverse: {
      type: Boolean,
      default: false,
    },
    // 流线长度
    flowLength: {
      type: Number,
      default: 20,
    },
    // 间隔长度
    dashedLength: {
      type: Number,
      default: 130,
    },
    // 动画时间
    duration: {
      type: Number,
      default: 3,
    },
    // 流动颜色
    dashedLineColor: {
      type: String,
      default: "#3788ea",
    },
    // 背景颜色
    lineColor: {
      type: String,
      default: "#303a4c",
    },
    // 折线粗细
    strokeWidth: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    controlHeight() {
      let enterAnimateStyle = this.getCommonEnterAnimateStyle;
      let style = {
        ...enterAnimateStyle,
      };
      let { height } = this;
      if (!this.isDesign) {
        style.height = height;
      }
      return style;
    },
    propertyStyle() {
      const { flowLength, dashedLength, duration, controlStyle } = this;
      return {
        ...controlStyle,
        "--duration": `${duration}s`,
        "--stroke-dashoffset": flowLength,
        "--stroke-dashoffset--end": -dashedLength,
      };
    },
    getCenterPoints() {
      const { topQuantity, avgHeight, drawWidth, reverse } = this;
      if (!reverse) {
        const horizonY = avgHeight * topQuantity;
        const p0 = `0, ${horizonY} `;
        const p1 = `${drawWidth}, ${horizonY} `;
        return p0 + p1;
      } else {
        const horizonY = avgHeight * topQuantity;
        const p0 = `${drawWidth}, ${horizonY} `;
        const p1 = `0, ${horizonY} `;
        return p0 + p1;
      }
    },
    avgHeight() {
      const { drawHeight, topQuantity, bottomQuantity } = this;
      return drawHeight / (topQuantity + bottomQuantity);
    },
    drawWidth() {
      return this.realWidth;
    },
    drawHeight() {
      const { realHeight, strokeWidth } = this;
      return realHeight - 2 * strokeWidth;
    },
    lineStyle() {
      const { lineColor, strokeWidth } = this;
      return {
        fill: "none",
        stroke: lineColor,
        strokeWidth,
      };
    },
    dashedLineStyle() {
      const { dashedLineColor, strokeWidth, flowLength, dashedLength } = this;
      return { fill: "none", stroke: dashedLineColor, strokeWidth, strokeDasharray: `${flowLength} ${dashedLength}`, strokeDashoffset: 0 };
    },
  },
  data() {
    return {
      ref: "container",
    };
  },

  methods: {
    /**
     * 上部线条路径
     * @param {Number} index 下标
     */
    getTopPoints(index) {
      const { topQuantity, avgHeight, childrenLength, drawWidth, strokeWidth, reverse } = this;

      const y = (index - 1) * avgHeight;
      const horizonY = avgHeight * topQuantity;
      if (!reverse) {
        const x = drawWidth - drawWidth * (childrenLength / 100);
        const p0 = `0, ${horizonY} `;
        const p1 = `${x}, ${horizonY} `;
        const p2 = `${x}, ${y + strokeWidth} `;
        const p3 = `${drawWidth}, ${y + strokeWidth} `;
        return p0 + p1 + p2 + p3;
      } else {
        const x = drawWidth * (childrenLength / 100);
        const p0 = `${drawWidth}, ${horizonY} `;
        const p1 = `${x}, ${horizonY} `;
        const p2 = `${x}, ${y + strokeWidth} `;
        const p3 = `0, ${y + strokeWidth} `;
        return p0 + p1 + p2 + p3;
      }
    },
    /**
     * 下部线条路径
     * @param {Number} index 下标
     */
    getBottomPoints(index) {
      const { topQuantity, avgHeight, childrenLength, drawWidth, reverse } = this;
      const x = drawWidth - drawWidth * (childrenLength / 100);
      const y = (index + topQuantity) * avgHeight;
      const horizonY = avgHeight * topQuantity;
      if (!reverse) {
        const p0 = `0, ${horizonY} `;
        const p1 = `${x}, ${horizonY} `;
        const p2 = `${x}, ${y} `;
        const p3 = `${drawWidth}, ${y} `;
        return p0 + p1 + p2 + p3;
      } else {
        const p0 = `${drawWidth}, ${horizonY} `;
        const p1 = `${x}, ${horizonY} `;
        const p2 = `${x}, ${y} `;
        const p3 = `0, ${y} `;
        return p0 + p1 + p2 + p3;
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewFlowLine.scss";
</style>
