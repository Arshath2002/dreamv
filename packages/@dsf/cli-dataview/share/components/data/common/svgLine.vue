<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2024-01-18 13:41:28
 * @LastEditors: dengqirui dengqr@dreamdt.cn
 * @LastEditTime: 2024-10-14 17:13:10
-->
<template>
  <div ref="svg" class="dv-svg-line-wrapper">
    <svg :height="lineHeight">
      <polyline
        :points="basePoints"
        :stroke-dasharray="dash"
        :stroke-width="height"
        :stroke="baseColor"
        fill="none"
      />
      <defs v-if="lineGradientColors.length > 0">
        <linearGradient
          :id="'lineGradient' + id"
          :x1="lineGradientCoords.x1"
          :y1="lineGradientCoords.y1"
          :x2="lineGradientCoords.x2"
          :y2="lineGradientCoords.y2"
        >
          <stop
            v-for="(item, index) in lineGradientColors"
            :key="index"
            :offset="item.percentage"
            :stop-color="item.color"
          />
        </linearGradient>
      </defs>
      <polyline
        :points="ratePoints"
        :stroke-dasharray="dash"
        :stroke-width="height"
        fill="none"
        :stroke="polylineStroke"
      >
        <animate
          v-if="animateConfig.flag"
          attributeName="points"
          :from="dash"
          :to="ratePoints"
          :dur="durTime"
          fill="freeze"
        />
      </polyline>
    </svg>
  </div>
</template>
<script>
const OFFSET = 0.00001; // 为了渐变 加的偏移值
export default {
  name: "svgLine",
  inject: ["resizeCount"],
  props: {
    // 渐变id
    id: {
      type: [String, Number],
      default: 0,
    },
    //占比
    rate: {
      type: [String, Number],
      default: 20,
    },
    color: {
      type: String,
      default: "red",
    },
    //底色
    baseColor: {
      type: String,
      default: "blue",
    },
    // 间隙宽度
    dash: {
      type: Array,
      default() {
        return ["4", "4"];
      },
    },
    //线条高度
    height: {
      type: String,
      default: "20",
    },
    animateConfig: {
      type: Object,
      default: () => ({
        flag: false,
        dur: 3000,
      }),
    },
  },
  data() {
    return {
      clientWidth: 0,
      lineGradientColors: [],
      polylineStroke: "",
      lineGradientCoords: {
        x1: "0",
        y1: "0",
        x2: "1",
        y2: "0",
      },
    };
  },
  watch: {
    resizeCount: {
      handler() {
        this.initSvg();
      },
      deep: true,
    },
    color() {
      this.initColor();
    },
  },

  computed: {
    basePoints() {
      const clientWidth = this.clientWidth;
      const height = parseInt(this.height);
      const half = parseInt(height / 2);
      return `0 ${half},${clientWidth} ${half + OFFSET}`;
    },
    ratePoints() {
      const clientWidth = (this.clientWidth * this.rate) / 100;
      const height = parseInt(this.height);
      const half = parseInt(height / 2);
      return `0 ${half},${clientWidth} ${half + OFFSET}`;
    },
    lineHeight() {
      return dsf.dataview.utils.transformPx(this.height);
    },
    durTime() {
      if (this.animateConfig.flag && Number(this.animateConfig.dur) > 0) {
        return `${this.animateConfig.dur}ms`;
      } else {
        return "0ms";
      }
    },
  },
  created() {
    this.initColor();
  },
  mounted() {
    setTimeout(this.initSvg);
  },
  methods: {
    initColor() {
      const color = this.color;
      let lineGradientColors = [];
      let polylineStroke = color;
      // 正则表达式
      const regex =
        /linear-gradient\((\d+deg),\s*((?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,6})\s*\d+%?(?:,\s*)?)+\)/g;
      const match = color.match(regex);
      if (match) {
        const angle = color.match(/(\d+)deg/)[0]; // 提取角度
        this.calculateGradientCoords(parseInt(angle));
        const colorsAndStops = [
          ...color.matchAll(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,6})\s*(\d+%)/g),
        ]; // 提取颜色和百分比
        // console.log("角度:", angle);
        colorsAndStops.forEach(([fullMatch, color, percentage], index) => {
          lineGradientColors.push({
            color,
            percentage,
          });
        });
        polylineStroke = `url(#lineGradient${this.id})`;
      } else {
        lineGradientColors = [];
      }
      this.lineGradientColors = lineGradientColors;
      this.polylineStroke = polylineStroke;
    },
    calculateGradientCoords(angle) {
      // 将角度转换为弧度，减去水平初始值 90°
      const radians = ((angle - 90) * Math.PI) / 180;

      // 中心点
      const height = parseFloat(this.height);
      const width = (this.clientWidth * this.rate) / 100
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = centerX;

      // 计算终点坐标 (x2, y2)
      let x2 = centerX + radius * Math.cos(radians);
      let y2 = centerY + radius * Math.sin(radians);

      // 计算起点坐标 (x1, y1)，方向相反
      let x1 = centerX - radius * Math.cos(radians);
      let y1 = centerY - radius * Math.sin(radians);

      // 限制坐标在 0 到 1 之间（可选，通常 SVG 会自动裁剪）
      x1 = Math.max(0, Math.min(1, x1));
      y1 = Math.max(0, Math.min(1, y1));
      x2 = Math.max(0, Math.min(1, x2));
      y2 = Math.max(0, Math.min(1, y2));

      this.lineGradientCoords = {
        x1: x1.toFixed(3),
        y1: y1.toFixed(3),
        x2: x2.toFixed(3),
        y2: y2.toFixed(3)
      };
    },
    initSvg() {
      const svg = this.$refs.svg;
      this.clientWidth = svg ? svg.clientWidth : 0;
    },
    resize() {
      console.log("触发");
    },
  },
};
</script>
