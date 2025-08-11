<!--
 * @Description:数据看板
 * @Author: zhanghang
 * @Date: 2022-08-11 15:36:51
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-07 17:32:08
-->
<template>
  <div
    class="data-view-item-wrap ds-control dsf-dv-data-plane data-view-no-padding"
    :class="['layout--' + optionsLayout]"
    :style="getWrapStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <dsf-empty-data v-if="!hasData"></dsf-empty-data>
    <div v-else class="dsf-dv-data-plane-inner data-view-common-bg-effect">
      <div
        class="data-plane-item"
        @click="clickItem($event, item)"
        @mouseenter="(e) => handleMouseEnter(item, e)"
        @mouseleave="(e) => handleMouseLeave(item, e)"
        :style="controlInnerStyle(index)"
        v-for="(item, index) in data"
        :key="index"
      >
        <div class="data-plane-item-inner data-view-common-bg-effect" :style="planeItemInnerStyle(index)">
          <div class="plane-data" :style="planeDataStyle">
            <div class="name" :style="getNameStyle(item)">
              {{ item.name }}
            </div>
            <div class="data" :style="getDataStyle">
              <DsfDataViewScrollDigital
                :isDesign="isDesign"
                :style="{ padding: 0, width: 'auto' }"
                class="data-plane-digital"
                :decimals="config.decimals"
                :isTotalDigital="true"
                :config="config"
                border="-1"
                dataType="static"
                :isCycle="isCycle"
                :cycleSpaceTime="cycleSpaceTime"
                :staticData="{
                  startVal: 0,
                  endVal: transformUnit(item.value, unitTransform, false),
                }"
              >
                <template #default="{ data }">
                  <div :style="getNumberStyle(item)">{{ data }}</div>
                </template>
              </DsfDataViewScrollDigital>
              <span :style="unitCssTextStyle">
                {{ item.suffix }}
              </span>
            </div>
          </div>
          <div class="line" v-if="index !== data.length - 1 && isShowLine" :style="getLineStyle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const staticDataKeyDic = {
  name: "名称",
  value: "数量",
  suffix: "后缀(选填)",
};
const staticData = [
  {
    name: "某某某人数",
    value: "1235",
    suffix: "人",
  },
  {
    name: "某某某人数",
    value: "124568",
    suffix: "人",
  },
  {
    name: "某某某人数",
    value: "145",
    suffix: "人",
  },
];
import border5 from "_dataview/assets/styles/themes/img/border/border5.png";
import universalRuleMixin from "_dataview/mixins/universalRuleMixin";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewDataPlane",
  ctrlCaption: "数据看板",
  mixins: [$mixins.dataView, dataAnalysis, universalRuleMixin],
  components: {},
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewDataPlane",
    },
    totalBackground: {
      type: Object,
      default: () => ({
        active: "page",
      }),
    },
    nameTextStyle: {
      type: Object,
      default: () => ({
        fontSize: "16px",
        fontFamily: "Microsoft Yahei",
        fontWeight: "400", //  内容胖瘦
        fontStyle: "normal", //  内容斜体
        textDecoration: "none", //  内容下划线
        color: "rgba(255,255,255,1)",
      }),
    },
    valueTextStyle: {
      type: Object,
      default: () => ({
        fontSize: "32px",
        fontFamily: "Microsoft Yahei",
        fontWeight: "400", //  内容胖瘦
        fontStyle: "normal", //  内容斜体
        textDecoration: "none", //  内容下划线
        color: "rgba(255,255,255,1)",
      }),
    },
    singleWHType: {
      type: String,
      default: "auto",
    },
    unitTextStyle: {
      type: Object,
      default: () => ({
        name: "",
        fontSize: "12px",
        fontFamily: "Microsoft Yahei",
        fontWeight: "400", //  内容胖瘦
        fontStyle: "normal", //  内容斜体
        textDecoration: "none", //  内容下划线
        color: "rgba(255,255,255,1)",
      }),
    },
    unitTransform: {
      type: String,
      default: "",
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    //文字与数字间距
    gap: {
      type: [String, Number],
      default: "10px",
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    nameRuleList: {
      type: Array,
      default: () => [],
    },
    numberRuleList: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => ({
        duration: 1000,
        autoplay: true,
        decimals: 0,
        decimal: ".",
        separator: ",",
      }),
    },
    isCycle: {
      type: Boolean,
      default: false,
    },
    cycleSpaceTime: {
      type: Number,
      default: 3000,
    },
    itemWidth: {
      type: String,
      default: "auto",
    },
    itemHeight: {
      type: String,
      default: "auto",
    },
    flexDirection: {
      type: String,
      default: "column",
    },
    height: {
      type: String,
      default: "auto",
    },
    align: {
      type: String,
      default: "center",
    },
    isShowLine: {
      type: Boolean,
      default: false,
    },
    lineWidth: {
      type: String,
      default: "1px",
    },
    lineColor: {
      type: String,
      default: "#FFFFFF",
    },
    lineAlign: {
      type: String,
      default: "center",
    },
    optionsLayout: {
      type: String,
      default: "2",
    },
    margin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    padding: {
      type: Array,
      default: () => [10, 10, 10, 10],
    },
    itemMargin: {
      type: Array,
      default: () => [0, 10, 10, 0],
    },
    itemPadding: {
      type: Array,
      default: () => [10, 10, 10, 10],
    },
    isSelectEffect: {
      type: Boolean,
      default: false,
    },
    selectBgEffect: {
      type: Object,
      default: () => ({
        active: "board",
      }),
    },
    backgroundConfigs: {
      type: Array,
      default() {
        return [];
      },
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
            text: "名称字段",
            value: "name",
            map: "name",
            hideDigit: true,
          },
          {
            text: "值字段",
            value: "value",
            map: "value",
            hideDigit: true,
          },
          {
            text: "后缀(选填)",
            value: "suffix",
            map: "suffix",
            hideDigit: true,
          },
        ];
      },
    },
  },
  watch: {
    staticData: {
      handler() {
        if (this.isDesign) {
          setTimeout(this.init, 0);
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
  },
  computed: {
    flexAlign() {
      let align = "";
      switch (this.align) {
        case "left":
          align = "flex-start";
          break;
        case "center":
          align = "center";
          break;
        case "right":
          align = "flex-end";
          break;
      }
      return align;
    },
    getWrapStyle() {
      let padding = dsf.dataview.utils.transformArrayPx(this.padding);
      return {
        ...this.controlStyle,
        ...this.getCommonEnterAnimateStyle,
        padding,
        ...this.dvBackgroundFormat(this.totalBackground, {
          isBgInfoVar: true,
        }),
        ...this.getBoxShadowConfig(true),
      };
    },
    getLineStyle() {
      let width = dsf.dataview.utils.transformPx(this.lineWidth);
      let color = this.lineColor;
      let alignStyle = {};
      let lineAlign = this.lineAlign;
      if (lineAlign === "top") {
        alignStyle.top = 0;
        alignStyle.bottom = "auto";
        alignStyle.transform = "none";
      } else if (lineAlign === "center") {
        alignStyle.top = "50%";
        alignStyle.bottom = "auto";
        alignStyle.transform = "translate(0, -50%)";
      } else if (lineAlign === "bottom") {
        alignStyle.top = "auto";
        alignStyle.bottom = 0;
        alignStyle.transform = "none";
      }
      return {
        width,
        backgroundColor: color,
        top,
        ...alignStyle,
      };
    },
    planeDataStyle() {
      if (this.horizontal) {
        return {
          flexDirection: "row",
          "align-items": "center",
          "justify-content": this.flexAlign,
        };
      }
      return {
        flexDirection: this.flexDirection,
      };
    },
    getDataStyle() {
      return {
        margin: dsf.dataview.utils.transformPx(this.gap),
        "justify-content": this.flexAlign,
      };
    },
    unitCssTextStyle() {
      let colorStyle = dsf.dataview.utils.getTextColor(this.unitTextStyle.color);
      return {
        fontSize: dsf.dataview.utils.transformPx(this.unitTextStyle.fontSize),
        fontFamily: this.unitTextStyle.fontFamily,
        fontWeight: this.unitTextStyle.fontWeight,
        fontStyle: this.unitTextStyle.fontStyle,
        textDecoration: this.unitTextStyle.textDecoration,
        ...colorStyle,
      };
    },
  },
  data() {
    return {
      data: [],
      activeItem: "",
    };
  },
  created() {
    this.compatibleProp();
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.nameTextStyle, this.valueTextStyle],
        textAligns: [{ hAlign: this.align }],
        backgrounds: [this.totalBackground],
        itemBackgrounds: this.backgroundConfigs,
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter((it) => /布局|背景|边框设置|入场动画/.test(it.name));
        const { textStyles = [], textAligns = [], backgrounds = [], itemBackgrounds = [] } = config;
        this.updateComponentStyle("nameTextStyle", textStyles[0]);
        this.updateComponentStyle("valueTextStyle", textStyles[1]);
        this.updateComponentStyle("align", textAligns[0]?.hAlign);
        this.updateComponentStyle("totalBackground", backgrounds[0]);
        const wrapItemBackgrounds = itemBackgrounds.map((it) => {
          return {
            borderRadius: [],
            margin: [],
            padding: [],
            wH: ["", ""],
            relative: ["", ""],
            bgImgObj: it,
          };
        });
        this.updateComponentStyle("backgroundConfigs", wrapItemBackgrounds);
      }
      this.setComponentStyle(groups, config._props);
    },
    compatibleProp() {
      if (this.$attrs.nameRuleConfig) {
        this.nameTextStyle.fontFamily = this.$attrs.nameFontFamily;
        this.nameTextStyle.color = this.$attrs.nameRuleConfig.defaultForm.color;
        this.nameTextStyle.fontSize = this.$attrs.nameRuleConfig.defaultForm.fontSize;
        this.nameTextStyle.fontWeight = this.$attrs.nameRuleConfig.defaultForm.fontWeight;
        let nameRuleList = this.handleUniversalOldRuleToNew(this.$attrs.nameRuleConfig.ruleList);
        this.$emit("update:nameTextStyle", this.nameTextStyle);
        this.$emit("update:nameRuleList", nameRuleList);
      }
      if (this.$attrs.numberRuleConfig) {
        // 值
        this.valueTextStyle.color = this.$attrs.numberRuleConfig.defaultForm.color;
        this.valueTextStyle.fontSize = this.$attrs.numberRuleConfig.defaultForm.fontSize;
        this.valueTextStyle.fontWeight = this.$attrs.numberRuleConfig.defaultForm.fontWeight;
        let numberRuleList = this.handleUniversalOldRuleToNew(this.$attrs.numberRuleConfig.ruleList);
        this.$emit("update:valueTextStyle", this.valueTextStyle);
        this.$emit("update:numberRuleList", numberRuleList);
      }
      // 兼容
      if (this.$attrs.prop_suffixfontColor) {
        // 后缀
        this.unitTextStyle.name = this.$attrs.suffix;
        this.unitTextStyle.color = this.$attrs.prop_suffixfontColor;
        this.unitTextStyle.fontSize = this.$attrs.suffixFontSize;
        this.singleWHType = this.$attrs.isCustomWH ? "fixed" : "auto";
        this.$emit("update:unitTextStyle", this.unitTextStyle);
        this.$emit("update:singleWHType", this.singleWHType);
      }
    },
    getNameStyle(row) {
      let style = this.handleUniversalRule(row, this.nameRuleList);
      let textStyle = style?.text || {};
      let colorStyle = dsf.dataview.utils.getTextColor(this.nameTextStyle.color);
      let colorRuleStyle = textStyle.color ? dsf.dataview.utils.getTextColor(textStyle.color) : {};
      return {
        margin: dsf.dataview.utils.transformPx(this.gap),
        "text-align": this.align,
        ...dsf.dataview.utils.transformTextStyle(this.nameTextStyle),
        ...colorStyle,
        ...textStyle,
        ...colorRuleStyle,
      };
    },

    getNumberStyle(row) {
      let style = {
        ...dsf.dataview.utils.transformTextStyle(this.valueTextStyle),
      };
      let colorStyle = dsf.dataview.utils.getTextColor(this.valueTextStyle.color);
      let ruleStyle = this.handleUniversalRule(row, this.numberRuleList);
      let textStyle = ruleStyle?.text || {};
      let colorRuleStyle = textStyle.color ? dsf.dataview.utils.getTextColor(textStyle.color) : {};
      return {
        ...style,
        ...textStyle,
        ...colorStyle,
        ...colorRuleStyle,
      };
    },
    controlInnerStyle(index) {
      let singleStyle = {};
      let background = {};
      let margin = dsf.dataview.utils.transformArrayPx(this.itemMargin);
      let marginLeft = this.itemMargin[3] || 0;
      let marginRight = this.itemMargin[1] || 0;
      let width = _.round(100 / this.optionsLayout, 2);
      let resultWidth = this.calcWidth(width, marginLeft, marginRight);
      let resultHeight = null;
      let selectBgEffect = {};
      let bgPriority = null;
      let resultBg = {};
      if (this.isSelectEffect && this.activeItem === index + 1) {
        selectBgEffect = this.dvBackgroundFormat(this.selectBgEffect) || {
          active: "board",
        };
        bgPriority = "select";
      }
      if (this.singleWHType === "fixed") {
        resultWidth = dsf.dataview.utils.transformPx(this.itemWidth);
        resultHeight = dsf.dataview.utils.transformPx(this.itemHeight);
      }
      if (this.backgroundConfigs.length) {
        let len = this.backgroundConfigs.length;
        let oneBackgroundConfigObj = this.backgroundConfigs[index % len] || {};
        singleStyle = this.abstractBgArrAttr(oneBackgroundConfigObj);
        if (!bgPriority) {
          bgPriority = "single";
        }
      } else {
        background = {
          "background-image": `url(/${border5})`,
          "background-size": "100% 100%",
          "background-repeat": " no-repeat",
          "background-position": "center center",
        };
      }
      let overSingleStyle = this.isFilterBgAttr(singleStyle, true);
      let hasBackSingleStyle = this.isFilterBgAttr(singleStyle, false);
      if (bgPriority === "select") {
        // 使用选择背景
        resultBg = {
          ...selectBgEffect,
          ...overSingleStyle,
        };
      } else if (bgPriority === "single") {
        resultBg = hasBackSingleStyle;
      } else {
        resultBg = background;
      }
        // 处理滤镜只对图片生效
      singleStyle.filter && (resultBg.filter = singleStyle.filter);
      
      resultBg = dsf.dataview.utils.cssAttrToCssVar(resultBg);
      let obj = {
        width: resultWidth,
        height: resultHeight,
        margin,
        ...overSingleStyle,
        ...resultBg,
      };
      if (this.isEventCursorPointer || this.isSelectEffect) {
        obj["cursor"] = "pointer";
      }
      return obj;
    },
    planeItemInnerStyle() {
      let padding = dsf.dataview.utils.transformArrayPx(this.itemPadding);
      return {
        padding,
      };
    },
    // 是否过滤出背景相关的属性
    isFilterBgAttr(style, flag) {
      const keys = Object.keys(style);
      const filteredKeys = keys.filter((key) =>
        flag
          ? !key.includes("filter") && !key.includes("background") && !key.includes("radius") && !key.includes("animation")
          : key.includes("background") || key.includes("borderRadius") || key.includes("animation")
      );
      return filteredKeys.reduce((obj, key) => {
        obj[key] = style[key];
        return obj;
      }, {});
    },
    calcWidth(width, marginLeft, marginRight) {
      marginLeft += "";
      marginRight += "";
      // width 为百分比
      let total = width;
      // 为px
      let diff = 0;
      let leftLength = marginLeft.length;
      let rightLength = marginRight.length;
      if (marginLeft.includes("%")) {
        // 证明包含百分比
        total -= marginLeft.slice(0, leftLength - 1);
      } else {
        if (!isNaN(marginLeft * 1)) {
          diff += marginLeft * 1;
        }
      }
      if (marginRight.includes("%")) {
        // 证明包含百分比
        total -= marginRight.slice(0, rightLength - 1);
      } else {
        if (!isNaN(marginRight * 1)) {
          diff += marginRight * 1;
        }
      }
      return `calc(${total}% - ${dsf.dataview.utils.transformPx(diff)})`;
    },
    clickItem(evt, item) {
      this.activeItem = item.index;
      this.$dispatch("clickItem", item);
      this.loadClickEvents(item, evt);
    },
    start() {
      const digitals = document.querySelectorAll(".data-plane-digital");
      digitals.forEach((it) => {
        it.__vue__.start();
      });
    },
    dataAnalysis(data) {
      if (!data.length) {
        this.hasData = false;
        return;
      }
      // 映射数据
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        let mapRelations = this.mapRelations;
        let name = mapRelations[0].map;
        let value = mapRelations[1].map;
        let suffix = mapRelations[2].map;
        this.data = data.map((it, index) => {
          return {
            ...it,
            name: it[name],
            value: it[value],
            suffix: it[suffix] || suffix,
            index: index + 1,
          };
        });
      } else {
        this.data = data.map((item, index) => ({
          ...item,
          index: index + 1,
        }));
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewDataPlane.scss";
</style>
