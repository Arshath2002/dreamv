<!--
 * @Author: RONGWEI PENG
 * @Date: 2022-09-01 16:04:44
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-06 09:00:15
 * @FilePath: \dsf-product-dataview\packages\@dsf\cli-dataview\pc\components\decorate\decorateSix.vue
-->
<template>
  <div
    class="dsf_decorate_five dsf-decorate data-view-item-wrap ds-control data-view-no-padding"
    :style="controlHeight"
  >
    <div class="svgboxs" :ref="ref" :style="controlStyle">
      <svg
        :width="realWidth"
        :height="realHeight"
        :style="`transform:scale(${svgScale[0]},${svgScale[1]});`"
      >
        <template v-for="(point, i) in points">
          <rect
            :key="i"
            :fill="mergedColor[Math.random() > 0.5 ? 0 : 1]"
            :x="point[0] - halfRectWidth"
            :y="point[1] - heights[i] / 2"
            :width="rectWidth"
            :height="heights[i] * 10"
          >
            <animate
              attributeName="y"
              :values="`${point[1] - minHeights[i] / 2};${
                point[1] - heights[i] / 2
              };${point[1] - minHeights[i] / 2}`"
              :dur="`${randoms[i]}s`"
              keyTimes="0;0.5;1"
              calcMode="spline"
              keySplines="0.42,0,0.58,1;0.42,0,0.58,1"
              begin="0s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="height"
              :values="`${minHeights[i]};${heights[i]};${minHeights[i]}`"
              :dur="`${randoms[i]}s`"
              keyTimes="0;0.5;1"
              calcMode="spline"
              keySplines="0.42,0,0.58,1;0.42,0,0.58,1"
              begin="0s"
              repeatCount="indefinite"
            />
          </rect>
        </template>
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
function randomExtend(minNum, maxNum) {
  if (arguments.length === 1) {
    return parseInt(Math.random() * minNum + 1, 10);
  } else {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
  }
}
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewDecorateSix",
  ctrlCaption: "装饰6",
  mixins: [$mixins.dataView, border],
  props: {
    rectWidth: {
      type: Number,
      default: 1,
    },
    rowPoints: {
      type: Number,
      default: 10,
    },
    dur: {
      type: Number,
      default: 6,
    },
    comType: {
      type: String,
      default: "dsf.dataviewdecoratesix",
    },
  },
  data() {
    return {
      ref: "decoration-6",
      svgWH: [300, 35],
      svgScale: [1, 1],
      rowNum: 1,
      halfRectWidth: 0,
      points: [],
      heights: [],
      minHeights: [],
      randoms: [],
      mergedColor: [],
    };
  },
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
    rectWidth() {
      this.init();
    },
    rowPoints() {
      this.init();
    },
  },
  methods: {
    afterAutoResizeMixinInit() {
      const { calcSVGData } = this;

      calcSVGData();
    },
    calcSVGData() {
      const { calcPointsPosition, calcScale } = this;

      calcPointsPosition();

      calcScale();
    },
    calcPointsPosition() {
      const { svgWH, rowNum, rowPoints } = this;

      const [w, h] = svgWH;

      const horizontalGap = w / (rowPoints + 1);
      const verticalGap = h / (rowNum + 1);

      let points = new Array(rowNum)
        .fill(0)
        .map((foo, i) =>
          new Array(rowPoints)
            .fill(0)
            .map((foo, j) => [horizontalGap * (j + 1), verticalGap * (i + 1)])
        );

      this.points = points.reduce((all, item) => [...all, ...item], []);
      const heights = (this.heights = new Array(rowNum * rowPoints)
        .fill(0)
        .map((foo) =>
          Math.random() > 0.8
            ? randomExtend(0.7 * h, h)
            : randomExtend(0.2 * h, 0.5 * h)
        ));

      this.minHeights = new Array(rowNum * rowPoints)
        .fill(0)
        .map((foo, i) => heights[i] * Math.random());

      this.randoms = new Array(rowNum * rowPoints)
        .fill(0)
        .map((foo) => Math.random() + 1.5);
    },
    calcScale() {
      const { realWidthL: width, realHeight: height, svgWH } = this;

      const [w, h] = svgWH;

      this.svgScale = [width / w, height / h];
    },
    onResize() {
      this.init();
    },
    init() {
      const { mainColor, viceColor, calcSVGData } = this;
      this.mergedColor = [mainColor, viceColor];
      this.$nextTick(() => {
        let w = this.realWidth;
        let h = this.realHeight;

        this.svgWH = [w, h];

        calcSVGData();
      });
    },
  },
  mounted() {
    this.halfRectWidth = this.rectWidth / 2;
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>
