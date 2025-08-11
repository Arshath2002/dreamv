<!--
 * @Author: RONGWEI PENG
 * @Date: 2022-09-01 16:04:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2023-04-17 15:08:38
 * @FilePath: \dsf-product-dataview\packages\@dsf\cli-dataview\pc\components\decorate\decorateFour.vue
-->
<template>
  <div
    class="dsf_decorate_four dsf-decorate data-view-item-wrap ds-control data-view-no-padding"
    :style="controlHeight"
  >
    <div class="svgboxs" :ref="ref" :style="controlStyle">
      <div
        :class="`container ${reverse ? 'reverse' : 'normal'}`"
        :style="
          reverse
            ? `width:${reWidth}px;height:5px;animation-duration:${dur}s`
            : `width:5px;height:${reHeight}px;animation-duration:${dur}s`
        "
      >
        <svg :width="reverse ? '100%' : 5" :height="reverse ? 5 : '100%'">
          <polyline
            :stroke="mergedColor[0]"
            :points="
              reverse ? `0, 2.5 ${reWidth}, 2.5` : `2.5, 0 2.5, ${reHeight}`
            "
          />
          <polyline
            class="bold-line"
            :stroke="mergedColor[1]"
            stroke-width="3"
            stroke-dasharray="20, 80"
            stroke-dashoffset="-30"
            :points="
              reverse ? `0, 2.5 ${reWidth}, 2.5` : `2.5, 0 2.5, ${reHeight}`
            "
          />
        </svg>
      </div>
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
  name: "DsfDataViewDecorateFour",
  ctrlCaption: "装饰4",
  mixins: [$mixins.dataView, border],
  props: {
    reverse: {
      type: Boolean,
      default: false,
    },
    reWidth: {
      type: Number,
      default: 300,
    },
    reHeight: {
      type: Number,
      default: 300,
    },
    dur: {
      type: Number,
      default: 6,
    },
    comType: {
      type: String,
      default: "dsf.dataviewdecoratefour",
    },
  },
  data() {
    return {
      ref: "decoration-4",

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

    },
  },
  methods: {
    onResize() {
      this.init();
    },
    init() {
      const { mainColor, viceColor } = this;
      this.mergedColor = [mainColor, viceColor];
      this.$nextTick(() => {
        let w = this.realWidth;
        let h = this.realHeight;

        this.x = w / 2;
        this.y = h / 2;
      });
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>
