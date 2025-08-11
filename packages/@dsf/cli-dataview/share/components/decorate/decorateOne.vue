<template>
  <div
    class="dsf_decorate_one dsf-decorate data-view-item-wrap ds-control data-view-no-padding"
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
            v-if="Math.random() > 0.6"
            :key="i"
            :fill="mergedColor[0]"
            :x="point[0] - halfPointSideLength"
            :y="point[1] - halfPointSideLength"
            :width="pointSideLength"
            :height="pointSideLength"
          >
            <animate
              v-if="Math.random() > 0.6"
              attributeName="fill"
              :values="`${mergedColor[0]};transparent`"
              dur="1s"
              :begin="Math.random() * 2"
              repeatCount="indefinite"
            />
          </rect>
        </template>

        <rect
          v-if="rects[0]"
          :fill="mergedColor[1]"
          :x="rects[0][0] - pointSideLength"
          :y="rects[0][1] - pointSideLength"
          :width="pointSideLength * 2"
          :height="pointSideLength * 2"
        >
          <animate
            attributeName="width"
            :values="`0;${pointSideLength * 2}`"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="height"
            :values="`0;${pointSideLength * 2}`"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x"
            :values="`${rects[0][0]};${rects[0][0] - pointSideLength}`"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            :values="`${rects[0][1]};${rects[0][1] - pointSideLength}`"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>

        <rect
          v-if="rects[1]"
          :fill="mergedColor[1]"
          :x="rects[1][0] - 40"
          :y="rects[1][1] - pointSideLength"
          :width="40"
          :height="pointSideLength * 2"
        >
          <animate
            attributeName="width"
            values="0;40;0"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x"
            :values="`${rects[1][0]};${rects[1][0] - 40};${rects[1][0]}`"
            dur="2s"
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
  name: "DsfDataViewDecorateOne",
  ctrlCaption: "装饰1",
  mixins: [$mixins.dataView, border],
  props: {
    comType: {
      type: String,
      default: "dsf.dataviewdecorateone",
    },
    rowNum: {
      type: Number,
      default: 6,
    },
    rowPoints: {
      type: Number,
      default: 50,
    },
  },
  computed: {

  },
  data() {
    const pointSideLength = 5;
    return {
      ref: "decoration-1",
      svgWH: [200, 100],
      svgScale: [1, 1],
      pointSideLength,
      halfPointSideLength: pointSideLength / 2,
      points: [],
      rects: [],
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
    rowNum(v) {
      this.rowNum = v;
      this.init();
    },
    rowPoints(v) {
      this.rowPoints = v;
      this.init();
    },
  },
  methods: {
    init() {
      const { afterAutoResizeMixinInit, mainColor, viceColor } = this;
      this.mergedColor = [mainColor, viceColor];
      this.$nextTick(() => {
        let w = this.realWidth;
        let h = this.realHeight;
        
        this.x = w / 2;
        this.y = h / 2;
        this.svgWH = [w, h];
        afterAutoResizeMixinInit();
      });
    },

    afterAutoResizeMixinInit() {
      const { calcSVGData } = this;

      calcSVGData();
    },
    calcSVGData() {
      const { calcPointsPosition, calcRectsPosition, calcScale } = this;

      calcPointsPosition();

      calcRectsPosition();

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
    },
    calcRectsPosition() {
      const { points, rowPoints } = this;

      const rect1 = points[rowPoints * 2 - 1];
      const rect2 = points[rowPoints * 2 - 3];

      this.rects = [rect1, rect2];
    },
    calcScale() {
      const { realWidth:width, height, svgWH } = this;

      const [w, h] = svgWH;

      this.svgScale = [width / w, height / h];
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