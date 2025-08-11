<!--
 * @Author: RONGWEI PENG
 * @Date: 2022-09-01 16:04:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-04-25 13:48:57
 * @FilePath: \dsf-product-dataview\packages\@dsf\cli-dataview\pc\components\decorate\decorateTwo.vue
-->
<template>
  <div
    class="dsf_decorate_two dsf-decorate ds-control data-view-item-wrap  data-view-no-padding"
    :style="controlHeight"
  >
    <div class="svgboxs" :ref="ref" :style="controlStyle">
      <svg :width="realWidth" :height="realHeight">
        <rect :x="x" :y="y" :width="w" :height="h" :fill="mergedColor[0]">
          <animate
            :attributeName="reverse ? 'realHeight' : 'width'"
            from="0"
            :to="reverse ? svgHeight : width"
            :dur="`${dur}s`"
            calcMode="spline"
            keyTimes="0;1"
            keySplines=".42,0,.58,1"
            repeatCount="indefinite"
          />
        </rect>
        <rect :x="x" :y="y" width="1" height="1" :fill="mergedColor[1]">
          <animate
            :attributeName="reverse ? 'y' : 'x'"
            from="0"
            :to="reverse ? svgHeight : width"
            :dur="`${dur}s`"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.42,0,0.58,1"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
    <div
      class="decorate-slot-content"
      :style="controlInnerStyle"
      slot-name="default"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script>
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewDecorateTwo",
  ctrlCaption: "装饰2",
  mixins: [$mixins.dataView, border],
  props: {
    svgHeight: {
      type: Number,
      default: 100,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
    dur: {
      type: Number,
      default: 6,
    },
    comType: {
      type: String,
      default: "dsf.dataviewdecoratetwo",
    },
  },
  data() {
    return {
      ref: "decoration-2",
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      mergedColor: [],
    };
  },
  computed: {},
  watch: {
    mainColor(v) {
      this.mergedColor[0] = v;
    },
    viceColor(v) {
      this.mergedColor[1] = v;
    },
    dur(v) {
      this.dur = v;
      this.init();
    },
    reverse() {
      const { calcSVGData } = this;
      calcSVGData();
    },
  },
  methods: {
    init() {
      const { mainColor, viceColor } = this;
      let h = this.realHeight;
      this.y = h / 2;
      this.mergedColor = [mainColor, viceColor];
    },
    afterAutoResizeMixinInit() {
      const { calcSVGData } = this;
      calcSVGData();
    },
    calcSVGData() {
      const { reverse, realWidth: width, svgHeight } = this;
      if (reverse) {
        this.w = 1;
        this.h = svgHeight;
        this.x = width / 2;
        this.y = 0;
      } else {
        this.w = width;
        this.h = 1;
        this.x = 0;
        this.y = svgHeight / 2;
      }
    },
    onResize() {
      const { calcSVGData } = this;
      calcSVGData();
      this.init();
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>
