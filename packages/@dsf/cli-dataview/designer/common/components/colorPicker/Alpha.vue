<template>
  <div ref="sliderBox" class="dsf-color-select-alpha" @mousedown="mousedown">
    <div class="dsf-color-select-alpha__bar" :style="alphaStyle"></div>
    <span ref="thumb" class="slider" :style="sliderStyle"></span>
  </div>
</template>

<script>
import slider from "./sliderMixin";

export default {
  name: "Alpha",
  mixins: [slider],
  data() {
    return {
      bg: "#fff",
      left: 0,
    };
  },
  computed: {
    alphaStyle() {
      return {
        background: `linear-gradient(-90deg, ${this.bg} ,transparent)`,
      };
    },
    sliderStyle() {
      return {
        left: this.left,
        background: this.bg,
      };
    },
  },
  created() {
    this.updateBg();
    this.updatePoint();
  },
  methods: {
    updateBg() {
      let { r, g, b } = this.$parent.color.toRgb();
      this.bg = `rgb(${r}, ${g}, ${b})`;
      return this;
    },
    updatePoint() {
      let { _alpha = 100 } = this.$parent.color;
      this.left = _alpha + "%";
      return this;
    },
    pointChange(x) {
      this.left = x + "px";
      let { offsetWidth } = this.$refs.sliderBox;
      this.$parent.color.set("alpha", ((x * 100) / offsetWidth).toFixed(2));
      this.$parent.colorChange();
    },
  },
};
</script>