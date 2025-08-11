<template>
  <div class="dsf_decorate_decorateNine dsf-decorate data-view-item-wrap ds-control data-view-no-padding" :style="controlHeight">

    <div class="svgboxs" :ref="ref" :style="controlStyle">
      <svg :width="size" :height="size">
        <defs>
          <polygon
            :id="polygonId"
            :points="`${(size / 100) * 15}, ${(size / 100) * 46.5}, ${(size / 100) * 21}, ${(size / 100) * 47.5}, ${(size / 100) * 21},${(size / 100) * 52.5}, ${(size / 100) * 15}, ${
              (size / 100) * 53.5
            }`"
          />
        </defs>
        <!-- 间断圆形1 -->
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="(size / 20) * 9"
          fill="transparent"
          :stroke="viceColor"
          stroke-width="10"
          :stroke-dasharray="`${(size / 20) * 16}, ${size}, ${(size / 20) * 6}, ${size}`"
        >
          <animateTransform attributeName="transform" type="rotate" :values="`0 ${size / 2} ${size / 2};360 ${size / 2} ${size / 2}`" :dur="`${dur}s`" repeatCount="indefinite" />
        </circle>
        <!-- 间断圆形2 -->
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="(size / 20) * 9"
          fill="transparent"
          :stroke="mainColor"
          stroke-width="6"
          :stroke-dasharray="`${size / 2}, ${(size / 100) * 66}, ${size}, ${(size / 100) * 66}`"
        >
          <animateTransform attributeName="transform" type="rotate" :values="`0 ${size / 2} ${size / 2};-360 ${size / 2} ${size / 2}`" :dur="`${dur}s`" repeatCount="indefinite" />
        </circle>
        <!-- 大圆形点划线 -->
        <circle :cx="size / 2" :cy="size / 2" :r="(size / 100) * 38" fill="transparent" :stroke="fade(viceColor, 30)" stroke-width="1" stroke-dasharray="5, 1" />

        <!-- 生成棱形旋转 -->
        <use v-for="(foo, i) in new Array(20).fill(0)" :key="i" :xlink:href="`#${polygonId}`" :stroke="viceColor" :fill="Math.random() > 0.4 ? 'transparent' : mainColor">
          <animateTransform
            attributeName="transform"
            type="rotate"
            :values="`0 ${size / 2} ${size / 2};360 ${size / 2} ${size / 2}`"
            :dur="`${dur}s`"
            :begin="`${(i * dur) / 20}s`"
            repeatCount="indefinite"
          />
        </use>

        <!-- 小圆形点划线 -->
        <circle :cx="size / 2" :cy="size / 2" :r="(size / 100) * 26" fill="transparent" :stroke="fade(viceColor, 30)" stroke-width="1" stroke-dasharray="5, 1" />
      </svg>
    </div>
    <div class="decorate-slot-content" :style="controlInnerStyle" slot-name="default">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewDecorateNine",
  ctrlCaption: "装饰9",
  mixins: [$mixins.dataView, border],
  props: {
    graphSize: {
      type: String,
      default: "100",
    },
    dur: {
      type: Number,
      default: 3,
    },
    comType: {
      type: String,
      default: "dsf.dataviewdecoratenine",
    },
  },
  data() {
    const id = dsf.uuid();
    return {
      ref: "decoration-9",
      polygonId: `decoration-9-polygon-${id}`,
      svgWH: [100, 100],
      svgScale: [1, 1],
    };
  },
  computed: {
    size() {
      let w = this.realWidth > this.realHeight ? this.realHeight : this.realWidth;
      let graphW = (w / 100) * this.graphSize;
      return graphW;
    },
    scale() {
      return this.graphScale.split(",");
    },
    $pageStyle() {
      let { margin, height } = this;
      if (this.isDesign) {
        return {
          margin: margin.join("px ") + "px",
        };
      }
      return {
        height,
        margin: margin.join("px ") + "px",
      };
    },
  },
  watch: {},
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>
