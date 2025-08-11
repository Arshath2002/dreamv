<template>
  <div
    class="data-view-dynamic-arrow data-view-item-wrap data-view-no-padding"
    :style="{
      ...controlHeight,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <!-- 跑线背景 -->
    <div
      class="digital-line-wrap"
      :style="lineWrapStyle"
    >
      <div
        class="digital-line"
        :style="lineStyle"
      ></div>
      <div
        class="digital-line"
        :style="lineStyle"
      ></div>
    </div>
    <!-- 内容背景 -->
    <div
      class="digital-rainy-wrap"
      :style="digitalStyle"
    >
      <div
        class="digital-rainy"
        :style="rainyStyle"
      ></div>
      <div
        class="digital-rainy"
        :style="rainyStyle"
      ></div>
    </div>
    <!-- 箭头背景 -->
    <div
      class="arrow-item"
      :style="arrowStyle"
      v-if="isArrow"
    ></div>
  </div>
</template>
<script>
let defaultBGconfig = {
  active: "custom",
  custom: {
    image: "",
    size: "cover",
    repeat: "no-repeat",
    position: "center",
  },
};
import lineImg from "_dataview/assets/styles/themes/img/bussiness/arrow-bg.png";
import rainyImg from "_dataview/assets/styles/themes/img/bussiness/rainy-img.png";
import arrowImg from "_dataview/assets/styles/themes/img/bussiness/arrow-up.png";
export default dsf.component({
  name: "DsfDataViewDynamicArrow",
  ctrlCaption: "动效箭头",
  mixins: [$mixins.dataView],
  props: {
    width: {
      type: String,
      default: "124",
    },
    height: {
      type: String,
      default: "80",
    },
    isArrow: {
      type: Boolean,
      default: true,
    },
    speed: {
      type: Number,
      default: 0.5,
    },
    lineBg: {
      type: Object,
      default() {
        return { ...defaultBGconfig };
      },
    },

    rainyBg: {
      type: Object,
      default() {
        return { ...defaultBGconfig };
      },
    },
    arrowBg: {
      type: Object,
      default() {
        return { ...defaultBGconfig };
      },
    },
    //方向
    direction: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      timer: null,
      transformY: 0,
      arrowY: 0,
      lineY: 0,
    };
  },
  watch: {
    speed() {
      cancelAnimationFrame(this.timer); //停止
      this.init();
    },
    direction() {
      cancelAnimationFrame(this.timer); //停止
      this.init();
    },
  },
  computed: {
    lineHeight() {
      return this.height;
    },
    rainyHeight() {
      return this.height * 2;
    },
    lineStyle() {
      let height = dsf.dataview.utils.transformPx(this.lineHeight);
      let url = lineImg;
      if (this.lineBg.custom.image) {
        url = this.lineBg.custom.image;
      }
      return {
        height,
        "background-image": `url(${url})`,
      };
    },
    rainyStyle() {
      let height = dsf.dataview.utils.transformPx(this.rainyHeight);
      let url = rainyImg;
      if (this.rainyBg.custom.image) {
        url = this.rainyBg.custom.image;
      }
      return {
        height,
        "background-image": `url(${url})`,
      };
    },
    arrowStyle() {
      let url = arrowImg;
      if (this.arrowBg.custom.image) {
        url = this.arrowBg.custom.image;
      }
      let top = "100%";
      let transform = `translateY(-${this.arrowY}px)`;
      if (this.direction != "1") {
        top = "-100%";
        transform = `rotate(180deg) translateY(-${this.arrowY}px)`;
      }
      return {
        top,
        transform,
        "background-image": `url(${url})`,
      };
    },
    digitalStyle() {
      //up
      if (this.direction == "1") {
        return {
          top: `-${dsf.dataview.utils.transformPx(this.rainyHeight)}`,
          transform: `translateY(${this.transformY}px)`,
        };
      }
      return {
        top: "0",
        transform: `translateY(-${this.transformY}px)`,
      };
    },
    lineWrapStyle() {
      //up
      if (this.direction == "1") {
        return {
          top: `-${dsf.dataview.utils.transformPx(this.lineHeight)}`,
          transform: `translateY(${this.lineY}px)`,
        };
      }
      return {
        top: "0",
        transform: `translateY(-${this.lineY}px)`,
      };
    },
  },

  mounted() {
    this.init();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.timer); //停止
  },
  methods: {
    init() {
      this.scrollItem(0, 0, 0);
    },
    scrollItem(transformY, arrowY, lineY) {
      if (lineY >= this.lineHeight) {
        lineY = 0;
      } else {
        lineY += Number(this.speed);
      }
      if (transformY >= this.rainyHeight) {
        transformY = 0;
      } else {
        transformY += Number(this.speed);
      }
      if (arrowY >= this.height * 2) {
        arrowY = 0;
      } else {
        arrowY += Number(this.speed * 2);
      }
      this.transformY = transformY;
      this.arrowY = arrowY;
      this.lineY = lineY;
      this.timer = window.requestAnimationFrame(() => {
        this.scrollItem(transformY, arrowY, lineY);
      });
    },
  },
});
</script>
