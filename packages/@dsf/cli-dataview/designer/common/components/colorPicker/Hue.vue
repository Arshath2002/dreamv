<template>
  <div ref="sliderBox" class="dsf-color-select-hue" @mousedown="mousedown">
    <span ref="thumb" class="slider" :style="sliderStyle"></span>
  </div>
</template>

<script>
import slider from "./sliderMixin";

export default {
  name: "Hue",
  mixins: [slider],
  data() {
    return {
      bg: "#fff",
      left: 0,
    };
  },
  computed: {
    sliderStyle() {
      return {
        left: this.left,
        background: this.bg,
      };
    },
  },
  created() {
    this.updatePoint();
  },
  methods: {
    updateBg() {
      let { _hue } = this.$parent.color;
      this.bg = `hsla(${_hue}, 100%, 50%, 1)`;
      return this;
    },
    updatePoint() {
      let { _hue } = this.$parent.color;
      this.left = (_hue * 100) / 360 + "%";
      return this;
    },
    pointChange(x, y) {
      this.left = x + "px";
      let { offsetWidth } = this.$refs.sliderBox;
      this.$parent.color.set("hue", (x * 360) / offsetWidth);
      this.$parent.colorChange();
    },
  },
};
</script>