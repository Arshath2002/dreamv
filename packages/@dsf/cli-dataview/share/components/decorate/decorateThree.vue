<template>
  <div
    class="dsf_decorate_three dsf-decorate data-view-item-wrap ds-control data-view-no-padding"
    :style="controlHeight"
  >
    <div class="svgboxs" :ref="ref" :style="controlStyle">
      <svg :width="realWidth" :height="realHeight">
        <template v-for="(point, i) in points">
          <rect
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
              :values="`${mergedColor.join(';')}`"
              :dur="Math.random() + 1 + 's'"
              :begin="Math.random() * 2"
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
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewDecorateThree",
  ctrlCaption: "装饰3",
  mixins: [$mixins.dataView, border],
  props: {
    rowNum: {
      type: Number,
      default: 5,
    },
    rowPoints: {
      type: Number,
      default: 25,
    },
    dur: {
      type: Number,
      default: 6,
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
        ];
      },
    },
    comType: {
      type: String,
      default: "dsf.dataviewdecoratethree",
    },
  },
  data() {
    const pointSideLength = 7;

    return {
      ref: "decoration-3",
      svgWH: [300, 35],

      svgScale: [1, 1],

      pointSideLength,
      halfPointSideLength: pointSideLength / 2,

      points: [],

      defaultColor: ["#7acaec", "transparent"],
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
    rowNum(v) {
      this.rowNum = v;
      this.init();
    },
    rowPoints(v) {
      this.rowPoints = v;
      this.init();
    },
    dur(v) {
      this.dur = v;
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
    },
    calcScale() {
      const { realWidth: width, height, svgWH } = this;
      const [w, h] = svgWH;
      this.svgScale = [width / w, height / h];
    },
    onResize() {
      const { calcSVGData } = this;

      calcSVGData();
      this.init();
    },
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
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>