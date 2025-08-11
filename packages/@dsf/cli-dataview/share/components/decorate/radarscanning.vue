<!-- 雷达扫描 -->
<template>
  <div class="dsf-dv-radarscanning dsf-decorate data-view-item-wrap ds-control data-view-no-padding" :style="controlHeight">
    <div class="svgboxs" :ref="ref" :style="controlStyle">
      <svg :width="size" :height="size" class="svgcontent">
        <defs>
          <g :id="gId">
            <path :stroke="pathColor[i]" :stroke-width="size / 2" fill="transparent" v-for="(d, i) in pathD" :key="d" :d="d" />
          </g>
          <radialGradient :id="gradientId" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="transparent" stop-opacity="1" />
            <stop offset="100%" :stop-color="viceColor" stop-opacity="1" />
          </radialGradient>
        </defs>
        <circle v-for="r in circleR" :key="r" :r="r" :cx="x" :cy="y" :stroke="viceColor" :stroke-width="0.5" fill="transparent" />

        <!-- 向外扩展的动画圆形 -->
        <circle r="1" :cx="x" :cy="y" stroke="transparent" :fill="`url(#${gradientId})`">
          <animate attributeName="r" :values="`1;${size / 2}`" :dur="`${haloDur}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" :dur="`${haloDur}s`" repeatCount="indefinite" />
        </circle>

        <!-- 中心圆点 -->
        <circle r="2" :cx="x" :cy="y" :fill="viceColor" />

        <g v-if="showSplitLine">
          <polyline v-for="p in splitLinePoints" :key="p" :points="p" :stroke="viceColor" :stroke-width="0.5" opacity="0.5" />
        </g>

        <path v-for="d in arcD" :key="d" :d="d" :stroke="viceColor" stroke-width="5" fill="transparent" />

        <use :xlink:href="`#${gId}`">
          <animateTransform attributeName="transform" type="rotate" :values="`0, ${x} ${y};360, ${x} ${y}`" :dur="`${scanDur}s`" repeatCount="indefinite" />
        </use>
      </svg>
    </div>
    <div class="decorate-slot-content" :style="controlInnerStyle" slot-name="default">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { getCircleRadianPoint } from "./decorate.js";
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewRadarScanning",
  ctrlCaption: "雷达扫描",
  mixins: [$mixins.dataView, border],
  props: {
    graphSize: {
      type: String,
      default: "100",
    },

    color: {
      type: Array,
      // default: () => (['red','blue'])
      default: () => [],
    },

    scanDur: {
      //扫描动画速度
      type: Number,
      default: 3,
    },
    haloDur: {
      //向外扩散的动画圆形速度
      type: Number,
      default: 2,
    },
    comType: {
      type: String,
      default: "dsf.dataviewradarscanning",
    },
  },
  data() {
    const id = dsf.uuid();
    return {
      x: 0,
      y: 0,
      ref: "decoration-12",
      gId: `decoration-12-g-${id}`,
      gradientId: `decoration-12-gradient-${id}`,

      defaultColor: ["#2783ce", "#2cf7fe"],
      // defaultColor: [],

      mergedColor: [],

      pathD: [],

      pathColor: [],

      circleR: [],

      splitLinePoints: [],

      arcD: [],

      segment: 30,

      sectorAngle: Math.PI / 3,

      ringNum: 3,

      ringWidth: 1,

      showSplitLine: true,
    };
  },

  methods: {
    onResize() {
      this.x = this.size / 2;
      this.y = this.size / 2;

      this.init();
    },
    init() {
      const { calcPathD, calcPathColor, calcCircleR, calcSplitLinePoints, calcArcD } = this;

      calcPathD();

      calcPathColor();

      calcCircleR();

      calcSplitLinePoints();

      calcArcD();
    },
    calcPathD() {
      const { x, y, size: width, segment, sectorAngle } = this;
      const startAngle = -Math.PI / 2;
      const angleGap = sectorAngle / segment;
      const r = width / 4;
      let lastEndPoints = getCircleRadianPoint(x, y, r, startAngle);

      this.pathD = new Array(segment).fill("").map((_, i) => {
        const endPoints = getCircleRadianPoint(x, y, r, startAngle - (i + 1) * angleGap).map(_ => _.toFixed(5));
        const d = `M${lastEndPoints.join(",")} A${r}, ${r} 0 0 0 ${endPoints.join(",")}`;
        lastEndPoints = endPoints;
        return d;
      });
    },
    calcPathColor() {
      const { segment } = this;

      const colorGap = 100 / (segment - 1);

      this.pathColor = new Array(segment).fill().map((_, i) => this.fade(this.mainColor, 100 - i * colorGap));
    },
    calcCircleR() {
      //环形线
      const { segment, ringNum, size: width, ringWidth } = this;

      const radiusGap = (width / 2 - ringWidth / 2) / ringNum;

      this.circleR = new Array(ringNum).fill(0).map((_, i) => radiusGap * (i + 1));
    },
    calcSplitLinePoints() {
      //向外放射线
      const { x, y, size: width } = this;

      const angleGap = Math.PI / 6;
      const r = width / 2;

      this.splitLinePoints = new Array(6).fill("").map((_, i) => {
        const startAngle = angleGap * (i + 1);
        const endAngle = startAngle + Math.PI;
        const startPoint = getCircleRadianPoint(x, y, r, startAngle);
        const endPoint = getCircleRadianPoint(x, y, r, endAngle);

        return `${startPoint.join(",")} ${endPoint.join(",")}`;
      });
    },
    calcArcD() {
      //外层加粗线
      const { x, y, size: width } = this;

      const angleGap = Math.PI / 6;
      const r = width / 2 - 1;

      this.arcD = new Array(4).fill("").map((_, i) => {
        const startAngle = angleGap * (3 * i + 1);
        const endAngle = startAngle + angleGap;
        const startPoint = getCircleRadianPoint(x, y, r, startAngle);
        const endPoint = getCircleRadianPoint(x, y, r, endAngle);

        return `M${startPoint.join(",")} A${x}, ${y} 0 0 1 ${endPoint.join(",")}`;
      });
    },
    // resize() {
    //   this.$nextTick(() => {
    //     const dom = this.dom = this.$refs[this.ref]

    //     let w = dom ? dom.clientWidth : 0
    //     let h = dom ? dom.clientHeight : 0
    //     let size = w - h > 0 ? h : w
    //     this.width = size;
    //     this.x = size / 2
    //     this.y = size / 2

    //     this.init();
    //   })
    // },
  },
  computed: {
    size() {
      let w = this.realWidth > this.realHeight ? this.realHeight : this.realWidth;
      let graphW = (w / 100) * this.graphSize;
      return graphW;
    },
  },
  watch: {
    mainColor(v) {
      //颜色只支持输入
      this.onResize();
    },
    viceColor(v) {
      //颜色只支持输入
      this.onResize();
    },
    graphSize() {
      this.onResize();
    },
    scanDur() {
      this.onResize();
    },
    haloDur() {
      this.onResize();
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/decorate.scss";
</style>