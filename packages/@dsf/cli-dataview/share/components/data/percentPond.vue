<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-29 15:32:43
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-09-10 18:26:01
-->
<template>
  <div
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    class="data-view-item-wrap ds-control dsf-dv-percent-pond data-view-no-padding"
    :ref="ref"
    :style="getStyle"
    @click="clickItem"
    @mouseenter="(e) => handleMouseEnter(data, e)"
    @mouseleave="(e) => handleMouseLeave(data, e)"
  >
    <DsfEmptyData v-if="data === null" />
    <div class="percent-pond-content" v-else>
      <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" :width="svgWidth" :height="svgHeight">
        <defs>
          <linearGradient :id="gradientId1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop v-for="lc in linearGradient" :key="lc[0]" :offset="`${lc[0]}%`" :stop-color="lc[1]" />
          </linearGradient>

          <linearGradient :id="gradientId2" x1="0%" y1="0%" :x2="gradient2XPos" y2="0%">
            <stop v-for="lc in linearGradient" :key="lc[0]" :offset="`${lc[0]}%`" :stop-color="lc[1]" />
          </linearGradient>
        </defs>
        <rect
          :x="config ? config.borderWidth / 2 : '0'"
          :y="config ? config.borderWidth / 2 : '0'"
          :rx="config ? config.borderRadius : '0'"
          :ry="config ? config.borderRadius : '0'"
          fill="transparent"
          :stroke-width="config ? config.borderWidth : '0'"
          :stroke="`url(#${gradientId1})`"
          :width="rectWidth > 0 ? rectWidth : 0"
          :height="rectHeight > 0 ? rectHeight : 0"
        />
        <polyline :stroke-width="polylineWidth" :stroke-dasharray="config ? config.lineDash.join(',') : '0'" :stroke="`url(#${polylineGradient})`" :points="toPoints" :id="progressId">
          <animate v-if="isAnimate" attributeName="points" :from="fromPoints" :to="toPoints" :dur="durTime" fill="freeze" />
        </polyline>
        <!-- <text :stroke="config ? config.textColor : '#fff'" :fill="config ? config.textColor : '#fff'" :x="svgWidth / 2" :y="svgHeight / 2 + config.borderWidth" :style="fontStyle">
          {{ details }}
        </text> -->
      </svg>
      <span :style="fontStyle" v-html="content" class="text-content"></span>
    </div>
  </div>
</template>
<script>
const staticDataKeyDic = {
  value: "进度",
};
const staticData = [
  {
    value: "90",
  },
];
import svg from "_dataview/mixins/svg.js";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig.js";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewPercentPond",
  ctrlCaption: "进度池",
  mixins: [$mixins.dataView, svg, dataAnalysis],
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewPercentPond",
    },
    padding: {
      type: Array,
      default: () => [10, 25, 10, 25]
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    isAnimate: {
      type: Boolean,
      default: true,
    },
    richTextContent: {
      type: String,
      default: '任务进度：<label contenteditable="false" class="tag" real-value="value" style="font-weight: bold">value</label> %',
    },
    //文本字段规则
    fieldsStyleRules: {
      type: Array,
      default() {
        return [
          {
            valueName: "value",
            rule: "none",
            threshold: "",
            style: {
              fontFamily: "Microsoft Yahei",
              fontSize: "20px",
              color: "var(--t--normal2)",
              fontStyle: "normal",
              fontWeight: "bold",
            },
          },
        ];
      },
    },
    animateTime: {
      type: String,
      default: "3000",
    },

    config: {
      type: Object,
      default: () => ({
        // 进度池配色
        colors: ["#3DE7C9", "#00BAFF"],
        // 边框宽度
        borderWidth: 3,
        // 边框间隙
        borderGap: 1,
        // 线条间隙
        lineDash: [5, 0],
        // 文字颜色
        // textColor: '#fff',
        // 边框半径
        borderRadius: 5,
        // 局部渐变
        localGradient: false,
        //信息格式化
        formatter: "{value}%",
      }),
    },
    titleTextStyle: {
      type: Object,
      default: () => createCommonTextStyle({ fontSize: "16", color: "#ffffff", textShadow: "2px 2px 5px rgba(0, 0, 0, 0.6842)" }),
    },
    height: {
      type: String,
      default: "60px",
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
            hideDigit: true,
          },
        ];
      },
    },
  },
  data() {
    const id = dsf.uuid(32);
    return {
      otherEvents: ["刷新", "还原数据", "显示", "隐藏", "替换数据"],
      gradientId1: `percent-pond-gradientId1-${id}`,
      gradientId2: `percent-pond-gradientId2-${id}`,
      isLoadListener: false,
      ref: "percent-pond",
      componentRef: "percent-pond",
      data: null,
      content: "",
      progressId: dsf.uuid(),
    };
  },
  watch: {
    padding() {
      this.$nextTick(() => {
        this.init();
      })
    },
    height(nv) {
      this.$nextTick(() => {
        this.init();
      })
    },
    richTextContent: {
      handler(v) {
        if (this.isDesign) {
          this.init();
        }
      },
    },
    fieldsStyleRules: {
      handler(v) {
        if (this.isDesign) {
          this.dataFormatterHandler();
        }
      },
    },
    config: {
      handler() {
        if (this.isDesign) {
          setTimeout(this.init, 0);
        }
      },
      deep: true,
    },
    staticData: {
      handler(v) {
        if (this.isDesign) {
          setTimeout(this.init, 0);
        }
      },
    },
    isAnimate: {
      handler(v) {
        if (this.isDesign) {
          this.$nextTick(() => {
            const polyline = document.getElementById(this.progressId);
            const animateElement = polyline.querySelector("animate");
            if (animateElement) animateElement.beginElement();
          });
        }
      },
    },
    animateTime: {
      handler() {
        if (this.isDesign) {
          this.$nextTick(() => {
            const polyline = document.getElementById(this.progressId);
            const animateElement = polyline.querySelector("animate");
            if (animateElement) animateElement.beginElement();
          });
        }
      },
    },
  },
  computed: {
    svgWidth() {
      const { realWidth, padding } = this;
      return realWidth - padding[1] - padding[3];
    },
    svgHeight() {
      const { realHeight, padding } = this;
      return realHeight - padding[0] - padding[2];
    },
    getStyle() {
      let { height, width, margin } = this;
      if (dsf.isNumber(height) || /^\d+$/g.test(height)) {
        height += "px";
      }
      if (dsf.isNumber(width) || /^\d+$/g.test(width)) {
        width += "px";
      }
      let marginArr = margin;

      if (this.isDesign) {
        marginArr = [0, margin[1], 0, margin[3]];
      }
      return {
        padding: this.padding.map(it => +it + "px").join(" "),
        margin: marginArr.map(it => +it + "px").join(" "), 
        height,
        width,
        ...this.eventCursorPointerStyle,
        ...this.getCommonEnterAnimateStyle
      }
    },
    fontStyle() {
      let style = dsf.dataview.utils.transformTextStyle(this.titleTextStyle);
      style.lineHeight = style.fontSize || 1;
      return style;
    },
    durTime() {
      if (this.isAnimate && Number(this.animateTime) > 0) {
        return `${this.animateTime}ms`;
      } else {
        return "0ms";
      }
    },
    rectWidth() {
      const { config, svgWidth } = this;

      if (!config) return 0;

      const { borderWidth } = config;

      return svgWidth - borderWidth;
    },
    rectHeight() {
      const { config, svgHeight } = this;

      if (!config) return 0;

      const { borderWidth } = config;

      return svgHeight - borderWidth;
    },
    toPoints() {
      const { config, svgWidth: width, svgHeight: height, data } = this;

      const halfHeight = height / 2;

      if (!config) return `0, ${halfHeight} 0, ${halfHeight}`;

      const { borderWidth, borderGap } = config;

      const polylineLength = ((width - (borderWidth + borderGap) * 2) / 100) * data;
      return `${borderWidth + borderGap}, ${halfHeight} ${borderWidth + borderGap + polylineLength}, ${halfHeight + 0.001}`;
    },
    fromPoints() {
      const { config, svgHeight: height, data } = this;
      let width = 0;
      const halfHeight = height / 2;

      if (!config) return `0, ${halfHeight} 0, ${halfHeight}`;

      const { borderWidth, borderGap } = config;

      const polylineLength = ((width - (borderWidth + borderGap) * 2) / 100) * data;
      return `${borderWidth + borderGap}, ${halfHeight} ${borderWidth + borderGap + polylineLength}, ${halfHeight + 0.001}`;
    },
    polylineWidth() {
      const { config, svgHeight: height } = this;

      if (!config) return 0;

      const { borderWidth, borderGap } = config;

      return height - (borderWidth + borderGap) * 2;
    },
    linearGradient() {
      const { config } = this;

      if (!config) return [];

      const { colors } = config;

      const colorNum = colors.length;

      const colorOffsetGap = 100 / (colorNum - 1);

      return colors.map((c, i) => [colorOffsetGap * i, c]);
    },
    polylineGradient() {
      const { gradientId1, gradientId2, config } = this;

      if (!config) return gradientId2;

      if (config.localGradient) return gradientId1;

      return gradientId2;
    },
    gradient2XPos() {
      const { data, config } = this;

      if (!config) return "100%";

      return `${200 - data}%`;
    },
    details() {
      const { data, config } = this;

      if (!config) return "";

      const { formatter } = config;

      if (typeof formatter === "function") {
        return formatter.call(this, data);
      }
      return formatter.replace("{value}", data);
    },
  },
  created() {
    this.compatibleProp();
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        textStyles: [this.titleTextStyle],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        const { textStyles = [], backgrounds = [] } = config;
        groups = groups.filter(it => /布局|背景|边框设置|入场动画/.test(it.name));
        this.updateComponentStyle("titleTextStyle", textStyles[0]);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    // 兼容老板本
    compatibleProp() {
      if (this.config?.textColor) {
        const titleTextStyle = dsf.mix(true, {}, this.titleTextStyle, {
          fontSize: this.fontSize,
          color: this.config.textColor,
        });
        let config = _.cloneDeep(this.config);
        delete config.textColor;
        this.$emit(`update:titleTextStyle`, titleTextStyle);
        this.$emit(`update:config`, config);
      }
    },
    clickItem(evt) {
      this.$dispatch("clickItem", this.data);
      this.loadClickEvents(this.data, evt);
    },
    dataAnalysis(data) {
      if (!data.length) {
        this.hasData = false;
        return;
      }
      this.dataFormatterHandler(data);
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        this.data = data.slice(0, 1).map((it) => {
          let val = it[this.mapRelations[0].map];
          return this.handleMapRelationNum(val, this.mapRelations[0]);
        });
      } else {
        this.data = data.map((it) => it.value);
      }

      if (this.isDesign) {
        this.$nextTick(() => {
          const polyline = document.getElementById(this.progressId);
          const animateElement = polyline.querySelector("animate");
          if (animateElement) animateElement.beginElement();
        });
      }
      this.resize();
    },
    dataFormatterHandler(data = this.serviceData) {
      if (Array.isArray(data)) {
        let obj = data[0];
        var html = dsf.dataview.utils.analyzeToolTipHTMLAttr(this.richTextContent, obj, "textBox", [], this.fieldsStyleRules);
        this.content = html;
      } else {
        this.content = "";
      }
    },
  },
});
</script>
<style lang="scss">
 @import "_dataview/assets/styles/share/components/DsfDataViewPercentPond.scss";
</style>
