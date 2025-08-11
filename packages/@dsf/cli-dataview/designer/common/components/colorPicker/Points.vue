<template>
  <div class="dsf-color-slider ds-color-break-points">
    <div class="ds-prefix">
      <slot name="prefix"></slot>
    </div>
    <div ref="sliderBox" class="dsf-color-slider__bar">
      <div class="dsf-color-slider__bar--bg" :style="paneStyle" @click.self="addPoint"></div>
      <template v-for="(point, idx) in value">
        <div
          :key="idx"
          class="dsf-color-slider__point"
          :class="{ active: idx == activeIndex }"
          :style="{ left: point.pos + '%', background: point.color }"
          @mousedown="pointMousedown(point, idx, $event)"
          @mouseup="showColorPop(point, idx, $event)"
          @keyup.delete="removePoint(activeIndex)"
          tabindex="0"
        >
          <DsfIcon v-if="value.length > 2" class="remove" name="guanbi2" title="删除" @click="removePoint(idx)" @mousedown.stop></DsfIcon>
        </div>
      </template>
    </div>
    <div class="ds-suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script>
import slider from "./sliderMixin";

export default {
  name: "ColorBreakPoints",
  mixins: [slider],
  props: {
    value: {
      default: Array,
      required: true,
    },
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
  computed: {
    activePoint() {
      if (this.value.length > this.activeIndex) {
        return this.value[this.activeIndex];
      }
      return this.value[0];
    },
    paneStyle() {
      let str = this.value.map(({ pos, color }) => `${color} ${pos}%`).join();
      return {
        background: `linear-gradient(90deg, ${str})`,
      };
    },
  },
  watch: {
    activePoint: function (nv, ov) {
      this.$parent.color.fromString(nv.color);
      this.$parent.init();
    },
    // isDown(to) {
    //   if (!to) {
    //     this.$set(this.activePoint, "active", false);
    //   }
    // },
  },
  methods: {
    addPoint(e) {
      let { offsetX } = e;
      let { offsetWidth } = this.$refs.sliderBox;
      let value = this.value;
      let length = Math.floor((offsetX * 100) / offsetWidth);
      let index = value.length;
      for (let i = 0, l = index; i < l; i++) {
        if (value[i].pos > length) {
          index = i;
          break;
        }
      }
      this.value.splice(index, 0, {
        pos: length,
        color: "#fff",
      });
      this.activeIndex = index;
      this.$nextTick(() => {
        this.$emit("change", this.value);
      });
    },
    removePoint(idx) {
      if (this.value.length < 3) return;
      this.value.splice(idx, 1);
      this.activeIndex = 0;
      this.$nextTick(() => {
        this.$emit("change", this.value);
      });
    },
    pointMousedown(point, idx, e) {
      let { offsetX, offsetY, screenX, screenY, target } = e;
      while (true) {
        if (target.classList.contains("dsf-color-slider__point")) {
          this.__thumb = target;
          break;
        }
        target = target.parentElement;
      }
      this.___downTime = Date.now();
      this.___offsetX = offsetX;
      this.activeIndex = idx;
      this.mousedown({
        offsetX,
        offsetY,
        screenX,
        screenY,
        target: this.__thumb,
      });
      // this.$set(point, "active", true);
    },
    showColorPop(point, i, e) {
      // if (Date.now() - this.___downTime > 300) return;
      // let { offsetX } = e;
      // if (this.___offsetX === offsetX && !point.show) {
      //   let fun = () => {
      //     window.removeEventListener("mouseup", fun);
      //     this.$forceUpdate();
      //   };
      // }
    },
    pointChange(x) {
      let { offsetWidth } = this.$refs.sliderBox;
      this.$set(this.activePoint, "pos", Math.floor((x * 100) / offsetWidth));
      this.value.sort((a, b) => a.pos - b.pos);
      this.$nextTick(() => {
        this.$emit("change", this.value);
      });
    },
  },
};
</script>
