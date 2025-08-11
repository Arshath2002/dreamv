<template>
  <div
    ref="sliderBox"
    class="ds-pos-select"
    @mousedown.stop="mousedown"
    @click.stop
  >
    <span ref="thumb" class="slider" :style="thumbStyle"></span>
  </div>
</template>

<script>
import slider from "./sliderMixin";

// 角度选择器
export default {
  name: "DsfPosSelect",
  mixins: [slider],
  props: {
    value: {
      type: Array,
      default: () => [50, 50],
    },
  },
  data() {
    return {};
  },
  computed: {
    thumbStyle() {
      return {
        left: this.value[0] + "%",
        top: this.value[1] + "%",
      };
    },
  },
  methods: {
    pointChange(x, y) {
      let { offsetWidth, offsetHeight } = this.$refs.sliderBox;
      let newVal = [
        ((x / offsetWidth) * 100).toFixed(2),
        ((y / offsetHeight) * 100).toFixed(2),
      ];
      this.$emit("update:value", newVal);
    },
  },
};
</script>