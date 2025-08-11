<!--
 * @Description: svg进度条
 * @Author: shenah
 * @Date: 2024-09-12 19:32:13
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-25 17:55:17
-->

<template>
  <svg
    class="svg-bar-progress"
    :style="svgBarProgressStyle"
    :key="keyId"
  >
    <defs>
      <!-- 边框渐变 -->
      <linearGradient
        :id="rectBorderGradientId"
        :x1="getGradientXY(rectBorderGradient.x)"
        :y1="getGradientXY(rectBorderGradient.y)"
        :x2="getGradientXY(rectBorderGradient.x2)"
        :y2="getGradientXY(rectBorderGradient.y2)"
      >
        <stop
          v-for="(item, index) in rectBorderGradient.colorStops"
          :key="index"
          :offset="`${item.offset * 100}%`"
          :stop-color="item.color"
        />
      </linearGradient>
      <!-- 进度条渐变色 -->
      <linearGradient
        :id="polylineProgressId"
        :x1="getGradientXY(progressGradient.x)"
        :y1="getGradientXY(progressGradient.y)"
        :x2="getGradientXY(progressGradient.x2)"
        :y2="getGradientXY(progressGradient.y2)"
      >
        <stop
          v-for="(item, index) in progressGradient.colorStops"
          :key="index"
          :offset="`${item.offset * 100}%`"
          :stop-color="item.color"
        />
      </linearGradient>
    </defs>

    <!-- 底色 -->
    <polyline
      :stroke-dasharray="currentProgressConfig.lineDash"
      :stroke-width="currentProgressConfig.height"
      :stroke="currentBaseProgressConfig.color"
      :points="polylineBasePoints"
      v-if="currentBaseProgressConfig.flag"
    ></polyline>
    <!-- 进度条色 -->
    <polyline
      :stroke-dasharray="currentProgressConfig.lineDash"
      :stroke-width="currentProgressConfig.height"
      :stroke="`url(#${polylineProgressId})`"
      :points="polylineProgressPoints"
      :id="polylineProgressElId"
    >
      <animate
        v-if="currentAnimationConfig.flag"
        attributeName="points"
        :from="polylineProgressFromPoints"
        :to="polylineProgressPoints"
        :dur="currentAnimationConfig.duration"
        fill="freeze"
      />
    </polyline>
    <!-- 边框 -->
    <rect
      :x="currentBorderConfig.width / 2"
      :y="currentBorderConfig.width / 2"
      :rx="currentBorderConfig.radius"
      :ry="currentBorderConfig.radius"
      fill="transparent"
      :stroke="`url(#${rectBorderGradientId})`"
      :stroke-width="currentBorderConfig.width"
      :width="rectWidth"
      :height="rectHeight"
      v-if="currentBorderConfig.flag"
    />
  </svg>
</template>
<script>
import commonMixin from "./mixin.js";
export default {
  name: "SvgBarProgress",
  mixins: [commonMixin],
  props: {},
  data() {
    const id = dsf.uuid(32);
    return {
      rectBorderGradientId: `rect-border-gradient-${id}`,
      polylineProgressId: `progress-gradient-${id}`,
      polylineProgressElId: `polyline-${id}`,
      clientWidth: 0,
      clientHeight: 0,
      keyId: id
    };
  },

  computed: {
    svgBarProgressStyle() {
      let overHeight = 3;
      let nowHeight = this.currentProgressConfig.height + overHeight;
      if (this.currentBorderConfig.flag) {
        nowHeight =
          nowHeight +
          this.currentBorderConfig.width * 2 +
          this.currentBorderConfig.gap * 2;
      }
      let style = {
        height: dsf.dataview.utils.transformPx(nowHeight),
      };
      return style;
    },
    rectBorderGradient() {
      return this.colorToSvgGradient(this.currentBorderConfig.color);
    },
    polylineBasePoints() {
      return this.calcPoints(100);
    },
    polylineProgressPoints() {
      return this.calcPoints(this.formatVal);
    },
    polylineProgressFromPoints() {
      return this.calcPoints(this.formatVal, true);
    },
    progressGradient() {
      return this.colorToSvgGradient(this.currentProgressConfig.color);
    },
    rectWidth() {
      return this.clientWidth ? this.clientWidth - this.currentBorderConfig.width * 2 : 0;
    },
    rectHeight() {
      return this.currentProgressConfig.height + (this.currentBorderConfig.width + this.currentBorderConfig.gap) * 2;
    },
  },
  watch: {
    currentAnimationConfig() {
      this.$nextTick(() => {
        const polyline = document.getElementById(
          `${this.polylineProgressElId}`
        );
        const animateElement = polyline.querySelector("animate");
        if (animateElement) animateElement.beginElement();
      });
    },
    "currentProgressConfig.height"() {
      this.initId();
    },
    currentBorderConfig() {
      this.initId();
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(this.initDom);
    });
  },
  methods: {
    initId() {
      this.keyId = dsf.uuid()
    },
    initDom() {
      const el = this.$el;
      this.clientWidth = el ? el.clientWidth : 0;
      this.clientHeight = el ? el.clientHeight : 0;
    },
    getGradientXY(val) {
      let nowVal = val * 100;
      nowVal = nowVal >= 0 ? `${nowVal}%` : `${100 + nowVal}%`;
      return nowVal;
    },
    colorToSvgGradient(targetColor, defaultColor) {
      let color = targetColor || defaultColor;
      let obj = dsf.dataview.utils.convertCSSToEChartsColor(color);
      if (typeof obj === "string") {
        obj = {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: color,
            },
          ],
        };
      }
      return obj;
    },
    calcPoints(percent, isFrom) {
      let borderConfig = this.currentBorderConfig;
      let borderWidth = this.currentBorderConfig.width;
      let borderGap = this.currentBorderConfig.gap;
      let width = this.clientWidth;
      if (isFrom) {
        width = 0;
      }
      let height = this.currentProgressConfig.height;
      let halfHeight = height / 2;
      if (borderConfig.flag) {
        halfHeight = borderWidth * 1.5 + borderGap + halfHeight;
        if (!isFrom) {
          width = this.rectWidth;
        }
        const polylineLength = ((width - borderWidth * 2) / 100) * percent;
        return `
        ${borderWidth * 2 + borderGap}, ${halfHeight}
        ${polylineLength + borderWidth - borderGap}, ${halfHeight + 0.001}
      `;
      }
      return `0, ${halfHeight} ${(width / 100) * percent}, ${halfHeight + 0.001}`;
    },
  },
};
</script>
<style lang="scss"></style>
