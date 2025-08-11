<!--
 * @Description: 公用进度条
 * @Author: shenah
 * @Date: 2024-09-12 19:32:13
 * @LastEditors: shenah
 * @LastEditTime: 2024-11-11 13:55:59
-->


<template>
  <div
    class="dv-general-bar-progress"
    :style="dvGeneralBarProgressStyle"
  >
    <DivProgress
      v-if="type === 'general'"
      :currentBorderConfig="currentBorderConfig"
      :currentBaseProgressConfig="currentBaseProgressConfig"
      :currentProgressConfig="currentProgressConfig"
      :currentAnimationConfig="currentAnimationConfig"
      :formatVal="formatVal"
      :currentEffectConfig="currentEffectConfig"
    >
    </DivProgress>
    <SvgBarProgress
      v-else-if="type === 'bar'"
      :currentBorderConfig="currentBorderConfig"
      :currentBaseProgressConfig="currentBaseProgressConfig"
      :currentProgressConfig="currentProgressConfig"
      :currentAnimationConfig="currentAnimationConfig"
      :formatVal="formatVal"
    >
    </SvgBarProgress>
  </div>
</template>
<script>
import DivProgress from "./divProgress.vue";
import SvgBarProgress from "./svgBarProgress.vue";
export default {
  name: "ProgressDivBar",
  components: {
    DivProgress,
    SvgBarProgress
  },
  props: {
    type: {
      type: String,
      default: "general", //1.general普通2.bar条形
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    borderConfig: {
      type: Object,
      default: () => ({
        flag: false,
        width: 1,
        type: "solid", // 1.目前支持实线与虚线
        color: "rgba(72,124,194,1)", // 不支持渐变
        radius: 0, // 支持渐变与普通
        gap: 0,
      })
    },
    baseProgressConfig: {
      type: Object,
      default: () => ({
        flag: true,
        color: "rgba(255,255,255,0.2)"
      })
    },
    progressConfig: {
      type: Object,
      default: () => ({
        height: 3,
        lineDash: [5, 1],
        color: "linear-gradient(270deg, #E24A3B 0%, rgba(226,74,59,0.00) 100%)", // 颜色
      })
    },
    effectConfig: {
      type: Object,
      default: () => ({
        type: "no", // line、point
        vLine: {
          width: 2,
          color: "#fff"
        },
        point: {
          isBreathe: false,
          color: "rgba(226,74,59,1)",
          baseColor: "rgba(226,74,59,0.3)",
        },
      })
    },
    animationConfig: {
      type: Object,
      default: () => ({
        flag: true,
        duration: 3, // 时间为秒
      })
    },
    value: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      defaultBorderConfig: {
        flag: false, // 是否显示
        width: 1, // 边框的宽度
        type: "solid", // 1.目前支持实线与虚线
        color: "rgba(72,124,194,1)", // 支持渐变与普通
        radius: 0, // 圆角
        gap: 0, // 间隙
      },
      defaultBaseProgressConfig: {
        flag: true,
        color: "rgba(255,255,255,0.2)"
      },
      defaultProgressConfig: {
        height: 3,
        lineDash: [5, 1],
        color: "linear-gradient(270deg, #E24A3B 0%, rgba(226,74,59,0.00) 100%)", // 颜色
      },
      defaultEffectConfig: {
        type: "no", // line、point
        vLine: {
          width: 2,
          color: "#fff"
        },
        point: {
          isBreathe: false,
          color: "rgba(226,74,59,1)",
          baseColor: "rgba(226,74,59,0.3)",
        },
      },
      defaultAnimationConfig: {
        flag: true,
        duration: 3, // 时间为秒
      },
    };
  },
  computed: {
    formatVal() {
      let val = this.value * 1 || 0;
      if (val > 100) {
        val = 100;
      }
      return val;
    },
    currentBorderConfig() {
      return dsf.mix(true, {}, this.defaultBorderConfig, this.borderConfig);
    },
    currentBaseProgressConfig() {
      return dsf.mix(true, {}, this.defaultBaseProgressConfig, this.baseProgressConfig);
    },
    currentProgressConfig() {
      return dsf.mix(true, {}, this.defaultProgressConfig, this.progressConfig);
    },
    currentEffectConfig() {
      return dsf.mix(true, {}, this.defaultEffectConfig, this.effectConfig);
    },
    currentAnimationConfig() {
      return dsf.mix(true, {}, this.defaultAnimationConfig, this.animationConfig);
    },
    dvGeneralBarProgressStyle() {
      let style = {
        width: dsf.dataview.utils.transformPx(this.width),
        height: dsf.dataview.utils.transformPx(this.height)
      };
      return style;
    },
  },
  created() {
  },
  mounted() {

  },
  methods: {

  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/progressDivBar.scss";
</style>
