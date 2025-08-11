<!--
 * @Description: 动效光点
 * @Author: shenah
 * @Date: 2024-12-09 09:01:07
 * @LastEditors: shenah
 * @LastEditTime: 2024-12-16 14:08:08
-->

<template>
  <div
    class="dsf-effect-point-wrap data-view-item-wrap ds-control data-view-no-padding"
    :style="effectPatternWrapStyle"
  >
    <div class="effect-point data-view-common-bg-effect">
      <!-- 生成圆形与矩形 -->
      <RectShape
        v-if="['circle', 'rect'].indexOf(shape) > -1"
        :itemWidth="itemWidth"
        :itemHeight="itemHeight"
        :itemInnerWidth="itemInnerWidth"
        :itemInnerHeight="itemInnerWidth"
        :itemInnerColor="itemInnerColor"
        :triangleDirection="triangleDirection"
        :borderConfig="borderConfig"
        :animationConfig="animationConfig"
        :outerShadowConfig="outerShadowConfig"
        :innerShadowConfig="innerShadowConfig"
        :shape="shape"
      />
      <!-- 生成三角形 -->
      <Triangle
        v-else-if="shape === 'triangle'"
        :itemWidth="itemWidth"
        :itemHeight="itemWidth"
        :itemInnerWidth="itemInnerWidth"
        :itemInnerHeight="itemInnerWidth"
        :itemInnerColor="itemInnerColor"
        :triangleDirection="triangleDirection"
        :borderConfig="borderConfig"
        :animationConfig="animationConfig"
        :outerShadowConfig="outerShadowConfig"
        :innerShadowConfig="innerShadowConfig"
        :shape="shape"
      />
      <!-- 生成菱形 -->
      <Diamond
        v-else-if="shape === 'diamond'"
        :itemWidth="itemWidth"
        :itemHeight="itemHeight"
        :itemInnerWidth="itemInnerWidth"
        :itemInnerHeight="itemInnerHeight"
        :itemInnerColor="itemInnerColor"
        :borderConfig="borderConfig"
        :animationConfig="animationConfig"
        :outerShadowConfig="outerShadowConfig"
        :innerShadowConfig="innerShadowConfig"
        :shape="shape"
      />
    </div>
  </div>
</template>

<script>
import RectShape from "./RectShape.vue";
import Triangle from "./Triangle.vue";
import Diamond from "./Diamond.vue";
export default dsf.component({
  name: "DsfDataViewEffectPoint",
  ctrlCaption: "动效光点",
  mixins: [$mixins.dataView],
  components: { Triangle, Diamond, RectShape },
  props: {
    animationConfig: {
      type: Object,
      default: () => ({
        flag: true,
        duration: 3, // 持续时间
        isCycle: true, // 是否循环
      }),
    },
    // 背景图片
    backgroundConfig: {
      type: Object,
      default: () => ({}),
    },
    fakeSelect: {
      type: String,
      default: "outer",
    },
    // 外层形状的大小
    itemWidth: {
      type: Number,
      default: 30,
    },
    // 内层形状的大小
    itemHeight: {
      type: Number,
      default: 30,
    },
    itemInnerWidth: {
      type: Number,
      default: 10,
    },
    itemInnerHeight: {
      type: Number,
      default: 10,
    },
    itemInnerColor: {
      type: String,
      default: "#00D3FF",
    },
    shape: {
      type: String,
      default: "circle",
    },
    triangleDirection: {
      type: String,
      default: "top",
    },
    borderConfig: {
      type: Object,
      default: () => ({
        border: "2px solid rgba(0,211,255,0.5)",
        commonBorderWidth: 1,
        commonBorderColor: "rgba(0,211,255,0.5)",
        commonBorderStyle: "solid",
      }),
    },
    outerShadowConfig: {
      type: Object,
      default: () => ({
        flag: true,
        boxShadow: "0px 0px 8px 2px rgba(0,127,255,0.75)",
      }),
    },
    innerShadowConfig: {
      type: Object,
      default: () => ({
        flag: true,
        boxShadow: "0px 0px 8px 2px rgba(0,127,255,0.75)",
      }),
    },
  },
  computed: {
    effectPatternWrapStyle() {
      let style = {
        ...this.controlStyle,
        ...this.dvBackgroundFormat(this.backgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
      return style;
    },
  },
  data() {
    return {};
  },
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
   
  },
});
</script>

<style lang="scss">
@import "_dataview/assets/styles/share/components/effectPoint.scss";
</style>
