<template>
  <div
    ref="sliderBox"
    class="dsf-color-select-panel"
    :style="hueStyle"
    @mousedown="mousedown"
  >
    <span ref="thumb" class="slider" :style="sliderStyle"></span>
  </div>
</template>

<script>
import slider from "./sliderMixin";

export default {
  name: "Panel",
  mixins: [slider],
  data() {
    return {
      bg: "#fff",
      top: 0,
      left: 0,
    };
  },
  computed: {
    hueStyle() {
      return {
        "background-color": this.bg,
      };
    },
    sliderStyle() {
      return {
        top: this.top,
        left: this.left,
      };
    },
  },
  created() {
    this.updateBg();
    this.updatePoint();
  },
  methods: {
    updateBg() {
      let { _hue } = this.$parent.color;
      this.bg = `hsla(${_hue}, 100%, 50%, 1)`;
      return this;
    },
    updatePoint() {
      let { _saturation, _value } = this.$parent.color;
      this.top = 100 - _value + "%";
      this.left = _saturation + "%";
      return this;
    },
    pointChange(x, y) {
      this.top = y + "px";
      this.left = x + "px";
      let { offsetWidth, offsetHeight } = this.$refs.sliderBox;
      this.$parent.color.set("saturation", (100 * x) / offsetWidth);
      this.$parent.color.set("value", ((offsetHeight - y) * 100) / offsetHeight);
      this.$parent.color._alpha = 100;
      this.$parent.colorChange();
    },
  },
};
</script>