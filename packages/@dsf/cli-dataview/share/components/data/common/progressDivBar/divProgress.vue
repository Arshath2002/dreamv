<!--
 * @Description: div进度条
 * @Author: shenah
 * @Date: 2024-09-12 19:32:13
 * @LastEditors: shenah
 * @LastEditTime: 2024-11-11 15:05:32
-->

<template>
  <div
    class="div-progress"
    :style="divProgressStyle"
  >
    <div
      class="percent-wrap"
      :style="percentWrapStyle"
    >
      <div
        class="outer-percent"
        :style="outerPercentStyle"
        v-if="currentBaseProgressConfig.flag"
      ></div>
      <div
        class="inner-percent"
        :style="innerPercentStyle"
        :class="{
          animationWidth:controlAnimation&&currentAnimationConfig.flag
        }"
      ></div>
      <!-- 竖线 -->
      <div
        class="progress-common-effect line"
        :style="shuLineStyle"
        :class="{
          animationLeft:controlAnimation&&currentAnimationConfig.flag
        }"
        v-if="currentEffectConfig.type === 'line'"
      ></div>
      <!-- 光点 -->
      <div
        class="progress-common-effect point"
        :style="pointStyle"
        :class="{
          animationLeft:controlAnimation&&currentAnimationConfig.flag,
        }"
        v-else-if="currentEffectConfig.type === 'point'"
      >
        <div
          class="point-inner"
          :style="pointInnerStyle"
          :class="{
            'breathe-effect':currentEffectConfig.point.isBreathe
          }"
        ></div>
      </div>

    </div>
  </div>
</template>
<script>
import commonMixin from "./mixin.js"
export default {
  name: "DivProgress",
  mixins: [commonMixin],
  props: {
    currentEffectConfig: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      controlAnimation: true, // 数值改变后动画重置
    };
  },
  watch: {
    formatVal() {
      this.changeAnimationFlag();
    },
    currentAnimationConfig() {
      this.changeAnimationFlag();
    }
  },
  computed: {
    divProgressStyle() {
      let style = {};
      let borderConfig = this.currentBorderConfig;
      let borderWidth = borderConfig.width;
      let borderStyle = borderConfig.type;
      let radius = borderConfig.radius;
      let color = borderConfig.color;
      if (borderConfig.flag) {
        style = {
          padding: dsf.dataview.utils.transformPx(borderConfig.gap),
          borderWidth: dsf.dataview.utils.transformPx(borderWidth),
          borderStyle,
          borderColor: color,
          borderRadius: dsf.dataview.utils.transformPx(radius)
        }
      }
      return style;
    },
    percentWrapStyle() {
      let style = {
        height: dsf.dataview.utils.transformPx(this.currentProgressConfig.height),
      }
      return style;
    },
    outerPercentStyle() {
      let style = {
        backgroundColor: this.currentBaseProgressConfig.color,
        borderRadius: this.currentBorderConfig.flag ? 0 : dsf.dataview.utils.transformPx(this.currentBorderConfig.radius)
      }
      return style
    },
    innerPercentStyle() {
      let percent = this.formatVal + "%";
      let color = this.currentProgressConfig.color;
      let style = {
        width: percent,
        "--inner-width": percent,
        "--animation-duration": this.currentAnimationConfig.duration + "s",
        borderRadius: this.currentBorderConfig.flag ? 0 : dsf.dataview.utils.transformPx(this.currentBorderConfig.radius)
      }
      if (color.includes("gradient")) {
        style["background-image"] = color;
      } else {
        style["background-color"] = color;
      }
      return style;
    },
    shuLineStyle() {
      let diffWidth = 6;
      let width = this.currentEffectConfig.vLine.width;
      let left = `calc(${this.formatVal}% - ${dsf.dataview.utils.transformPx(width / 2)})`;
      if (this.formatVal * 1 == 100) {
        left = `calc(${this.formatVal}% - ${dsf.dataview.utils.transformPx(width)})`;
      }
      let style = {
        backgroundColor: this.currentEffectConfig.vLine.color,
        width: dsf.dataview.utils.transformPx(width),
        height: dsf.dataview.utils.transformPx(this.currentProgressConfig.height + diffWidth),
        left,
        "--shu-left": left,
        "--animation-duration": this.currentAnimationConfig.duration + "s",
        marginTop: dsf.dataview.utils.transformPx(-diffWidth / 2)
      };
      return style
    },
    pointStyle() {
      let diffWidth = 10;
      let width = this.currentProgressConfig.height + diffWidth;
      let left = `calc(${this.formatVal}% - ${dsf.dataview.utils.transformPx(width / 2)})`
      let style = {
        backgroundColor: this.currentEffectConfig.point.baseColor,
        width: dsf.dataview.utils.transformPx(width),
        height: dsf.dataview.utils.transformPx(width),
        left,
        "--shu-left": left,
        "--animation-duration": this.currentAnimationConfig.duration + "s",
      };
      return style
    },
    pointInnerStyle() {
      let width = this.currentProgressConfig.height + 4;
      let style = {
        backgroundColor: this.currentEffectConfig.point.color,
        width: dsf.dataview.utils.transformPx(width),
        height: dsf.dataview.utils.transformPx(width),
      }
      return style;
    },
  },
  created() { },
  mounted() { },
  methods: {
    changeAnimationFlag() {
      this.controlAnimation = false;
      setTimeout(() => {
        this.controlAnimation = true;
      })
    },
  },
};
</script>
<style lang="scss"></style>
