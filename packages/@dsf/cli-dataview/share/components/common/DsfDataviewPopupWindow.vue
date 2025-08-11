<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-09-09 09:53:08
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-03-04 18:25:24
-->
<template>
  <div class="dv-popup-window-wrapper" @mouseleave="mouseleave" @mouseover="mouseover" :style="wrapStyle">
    <div class="arrow" v-show="hasArrow" :style="arrowStyle"></div>
    <DsfVirtualScroll>
      <DsfDataviewViewPart ref="DsfDataviewViewPart" :path="dataPath" />
    </DsfVirtualScroll>
  </div>
</template>
<script>
export default {
  name: "DsfDataviewPopupWindow",
  props: {
    styleConfig: {
      type: Object,
      require: true,
    },
    fullPath: {
      type: String,
      default: "",
    },
    path: {
      type: String,
      default: "",
    },
    openerVm: {
      type: Object,
      default() {
        return {};
      },
    },
    hasArrow: {
      type: Boolean,
      default: true,
    },
    arrowStyle: {
      type: Object,
      default() {
        return {
          size: 10,
        };
      },
    },
    offsetFormat: {
      type: [Number, String, Function],
      default: 0,
    },
    placement: {
      type: String,
      default: "right",
    },
    // 是否手动关闭
    manual:{
      type:Boolean,
      default: false
    }
  },
  data() {
    return {
      isOver: false,
      dataPath: "",
    };
  },
  created() {
    this.dataPath = this.fullPath;
  },
  computed: {
    wrapStyle() {
      const { arrowStyle, styleConfig, hasArrow } = this;
      let { width, height, background, borderWidth, borderRadius,borderColor, shadowShow, shadowColor} = styleConfig;
      let backgroundStyle = dsf.dataview.utils.$backgroundFormat(background);
      borderRadius = dsf.dataview.utils.transformPx(borderRadius);
      borderWidth = dsf.dataview.utils.transformPx(borderWidth);
      const arrowSize = dsf.dataview.utils.transformPx(arrowStyle.size);
      let border = `${borderWidth} solid ${borderColor}`;
      let shadow = {};
      if (shadowShow && !hasArrow) {
        shadow.boxShadow = `inset 0px 0px 12px 0px ${shadowColor}`;
      }
      return {
        width,
        height,
        border,
        ...backgroundStyle,
        "border-radius": borderRadius,
        "--privacy-theme": backgroundStyle["background-color"],
        "--arrow-size": arrowSize,
        ...shadow
      };
    },
  },
  beforeDestroy() {
    this.$refs.DsfDataviewViewPart.$destroy();
  },
  methods: {
    updatePath(path) {
      this.dataPath = path;
    },
    mouseover() {
      this.isOver = true;
    },
    mouseleave() {
      this.isOver = false;
      // 是否自动关闭
      if (!this.manual) {
        this.openerVm.handleCloseDVPopup();
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/popupWindow.scss";
</style>
