<!--
 * @Description: 全屏组件
 * @Author: shenah
 * @Date: 2023-11-15 14:07:42
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-24 15:59:34
-->

<template>
  <div
    class="data-view-full-screen-wrap data-view-item-wrap ds-control"
    :style="{
      ...this.getCommonEnterAnimateStyle,
      ...this.controlStyle,
    }"
  >
    <!-- 背景 -->
    <div class="data-view-full-screen" :style="getDataViewFullScreenStyle" @click="fullscreen">
      <!-- icon图标 -->
      <DsfIcon class="screen-icon" :name="getScreenIconClass" :style="getScreenIconStyle" :title="getScreenIconTitle"></DsfIcon>
      <!-- 文字 -->
      <span v-if="isShowText" class="screen-text" :style="getScreenTextStyle">
        {{ isFullscreen ? noFullText || "退出全屏" : fullText || "全屏" }}
      </span>
    </div>
  </div>
</template>
<script>
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import { createCommonTextStyle, handleColor } from "_dataview/output/config/commonConfig";
export default dsf.component({
  name: "DsfDataViewFullscreen",
  mixins: [$mixins.dataView],
  ctrlCaption: "全屏",
  props: {
    padding: {
      type: Array,
      default: () => [8, 8, 8, 8],
    },
    isDesignFull: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "auto",
    },
    isShowBg: {
      type: Boolean,
      default: false,
    },
    background: {
      type: Object,
      default: () => ({}),
    },
    bgWidth: {
      type: String,
      default: "40",
    },
    bgHeight: {
      type: String,
      default: "40",
    },
    fullIcon: {
      type: String,
      default: "quanping",
    },
    noFullIcon: {
      type: String,
      default: "huanyuanhuabu",
    },
    iconFontSize: {
      type: String,
      default: "20",
    },
    iconColor: {
      type: String,
      default: "#1DECFF",
    },
    iconPosition: {
      type: Array,
      default: () => ["auto", "auto", "auto", "auto"],
    },
    isShowText: {
      type: Boolean,
      default: false,
    },
    fullTextStyle: {
      type: Object,
      default: () => createCommonTextStyle(),
    },
    fullText: {
      type: String,
      default: "全屏",
    },
    noFullText: {
      type: String,
      default: "退出全屏",
    },
    fullTextPosition: {
      type: Array,
      default: () => ["auto", "auto", "auto", 10],
    },
    //存在事件依赖
    hasEventRelative: {
      type: Boolean,
      default: true,
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          fullscreen: {
            relatives: [],
            fn: eventTemp,
          },
          noFullscreen: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
  },
  data() {
    return {
      componentType: "screen",
      isFullscreen: false, // 是否是全屏
    };
  },
  watch: {
    isDesignFull: {
      handler(val) {
        if (this.isDesign) {
          this.isFullscreen = val;
        }
      },
      immediate: true,
    },
    isFullscreen(val) {
      this.loadFullscreenEvents(val);
    },
  },
  computed: {
    getScreenIconTitle() {
      let noText = this.noFullText || "退出全屏";
      let text = this.fullText || "全屏";
      return this.isFullscreen ? noText : text;
    },
    getScreenIconClass() {
      return this.isFullscreen ? this.noFullIcon : this.fullIcon;
    },
    getScreenIconStyle() {
      let fontSize = dsf.dataview.utils.transformPx(this.iconFontSize);
      let positionObj = this.handlePositionArrPx(this.iconPosition);
      return {
        fontSize,
        color: this.iconColor,
        ...positionObj,
      };
    },
    getDataViewFullScreenStyle() {
      let style = {};
      if (this.isShowBg) {
        let bg = this.dvBackgroundFormat(this.background) || {};
        let width = dsf.dataview.utils.transformPx(this.bgWidth);
        let height = dsf.dataview.utils.transformPx(this.bgHeight);
        style = {
          ...style,
          ...bg,
          width,
          height,
        };
      }
      return style;
    },
    getScreenTextStyle() {
      const position = this.handlePositionArrPx(this.fullTextPosition) || {};
      return this.getTitleStyle(this.fullTextStyle, position);
    },
  },
  created() {
    this.downwardCompatible();
    window.addEventListener("keydown", this.keydownEvent);
  },
  mounted() {
    this.$nextTick(() => {
      const el = document.documentElement;
      el.setAttribute("allowfullscreen", true);
      el.setAttribute("allow", "fullscreen");
      dsf.screenFull.onchange(() => {
        this.isFullscreen = dsf.screenFull.isFullscreen;
      });
      this.handleEventScope();
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keydownEvent);
  },
  methods: {
    // 向下兼容
    downwardCompatible() {
      if (this.$attrs.fullTextColor) {
        const fullTextStyle = createCommonTextStyle({
          color: this.$attrs.fullTextColor,
          fontFamily: this.$attrs.fullTextFontFamily,
          fontSize: this.$attrs.fullTextFontSize,
        });

        this.$emit("update:fullTextStyle", fullTextStyle);
      }
    },
    getTitleStyle(textStyle, position) {
      const style = dsf.dataview.utils.transformTextStyle(textStyle);
      return dsf.mix(true, { ...position }, style);
    },
    keydownEvent() {
      var e = window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 122) {
        e.preventDefault(); //阻止F11默认动作
        //捕捉F11键盘动作
        this.fullscreen();
      } else if (e && e.keyCode == 27) {
        e.preventDefault(); //阻止ESCd的默认动作
        if (dsf.screenFull.isEnabled) {
          dsf.screenFull.exit();
        }
      }
    },
    fullscreen(e) {
      if (!this.isDesign) {
        e?.stopPropagation();
        if (dsf.screenFull.isEnabled) {
          dsf.screenFull.toggle(document.documentElement);
        }
      }
    },
    // 全屏事件
    loadFullscreenEvents(val) {
      let eventType = val ? "fullscreen" : "noFullscreen";
      try {
        let { fn } = this.eventRelativeDeal[eventType];
        //给组件设置当前数据
        this.currentComponentData = null;
        this.handleCommonEmit(fn, null);
      } catch (e) {
        console.error(e);
      }
    },
    screenAction() {
      if (dsf.screenFull.isEnabled) {
        dsf.screenFull.request(document.documentElement);
      }
    },
    exitScreenAction() {
      if (dsf.screenFull.isEnabled) {
        dsf.screenFull.exit();
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/fullscreen.scss";
</style>
