<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-08-10 17:18:38
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-28 14:38:19
-->
<template>
  <div
    class="data-view-item-wrap ds-control dsf-dv-progress-bar data-view-no-padding"
    @click="clickItem"
    @mouseenter="(e) => handleMouseEnter(data, e)"
    @mouseleave="(e) => handleMouseLeave(data, e)"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
      ...getBoxShadowConfig(true),
    }"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <div
      :ref="ref"
      class="dsf-dv-progress-bar-inner data-view-common-bg-effect"
    >
      <dsf-empty-data v-if="data === null"></dsf-empty-data>
      <template v-else>
        <template v-if="barType === 'circle'">
          <div class="circle-wrap">
            <svg
              :width="size"
              :height="size"
            >
              <defs>
                <linearGradient :id="colorId">
                  <stop
                    offset="0%"
                    :stop-color="viceColor"
                  />
                  <stop
                    offset="100%"
                    :stop-color="mainColor"
                  />
                </linearGradient>
              </defs>
              <!-- 背景轨道 -->
              <path id="circlePath" :d="getCirclePath()" fill="none" :stroke="roundColor" :stroke-width="barWidth" stroke-linecap="round" />
              <!-- 进度条 -->
              <path v-if="dataCopy" :d="getCirclePath()" fill="none" :stroke="`url(#${colorId})`" :stroke-width="barWidth" stroke-linecap="round" :style="circleStyle" />
              <!-- 光点 -->
              <template v-if="hasPointer">
                <circle
                  v-if="isAnimation"
                  :r="barWidth"
                  stroke="none"
                  :fill="pointerColor"
                >
                  <animateMotion ref="animateMotion" :dur="`${animationDuration / 1000}s`" repeatCount="1" :keyPoints="`${lastValue / 100};${dataCopy / 100}`" keyTimes="0;1" fill="freeze">
                    <mpath href="#circlePath" />
                  </animateMotion>
                </circle>
                <circle
                  v-else
                  :cx="getPointerPos.x"
                  :cy="getPointerPos.y"
                  :r="barWidth"
                  stroke="none"
                  :fill="pointerColor"
                ></circle>
              </template>
            </svg>
            <div class="circle-text">
              <slot :data="data">
                <div
                  class="text-title"
                  :style="textStyle"
                  v-html="$textTitle"
                ></div>
                <div
                  class="text-sub-title"
                  :style="subTextStyle"
                  v-html="$textSubTitle"
                ></div>
              </slot>
            </div>
          </div>
        </template>
        <template v-else-if="barType === 'semicircle'">
          <div class="circle-wrap semicircle-wrap">
            <svg
              :width="size"
              :height="size"
              style="margin-bottom: auto;"
            >
              <defs>
                <linearGradient :id="colorId">
                  <stop
                    offset="0%"
                    :stop-color="viceColor"
                  />
                  <stop
                    offset="100%"
                    :stop-color="mainColor"
                  />
                </linearGradient>
              </defs>
              <!-- 背景轨道 -->
              <path id="semicirclePath" :d="getCirclePath(100)" fill="none" :stroke="roundColor" :stroke-width="barWidth" stroke-linecap="round" />
              <!-- 进度条 -->
              <path :d="getCirclePath()" fill="none" :stroke="`url(#${colorId})`" :stroke-width="barWidth" stroke-linecap="round" :style="circleStyle" />
              <!-- 光点 -->
              <template v-if="hasPointer">
                <circle
                  v-if="isAnimation"
                  :r="barWidth"
                  stroke="none"
                  :fill="pointerColor"
                >
                  <animateMotion ref="animateMotion" :dur="`${animationDuration / 1000}s`" repeatCount="1" :keyPoints="`${lastValue / 100};${dataCopy / 100}`" keyTimes="0;1" fill="freeze">
                    <mpath href="#semicirclePath" />
                  </animateMotion>
                </circle>
                <circle
                  v-else
                  :cx="getPointerPos.x"
                  :cy="getPointerPos.y"
                  :r="barWidth"
                  stroke="none"
                  :fill="pointerColor"
                ></circle>
              </template>
            </svg>
            <div class="circle-text">
              <slot :data="data">
                <div
                  class="text-title"
                  :style="textStyle"
                  v-html="$textTitle"
                ></div>
                <div
                  class="text-sub-title"
                  :style="subTextStyle"
                  v-html="$textSubTitle"
                ></div>
              </slot>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="line-box">
            <div
              class="text-title"
              :style="textStyle"
            >
              <slot>
                <label
                  :style="textStyle"
                  v-html="$textTitle"
                ></label>
                <span
                  :style="subTextStyle"
                  v-html="$textSubTitle"
                ></span>
              </slot>
            </div>
            <div
              class="line-outer"
              :style="`border-radius:${barWidth}px;height:${barWidth}px;background:${roundColor};`"
            >
              <div
                class="line-inner"
                style="right: 100%"
                :style="lineStyle"
              >
                <span v-if="hasPointer" class="line-pointer" :style="getPointerStyle"></span>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
const staticDataKeyDic = {
  value: "进度",
};
const staticData = [
  {
    value: "25",
  },
];
import defaultBackgroundConfig from "_dataview/share/components/common/backgroundDefault.js";
import svg from "_dataview/mixins/svg.js";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig.js";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewProgressBar",
  ctrlCaption: "进度条",
  mixins: [$mixins.dataView, svg, dataAnalysis],
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewProgressBar",
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    deep: {
      type: [String, Number],
      default: "8",
    },
    barType: {
      type: String,
      default: "circle", // semicircle 半圆
    },
    titleTextStyle: {
      type: Object,
      default: () => createCommonTextStyle({ fontSize: "16" }),
    },
    // TODO 优化 两个颜色合并为一个字段 用dv_color的渐变处理
    mainColor: {
      type: String,
      default: "#83bff6",
    },
    viceColor: {
      type: String,
      default: "#00CED1",
    },
    roundColor: {
      type: String,
      default: "rgba(245, 245, 245, 0.5)",
    },
    textTitle: {
      type: String,
      default: "人数增长",
    },
    subTitleTextStyle: {
      type: Object,
      default: () => createCommonTextStyle({ fontSize: "12" }),
    },
    gap: {
      type: String,
      default: "5",
    },
    textSubTitle: {
      type: String,
      default: "@[value]%",
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "值",
            value: "value",
            map: "value",
          },
        ];
      },
    },
    // 开启光点
    hasPointer: {
      type: Boolean,
      default: false,
    },
    pointerColor: {
      typs: String,
      default: "#FFFFFF",
    },
    isAnimation: {
      type: Boolean,
      default: true,
    },
    animationDuration: {
      type: Number,
      default: 800,
    },
    //整体背景
    totalBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackgroundConfig };
      },
    },
  },
  data() {
    let colorId = dsf.uuid();
    return {
      otherEvents: ["刷新", "还原数据", "显示", "隐藏", "替换数据"],
      ref: "progress-bar-wrap",
      componentRef: "progress-bar-wrap",
      data: null,
      dataCopy: 0, // 用于动效
      lastValue: 0, // 用于动效
      originData: [],
      colorId,
    };
  },
  computed: {
    controlStyle() {
      let { padding, height, barType, width } = this;
      if (barType === "line" && height != "auto") {
        this.$emit("update:height", "auto");
      } 
      if ((barType === "circle" || barType === "semicircle") && height === "auto") {
        this.$emit("update:height", "100%");
      }
      const style = {
        width,
        padding: padding.join("px ") + "px",
        ...this.eventCursorPointerStyle,
        ...this.dvBackgroundFormat(this.totalBackgroundConfig, {
          isBgInfoVar: true,
        }),
      }

      if (!this.isDesign) {
        style.height = height;
      }
      return style;
    },
    $textTitle() {
      let row = this.originData[0] || {};
      return this.$replace(this.textTitle, row);
    },
    $textSubTitle() {
      let row = this.originData[0] || {};
      return this.$replace(this.textSubTitle, row);
    },
    textStyle() {
      return dsf.dataview.utils.transformTextStyle(this.titleTextStyle);
    },
    subTextStyle() {
      return dsf.dataview.utils.transformTextStyle(this.subTitleTextStyle);
    },
    barWidth() {
      return this.deep;
    },
    size() {
      const { padding: [top, right, bottom, left] } = this;
      const width = this.realWidth - right - left;
      const height = this.realHeight - top - bottom;
      if (width <= 0 || height <= 0) return 0;
      if (this.barType == "semicircle") {
        if (width > 2 * height) {
          return height * 2;
        } else {
          return width
        }
      }
      return Math.min(height, width);
    },
    animationDurationSec() {
      return (this.animationDuration / 1000).toFixed(2);
    },
    circleStyle() {
      let perimeter = 2 * Math.PI * this.circleRadius;
      if (this.barType === "semicircle") {
        perimeter = Math.PI * this.circleRadius;
      }
      let percent = this.dataCopy >= 100 ? 100 : this.dataCopy;
      let currentVal = perimeter * (percent / 100);
      return {
        transition: this.isAnimation ? `stroke-dasharray ${this.animationDurationSec}s linear 0s` : "none",
        "stroke-dasharray": `${currentVal},${perimeter}`,
      };
    },
    lineStyle() {
      let percent = this.dataCopy >= 100 ? 100 : (this.dataCopy < 0 ? 0 : this.dataCopy);
      return {
        "border-radius": `${this.barWidth}px`,
        height: `${this.barWidth}px`,
        position: "relative",
        width: `${percent}%`,
        left: 0,
        transition: this.isAnimation ? `width ${this.animationDurationSec}s linear .2s` : "none",
        "background-image": `linear-gradient(to right, ${this.mainColor} 0%, ${this.viceColor} 100%)`,
      };
    },
    // 圆半径
    circleRadius() {
      if (this.size / 2 > this.barWidth) {
        return this.size / 2 - this.barWidth;
      } else {
        return 0;
      }
    },
    // 圆路径
    getCirclePath() {
      return function(percent) {
        const halfWidth = this.size / 2;
        const center = {
          x: this.circleRadius,
          y: this.circleRadius,
        }
        if (this.barType === "circle") {
          const start = {
            x: halfWidth,
            y: this.barWidth,
          }
          const end = {
            x: halfWidth,
            y: this.size - this.barWidth,
          }

          return `M${start.x} ${start.y} A${center.x} ${center.y} 0 0 1 ${end.x} ${end.y} A${center.x} ${center.y} 0 0 1 ${start.x} ${start.y}`
        } else {
          percent = percent || this.dataCopy >= 100 ? 100 : this.dataCopy;
          const angle = Math.PI * (Math.min(percent, 100) / 100);
    
          const start = {
            x: this.barWidth,
            y: halfWidth,
          }
          const end = {
            x: halfWidth + this.circleRadius * Math.cos(Math.PI - angle),
            y: halfWidth - this.circleRadius * Math.sin(Math.PI - angle),
          }
    
          return `M${start.x} ${start.y} A${center.x} ${center.y} 0 0 1 ${end.x} ${end.y}`
        }
      }
    },
    // 点位置
    getPointerPos() {
      const percent = this.dataCopy >= 100 ? 100 : this.dataCopy;
      if (this.barType == "semicircle") {
        const halfWidth = this.size / 2;
        const angle = Math.PI * (Math.min(percent, 100) / 100);
        return {
          x: halfWidth + this.circleRadius * Math.cos(Math.PI - angle),
          y: halfWidth - this.circleRadius * Math.sin(Math.PI - angle),
        }
      } else if (this.barType === "circle") {
        const radius = this.size / 2;
        const angle = 2 * Math.PI * (Math.min(percent, 100) / 100);
        return {
          x: radius + this.circleRadius * Math.sin(angle),
          y: radius - this.circleRadius * Math.cos(angle),
        }
      } else {
        return {}
      }
    },
    // 点样式
    getPointerStyle() {
      const percent = this.dataCopy >= 100 ? 100 : this.dataCopy;
      if (this.barType == "semicircle") {
        const halfWidth = this.size / 2;
        const angle = Math.PI * (Math.min(percent, 100) / 100);
        return {
          x: halfWidth + this.circleRadius * Math.cos(Math.PI - angle),
          y: halfWidth - this.circleRadius * Math.sin(Math.PI - angle),
        }
      } else if (this.barType === "circle") {
        const radius = this.size / 2;
        const angle = 2 * Math.PI * (Math.min(percent, 100) / 100);
        return {
          x: radius + this.circleRadius * Math.sin(angle),
          y: radius - this.circleRadius * Math.cos(angle),
        }
      } else {
        return {
          width: this.barWidth * 2 + "px",
          height: this.barWidth * 2 + "px",
          background: this.pointerColor,
        }
      }
    },
  },
  watch: {
    barType(nv) {
      this.onResize(this.dataCopy);
    },
    barWidth(nv) {
      this.onResize(this.dataCopy);
    },
    size() {
      this.onResize(this.dataCopy);
    },
    staticData: {
      handler() {
        setTimeout(this.init, 0);
      },
    },
    data(nv) {
      setTimeout(() => {
        this.onResize(this.dataCopy);

        if (Array.isArray(nv)) {
          this.dataCopy = nv[0] | 0;
        } else {
          this.dataCopy = nv | 0;
        }
      }, 0);
    },
  },
  created() {
    this.initTextStyle();
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.titleTextStyle, this.subTitleTextStyle],
        backgrounds: [this.totalBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.updateComponentStyle("titleTextStyle", textStyles[0]);
        this.updateComponentStyle("subTitleTextStyle", textStyles[1]);
        this.updateComponentStyle("totalBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    onResize(val) {
      if (this.barType != "bar" && this.hasPointer && this.isAnimation && this.$refs.animateMotion) {
        this.lastValue = val || 0;
        this.$refs.animateMotion.beginElement();
      }
    },
    // 兼容老板本
    initTextStyle() {
      // 老板本的属性 prop_textColor subFontSize prop_subTextColor
      if (this.$attrs.prop_textColor) {
        const titleTextStyle = dsf.mix(true, {}, this.titleTextStyle, {
          fontSize: this.fontSize,
          color: this.$attrs.prop_textColor,
        });
        const subTitleTextStyle = dsf.mix(true, {}, this.subTitleTextStyle, {
          fontSize: this.$attrs.subFontSize,
          color: this.$attrs.prop_subTextColor,
        });
        this.$emit(`update:titleTextStyle`, titleTextStyle);
        this.$emit(`update:subTitleTextStyle`, subTitleTextStyle);
      }
    },
    clickItem(evt) {
      this.$dispatch("clickItem", this.data);
      this.loadClickEvents(this.data, evt);
    },
    dataAnalysis(data) {
      if (!data || !data.length) {
        this.hasData = false;
        return false;
      }
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        this.data = data.slice(0, 1).map((it) => {
          let val = it[this.mapRelations[0].map];
          return this.handleMapRelationNum(val, this.mapRelations[0]);
        });
        this.originData = data.slice(0, 1).map((it) => {
          let val = it[this.mapRelations[0].map];
          val = this.handleMapRelationNum(val, this.mapRelations[0]);
          return {
            ...it,
            [this.mapRelations[0].map]: val,
          };
        });
      } else {
        this.data = dsf.isObject(data[0]) ? data[0].value : data[0];
        this.originData = [
          {
            value: dsf.isObject(data[0]) ? data[0].value : data[0],
          },
        ];
      }
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/DsfDataViewProgressBar.scss";
</style>

