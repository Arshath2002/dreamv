<!--
 * @Description: 创建生成圆环的svg
 * @Author: shenah
 * @Date: 2024-01-17 17:34:39
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-28 14:36:08
-->
<template>
  <svg :width="ringSize" :height="ringSize" class="data-view-create-svg-ring">
    <!-- 第一个圆 -->
    <circle
      class="common-circle"
      :cx="centerCircle"
      :cy="centerCircle"
      :r="oneCircleRadius"
      :stroke-width="config.commonCircleStrokeWidth"
      :stroke="getBigColor(config.bigCircleStrokeArr, '0', rowIndex)"
    />
    <!-- 第一个圆的四个小圆 -->
    <circle
      v-for="str in smallCircleArr"
      :key="str"
      :cx="calcSmallCircle[str].cx"
      :cy="calcSmallCircle[str].cy"
      :r="calcSmallCircle[str].r"
      stroke-width="0"
      :fill="getColorFromArray(config.nodeCircleStrokeArr, rowIndex)"
    ></circle>
    <!-- 第二个圆 -->
    <circle
      class="common-circle"
      :cx="centerCircle"
      :cy="centerCircle"
      :r="twoCircleRadius"
      :stroke-width="config.commonCircleStrokeWidth"
      :stroke="getBigColor(config.bigCircleStrokeArr, '1', rowIndex)"
    />
    <!-- 第四个圆 -->
    <circle
      class="common-circle"
      :cx="centerCircle"
      :cy="centerCircle"
      :r="fourCircleRadius"
      :stroke-width="config.commonCircleStrokeWidth"
      :stroke="getBigColor(config.bigCircleStrokeArr, '3', rowIndex)"
    />
    <defs>
      <linearGradient :id="gradientId" x1="0" x2="0" y1="0%" y2="100%">
        <stop offset="0%" :stop-color="lineColor[0]" />
        <stop offset="100%" :stop-color="lineColor[1]" />
      </linearGradient>
    </defs>
    <rect
      class="common-rect"
      v-for="(item, index) in rectList"
      :key="index"
      :x="item.x"
      :y="item.y"
      :width="item.width"
      :height="item.height"
      :transform="`rotate(${item.rotate}, ${item.cx} ${item.cy})`"
      :fill="getRange(index)"
    />
    <!-- 第三个圆(层级的问题) -->
    <circle
      class="common-circle"
      :cx="centerCircle"
      :cy="centerCircle"
      :r="threeCircleRadius"
      :stroke-width="config.commonCircleStrokeWidth"
      :stroke="getBigColor(config.bigCircleStrokeArr, '2', rowIndex)"
    />
    <!-- 文字展示 -->
    <text class="progress-circle-text" text-anchor="middle" dominant-baseline="middle" :x="centerCircle" :y="centerCircle" :style="textStyle">{{ row.value }}%</text>
  </svg>
</template>

<script>
import utils from "_dataview/output/utils/gis.js";
export default {
  name: "svgRing",
  data() {
    return {
      // 用于生成随机Key,因为vue会将svg文件
      gradientId: dsf.uuid(),
      wrapId: dsf.uuid(),
      maskId: dsf.uuid(),
      smallCircleArr: ["leftCircle", "rightCircle", "topCircle", "bottomCircle"],
    };
  },
  props: {
    rowIndex: {
      type: Number,
    },
    valueTextStyle: {
      type: Object,
      require: true,
    },
    row: {
      type: Object,
      default: () => ({
        value: 0,
      }),
    },
    ringSize: {
      type: Number,
    },
    config: {
      type: Object,
    },
  },
  computed: {
    lineColor() {
      const colors = this.config.linesColors;
      let image = colors[this.rowIndex % colors.length];
      const reg = /(#[0-9A-Za-z]{3,})|(rgb(?:a)?\(.+?\))/g;
      const result = image.match(reg);
      if (result && result.length) {
        return result.slice(0, 2);
      }
      return ["#222", "#222"];
    },
    calcSmallCircle() {
      let r = this.config.commonCircleStrokeWidth + 2;
      return {
        leftCircle: {
          cx: r,
          cy: this.centerCircle,
          r,
        },
        rightCircle: {
          cx: this.ringSize - r,
          cy: this.centerCircle,
          r,
        },
        topCircle: {
          cx: this.centerCircle,
          cy: r,
          r,
        },
        bottomCircle: {
          cx: this.centerCircle,
          cy: this.ringSize - r,
          r,
        },
      };
    },
    centerCircle() {
      return this.ringSize / 2;
    },
    oneCircleRadius() {
      return this.centerCircle - this.config.commonCircleStrokeWidth - 2;
    },
    twoCircleRadius() {
      return this.oneCircleRadius - 10;
    },
    threeCircleRadius() {
      return this.fourCircleRadius + 10;
    },
    fourCircleRadius() {
      return this.oneCircleRadius / 2;
    },
    progressRadius() {
      return this.fourCircleRadius;
    },
    rectList() {
      // 总共进度条个数
      let rectNum = this.config.rectNum;
      let deg = 360 / rectNum;
      let rectList = [];
      let rectWidth = this.config.rectWidth;
      let rectHeight = this.config.rectHeight;
      // 这里计算百分比宽度
      let totalWidth = rectNum * rectWidth;
      let nowWidth = _.floor((totalWidth * this.row.value) / 100, 2);
      let num = Math.floor(nowWidth / rectWidth);
      let diffNum = _.floor(nowWidth % rectWidth, 2);
      let radius = this.progressRadius + rectHeight;
      if (diffNum > 0) {
        num + 1;
      }
      for (let i = 0; i < num; i++) {
        let nowDeg = i * deg;
        const x = this.centerCircle + Math.sin(nowDeg * (Math.PI / 180)) * radius;
        const y = this.centerCircle - Math.cos(nowDeg * (Math.PI / 180)) * radius;
        const cx = x;
        const cy = y;
        let nowRectWidth = rectWidth;
        if (diffNum > 0 && i === num - 1) {
          nowRectWidth = diffNum;
        }
        const point = {
          cx,
          cy,
          x,
          y,
          width: nowRectWidth,
          height: rectHeight,
          rotate: nowDeg,
        };
        rectList.push(point);
      }
      return rectList;
    },
    textStyle() {
      const style = dsf.dataview.utils.transformTextStyle(this.valueTextStyle);
      style.fill = style.color;
      return style;
    },
  },
  created() {
    this.compatibleTextStyleProp();
  },
  methods: {
    compatibleTextStyleProp() {
      if (this.config.textColor) {
        const valueTextStyle = dsf.mix(true, this.valueTextStyle, {
          color: this.config.textColor,
          fontFamily: this.config.textFontFamily,
          fontSize: this.config.textFontSize,
          fontWeight: "normal",
        });
        this.$emit("update:valueTextStyle", valueTextStyle);
      }
    },
    getRange(index) {
      const lineColor = this.lineColor;
      //纵向
      if (this.config.gradientDirection === "vec") {
        return `url(#${this.gradientId})`;
        //横向
      } else {
        let len = this.rectList.length;
        return utils.rangeColor(lineColor[0], lineColor[1], 0, len - 1, index);
      }
    },
    getColorFromArray(arr, index) {
      return arr[index] || _.last(arr);
    },
    getBigColor(arr, circleIndex, index) {
      let colorArr = this.getColorFromArray(arr, index);
      return this.getColorFromArray(colorArr, circleIndex);
    },
    getPerimeter(radius) {
      return 2 * Math.PI * radius;
    },
  },
};
</script>
