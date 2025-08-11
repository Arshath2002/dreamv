<!--
 * @Description: 文字框
 * 引用该组件:
 *   1.timeInfo --- 时间轴详细
 * @Author: shenah
 * @Date: 2023-09-20 16:06:14
 * @LastEditors: shenah
 * @LastEditTime: 2024-12-24 11:31:33
-->

<template>
  <div class="dsf-dv-input-text-box ds-control" :style="controlOuterStyle">
    <div class="dsf-dv-input-text-box-wrap data-view-common-bg-effect" :style="inputTextBoxWrapStyle">
      <dsf-empty-data v-if="!hasData"></dsf-empty-data>
      <DsfVirtualScroll v-else :class="contentTextAlign.vAlign" :style="getScrollStyle">
        <el-popover
          :disabled="!isShowPopover"
          trigger="hover"
          :popper-class="`dsf-dv-input-text-box-popover ${popoverStyleEffect}`">
          <div :style="popoverStyle" v-html="content"></div>
          <span slot="reference" @click="itemClick" :style="spanStyle" v-html="content" class="now-text"></span>
        </el-popover>
      </DsfVirtualScroll>
    </div>
  </div>
</template>
<script>
const staticDataKeyDic = {
  value: "描述",
};
const staticData = [
  {
    value: "默认文字",
  },
];
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import defaultBackground from "_dataview/share/components/common/backgroundDefault.js";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewTextBox",
  ctrlCaption: "文本",
  mixins: [$mixins.dataView, dataAnalysis],
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewTextBox",
    },
    //背景
    controlBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackground };
      },
    },
    // 组件高度
    height: {
      type: String,
      default: "100%",
    },
    //新版样式
    contentTextStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          fontSize: "16",
        });
      },
    },
    contentTextAlign: {
      type: Object,
      default() {
        return {
          hAlign: "left",
          vAlign: "align-flex-start",
        };
      },
    },
    // 内容超长策略
    longStrategy: {
      type: String,
      default: "",
    },
    // 内边距
    padding: {
      type: Array,
      default: () => [6, 8, 6, 8],
    },
    borderConfig: {
      type: Object,
      default: () => ({}),
    },
    borderRadius: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    // 静态数据
    staticData: {
      type: Array,
      default() {
        return staticData;
      },
    },
    //文本框内容设置
    textContent: {
      type: String,
      default: '<label contenteditable="false" class="tag" real-value="value">value</label>',
    },
    //文本字段规则
    fieldsStyleRules: {
      type: Array,
      default() {
        return [];
      },
    },
    // 表格数据
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    // 鼠标移入显示全部文字
    isShowPopover:{
      type: Boolean,
      default: false
    },
    // 弹出框主题
    popoverStyleEffect:{
      type: String,
      default: 'dark'
    }
  },
  computed: {
    inputTextBoxWrapStyle() {
      let { borderConfig, contentPadding, borderRadius } = this;
      let style = {
        // padding: dsf.dataview.utils.transformArrayPx(contentPadding),
        ...borderConfig,
      };
      style["border-radius"] = dsf.dataview.utils.transformArrayPx(borderRadius);
      return style;
    },
    controlStyle() {
      let {width, height, marginAndPadding, margin: marginArray } = this;
      if (dsf.isNumber(width) || /^\d+$/g.test(width)) {
        width += "px";
      }
      let style = {
        width,
        ...marginAndPadding,
        overflow: "hidden",
        ...this.dvBackgroundFormat(this.controlBackgroundConfig, { isBgInfoVar: true }),
      };
      if (!this.isDesign) {
        style.height = dsf.dataview.utils.transformPx(height);
      } else {
        marginArray = [0, marginArray[1], 0, marginArray[3]];
        style.margin = dsf.dataview.utils.transformArrayPx(marginArray);
      }
      return style;
    },
    getScrollStyle() {
      return {
        pointerEvents: this.isDesign,
      }
    },
    popoverStyle(){
      let { contentTextStyle, contentTextAlign } = this;
      contentTextStyle = dsf.dataview.utils.transformTextStyle(contentTextStyle);
      let style = {
        textAlign: contentTextAlign.hAlign,
        ...contentTextStyle,
      };
      return style
    },
    spanStyle() {
      let { longStrategy, contentTextStyle, contentTextAlign } = this;
      contentTextStyle = dsf.dataview.utils.transformTextStyle(contentTextStyle);
      let style = {
        "white-space": "pre-wrap",
        overflow: "hidden",
        display: "inline-block",
        width: "100%",
        textAlign: contentTextAlign.hAlign,
        ...contentTextStyle,
        ...this.eventCursorPointerStyle
      };
      if (longStrategy) {
        style["text-overflow"] = "ellipsis";
        style["display"] = "-webkit-box";
        style["-webkit-box-orient"] = "vertical";
        style["-webkit-line-clamp"] = longStrategy;
      }
      return style;
    },
  },
  watch: {
    textContent() {
      if (this.isDesign) {
        this.dataFormatterHandler();
      }
    },
    fieldsStyleRules() {
      if (this.isDesign) {
        this.dataFormatterHandler();
      }
    },
  },
  data() {
    return {
      data: [],
      otherEvents: ["刷新", "显示", "隐藏", "设置内容"],
      content: "",
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
        textStyles: [this.contentTextStyle],
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [] } = config;
        this.updateComponentStyle("contentTextStyle", textStyles[0]);
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    itemClick() {
      this.loadClickEvents(this.data);
    },
    // 兼容属性
    compatibleProp() {
      // 兼容border
      this.compatibleBorderProp();
      this.compatibleTextStyleProp();
      this.compatiblePaddingProp()
    },
    compatiblePaddingProp(){
      if (this.$attrs.contentPadding){
        let padding = this.padding
        _.each(this.$attrs.contentPadding, (item,index) => {
          padding[index] = Number(this.padding[index]) + Number(item)
        })
        this.padding = padding
      }

    },
    compatibleTextStyleProp() {
      if (this.$attrs.fontColor) {
        const contentTextStyle = createCommonTextStyle({
          color: this.$attrs.fontColor,
          fontFamily: this.$attrs.fontFamily,
          fontSize: this.$attrs.titleFontSize,
          fontWeight: this.$attrs.isBold ? "bold" : "normal",
        });
        const contentTextAlign = {
          hAlign: this.$attrs.textAlign || "left",
          vAlign: this.$attrs.alignItem || "align-flex-start",
        };

        this.$emit("update:contentTextStyle", contentTextStyle);
        this.$emit("update:contentTextAlign", contentTextAlign);
      }
    },
    compatibleBorderProp() {
      let isShowBorder = this.$attrs.isShowBorder;
      let borderWidth = this.$attrs.borderWidth;
      let isBorderSolid = this.$attrs.isBorderSolid;
      let borderColor = this.$attrs.borderColor;
      let borderType = this.$attrs.borderType;
      if (isShowBorder) {
        let borderStyle = isBorderSolid ? "solid" : "dashed";
        let border = "border";
        if (borderType !== "all") {
          border += `-${borderType}`;
        }
        this.$emit("update:borderConfig", {
          [border]: `${borderWidth}px ${borderStyle} ${borderColor}`,
        });
      }
    },
    //设置内容伪代码
    handleSetContent(content) {
      this.content = content;
      return this;
    },
    dataFormatterHandler(data = this.serviceData) {
      if (Array.isArray(data)) {
        let obj = data[0];
        var html = dsf.dataview.utils.analyzeToolTipHTMLAttr(this.textContent, obj, "textBox", [], this.fieldsStyleRules);
        this.content = html;
      } else {
        this.content = "";
      }
    },
    dataAnalysis(data) {
      if (!data.length) {
        this.hasData = false;
        return;
      }
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        this.handleData(data);
      } else {
        if (this.$listeners["interceptOptions"]) {
          this.$dispatch("interceptOptions", { data: data, vm: this });
        } else {
          this.handleData(data);
        }
      }
    },
    handleData(data) {
      this.data = data.map((it, index) => {
        return {
          ...it,
          index: index + 1,
        };
      });
      this.dataFormatterHandler();
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/textBox.scss";
</style>

