<!--
 * @Description: 动效图案
 * @Author: shenah
 * @Date: 2024-10-31 16:15:30
 * @LastEditors: shenah
 * @LastEditTime: 2025-02-13 09:57:54
-->

<template>
  <div class="dsf-effect-pattern-wrap data-view-item-wrap ds-control data-view-no-padding" :style="effectPatternWrapStyle">
    <div class="effect-pattern data-view-common-bg-effect">
      <div class="effect-pattern-inner" :style="effectPatternInnerStyle" :key="updateId">
        <!-- 图片 -->
        <template v-if="thingType === 'image'">
          <div class="effect-image-item" v-for="(item, index) in thingNum" :key="index" :style="effectImageItemStyle(index)">
            <div class="current-image-item" :style="currentImageItemStyle(item, index)" :class="getAnimationInfoClass" @animationend="animationend(index)"></div>
          </div>
        </template>
        <!-- 图标 -->
        <template v-else-if="thingType === 'icon'">
          <i class="effect-icon-item" v-for="(item, index) in thingNum" :key="index" :style="effectIconItemStyle(index)" :class="getCommonIconClass(index)">
            <i class="current-icon-item" :class="getCurrentIconItemClass(index)" :style="currentIconItemStyle(index)" @animationend="animationend(index)"></i>
          </i>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import createBackground from "_dataview/output/config/backgroundExtend.js";
export default dsf.component({
  name: "DsfDataViewEffectPattern",
  ctrlCaption: "动效图案",
  mixins: [$mixins.dataView],
  props: {
    // 背景图片
    backgroundConfig: {
      type: Object,
      default: () => createBackground(),
    },
    thingType: {
      type: String,
      default: "image",
    },
    thingNum: {
      type: Number,
      default: 4,
    },
    thingSpace: {
      type: Number,
      default: -2,
    },
    thingX: {
      type: Number,
      default: 0,
    },
    thingY: {
      type: Number,
      default: 0,
    },
    thingLayout: {
      type: String,
      default: "row",
    },
    thingDirection: {
      type: String,
      default: "1",
    },
    thingRotate: {
      type: Number,
      default: 0,
    },
    imageConfig: {
      type: Object,
      default: () => ({
        imageW: "16",
        imageH: "21",
        isBaseImage: true,
        baseImageList: [
          {
            active: "pattern",
            imageType: "board",
            pattern: {
              image: "/dataview/file/sdk/download?files=01f8cac3767e4fc19fb30e999845f4a2",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
              customW: "100%",
              customH: "100%",
              customX: "center",
              customY: "center",
              isCustomPosition: false,
              animation: {
                name: [],
              },
              width: "100%",
              height: "100%",
            },
            color: {
              type: "color",
              image: "",
              isTheme: false,
              theme: "main",
              value: "",
            },
          },
        ],
        imageList: [
          {
            active: "pattern",
            imageType: "board",
            pattern: {
              image: "/dataview/file/sdk/download?files=4e0ed866d8a24ac9ad977b8243f072cc",
              size: "100% 100%",
              repeat: "no-repeat",
              position: ["center", "center"],
              customW: "100%",
              customH: "100%",
              customX: "center",
              customY: "center",
              isCustomPosition: false,
              animation: {
                name: [],
              },
              width: "100%",
              height: "100%",
            },
            color: {
              type: "color",
              image: "",
              isTheme: false,
              theme: "main",
              value: "",
            },
          },
        ],
      }),
    },
    iconConfig: {
      type: Object,
      default: () => ({
        fontSize: 20,
        iconList: ["right"],
        baseColorList: ["#fff"],
        colorList: ["#1482EC"],
      }),
    },
    animationConfig: {
      type: Object,
      default: () => ({
        flag: true,
        duration: 1,
        delay: 0.1,
        isCycle: true,
        cycleTime: 2000,
      }),
    },
  },
  computed: {
    effectPatternWrapStyle() {
      let style = {
        ...this.controlStyle,
        ...this.dvBackgroundFormat(this.backgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
      return style;
    },
    effectPatternInnerStyle() {
      let rotateMap = {
        row: {
          1: "0",
          0: "180",
        },
        column: {
          1: "90",
          0: "270",
        },
      };
      let rotateVale = rotateMap[this.thingLayout][this.thingDirection];
      if (this.thingDirection === "custom") {
        rotateVale = this.thingRotate;
      }
      let style = {
        transform: `rotate(${rotateVale}deg)`,
        top: dsf.dataview.utils.transformPx(this.thingY),
        left: dsf.dataview.utils.transformPx(this.thingX),
      };
      return style;
    },
    getAnimationInfoClass() {
      let arrClass = [];
      this.animationConfig.flag ? arrClass.push("light-up") : arrClass.push("not-light-up");
      return arrClass;
    },
  },
  data() {
    return {
      updateId: dsf.uuid(),
      timer: null,
    };
  },
  watch: {
    animationConfig: {
      handler() {
        this.initData();
      },
      deep: true,
    },
    thingNum() {
      this.initData();
    },
    thingType() {
      this.initData();
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.reset();
  },
  methods: {
    initData() {
      this.reset();
      this.updateId = dsf.uuid();
    },
    effectImageItemStyle(index) {
      let imageObj = this.getIndexInfo(this.imageConfig.baseImageList, index);
      let imageStyle = this.imageConfig.isBaseImage ? this.dvBackgroundFormat(imageObj) : {};
      let style = {
        width: dsf.dataview.utils.transformPx(this.imageConfig.imageW),
        height: dsf.dataview.utils.transformPx(this.imageConfig.imageH),
        ...imageStyle,
        left: this.thingSpace * index + "px",
      };
      return style;
    },
    effectIconItemStyle(index) {
      let color = this.getIndexInfo(this.iconConfig.baseColorList, index);
      let style = {
        fontSize: dsf.dataview.utils.transformPx(this.iconConfig.fontSize),
        left: this.thingSpace * index + "px",
        color,
      };
      return style;
    },
    getCurrentIconItemClass(index) {
      const icon = this.getCommonIconClass(index);
      return [icon, ...this.getAnimationInfoClass];
    },
    currentImageItemStyle(index) {
      let imageObj = this.getIndexInfo(this.imageConfig.imageList, index);
      let style = {
        ...this.dvBackgroundFormat(imageObj),
        ...this.calcAnimationStyle(index),
      };
      return style;
    },
    currentIconItemStyle(index) {
      let color = this.getIndexInfo(this.iconConfig.colorList, index);
      let style = {
        fontSize: dsf.dataview.utils.transformPx(this.iconConfig.fontSize),
        color,
        ...this.calcAnimationStyle(index),
      };
      return style;
    },
    getIndexInfo(arr, index) {
      let totalLength = arr.length;
      let info = arr[index] ? arr[index] : arr[totalLength - 1];
      return info;
    },
    calcAnimationStyle(index) {
      let style = {
        "animation-duration": this.animationConfig.duration + "s",
        "animation-delay": index * (this.animationConfig.duration + this.animationConfig.delay) + "s",
      };
      return style;
    },
    getCommonIconClass(index) {
      const icon = this.getIndexInfo(this.iconConfig.iconList, index);
      const iconClass = dsf.icons.getClassName(icon);
      return iconClass.fullName;
    },
    animationend(index) {
      if (this.animationConfig.isCycle) {
        var total = this.thingNum;
        if (total - 1 === index) {
          this.timer = setTimeout(() => {
            this.initData();
          }, this.animationConfig.cycleTime);
        }
      }
    },
    reset() {
      clearTimeout(this.timer);
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/effectPattern.scss";
</style>
