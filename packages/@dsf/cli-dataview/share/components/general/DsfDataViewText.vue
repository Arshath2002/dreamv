<!--
 * @Description: 面板标题
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: shenah
 * @LastEditTime: 2025-01-21 15:37:55
-->

<template>
  <div
    class="data-view-item-wrap dsf-dv-text ds-control data-view-parent-slot-wrap"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
      ...getBoxShadowConfig(true),
    }">
    <div
      class="slot-top-left"
      v-if="isSlotTopLeft"
      :style="slotTopLeftStyle"
      slot-name="top-left"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <slot name="top-left"></slot>
    </div>
    <div
      class="slot-top-right"
      v-if="isSlotTopRight"
      :style="slotTopRightStyle"
      slot-name="top-right"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <slot name="top-right"></slot>
    </div>
    <div class="text-wrap data-view-common-bg-effect" :style="controlInnerStyle">
      <div
        class="main-title"
        @click="clickItem($event, analysisTitle)"
        @mouseenter="(e) => handleMouseEnter(analysisTitle, e)"
        @mouseleave="(e) => handleMouseLeave(analysisTitle, e)"
        v-html="analysisTitle"
        :style="mainTitleStyle"
      ></div>
      <div class="sub-title" v-if="showSubTitle" :style="subTitleStyle" v-html="analysisSubTitle"></div>
    </div>
  </div>
</template>
<script>
import slotPageManage from "_dataview/mixins/slotPageManage.js";
import textEvent from "_dataview/mixins/textEvent.js";
export default dsf.component({
  name: "DsfDataViewText",
  mixins: [$mixins.dataView, textEvent, slotPageManage],
  ctrlCaption: "标题组件",
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewPanelText",
    },
    height: {
      type: String,
      default: "40px",
    },
    width: {
      type: String,
      default: "100%",
    },
    slotTopLeftHeight: {
      type: String,
      default: "32px",
    },
    slotTopRightHeight: {
      type: String,
      default: "32px",
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
          {
            name: "top-left",
            controls: [],
          },
          {
            name: "top-right",
            controls: [],
          },
        ];
      },
    },
    subTitleDirect: {
      type: String,
      default: "row",
    },
    backgroundConfig: {
      type: Object,
      default: () => ({
        active: "pattern",
        pattern: {
          image: "/dataview/file/sdk/download?files=8f615900e6974d0c94806aaf69d201bf",
          size: "100% 100%",
          repeat: "no-repeat",
          position: "left center",
          width: "480",
          height: "34",
        },
      }),
    },
    // 主标题边距
    titlePadding: {
      type: Array,
      default: () => [0, 0, 0, 28],
    },
  },
  data() {
    return {
      componentType: "text",
    };
  },
  computed: {
    includeEvents() {
      return ["设置标题", "设置副标题"];
    },
    controlInnerStyle() {
      let style = {
        "flex-direction": this.subTitleDirect,
      };
      let height = dsf.dataview.utils.transformPx(this.height);
      if (height?.includes("%")) {
        style.height = "100%";
      }
      style.alignItems = this.subTitleDirect === "row" ? this.textAlignMap[this.titleTextAlign.vAlign] : this.textAlignMap[this.titleTextAlign.hAlign];
      style.justifyContent = this.subTitleDirect === "row" ? this.textAlignMap[this.titleTextAlign.hAlign] : this.textAlignMap[this.titleTextAlign.vAlign];
      return style;
    },
    controlStyle() {
      let { padding: paddingArray, color, height, width, margin: marginArray } = this;
      height = dsf.dataview.utils.transformPx(height);
      if (height?.includes("%")) {
        if (this.isDesign) {
          height = "100%";
        }
      }

      let padding = dsf.dataview.utils.transformArrayPx(paddingArray);
      let margin = dsf.dataview.utils.transformArrayPx(marginArray);
      let background = {};
      if (this.backgroundConfig) {
        background = this.dvBackgroundFormat(this.backgroundConfig, {
          isBgInfoVar: true,
        });
      }
      if (this.isDesign) {
        marginArray = [0, marginArray[1], 0, marginArray[3]];
        let margin = dsf.dataview.utils.transformArrayPx(marginArray);
        return {
          ...background,
          color,
          width: dsf.dataview.utils.transformPx(width),
          margin,
          height,
        };
      }

      return {
        ...background,
        color,
        width: dsf.dataview.utils.transformPx(width),
        padding,
        height,
        margin,
      };
    },
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.titleTextStyle, this.subTitleTextStyle],
        textAligns: [this.titleTextAlign],
        backgrounds: [this.backgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|背景|边框设置|入场动画/.test(it.name));
        const { textStyles = [], textAligns = [], backgrounds = [] } = config;
        this.updateComponentStyle("titleTextStyle", textStyles[0]);
        this.updateComponentStyle("subTitleTextStyle", textStyles[1]);
        this.updateComponentStyle("titleTextAlign", textAligns[0]);
        this.updateComponentStyle("backgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/text.scss";
</style>
