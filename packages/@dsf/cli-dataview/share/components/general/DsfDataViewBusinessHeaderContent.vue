<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-10-31 18:37:35
 * @LastEditors: shenah
 * @LastEditTime: 2025-01-21 15:46:20
-->
<!--头部横栏-->
<template>
  <div
    class="dsf-dataview-header-content data-view-item-wrap ds-control data-view-no-padding data-view-parent-slot-wrap"
    :style="headerContentStyle"
  >
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
      slot-name="top-right"
      :style="slotTopRightStyle"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <slot name="top-right"></slot>
    </div>
    <div
      class="img-content data-view-common-bg-effect"
      :style="$pageStyle"
    >
      <div
        class="title-style"
        @click="clickItem($event, analysisTitle)"
        @dblclick="dblitemClick"
        @mouseenter="(e) => handleMouseEnter(analysisTitle, e)"
        @mouseleave="(e) => handleMouseLeave(analysisTitle, e)"
        :style="titleStyle"
      >
        <div
          class="main-title"
          :style="mainTitleStyle"
        >{{ analysisTitle }}</div>
        <div
          class="sub-title"
          :style="subTitleStyle"
          v-if="showSubTitle"
        >{{ analysisSubTitle }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { createCommonTextStyle } from "_dataview/output/config/commonConfig.js";
import slotPageManage from "_dataview/mixins/slotPageManage.js";
import border from "_dataview/mixins/border.js";
import textEvent from "_dataview/mixins/textEvent.js";
export default dsf.component({
  name: "DsfDataViewBusinessHeaderContent",
  ctrlCaption: "页面标题",
  mixins: [$mixins.dataView, border, textEvent, slotPageManage],
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewHeaderContent",
    },
    height: {
      type: String,
      default: "70px",
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
    // 背景图片
    titleBackgroundConfig: {
      type: Object,
      default() {
        return {
          active: "pattern",
          pattern: {
            image: "/dataview/file/sdk/download?files=dcb0f074b6e14542bd32c9543ed5dc79",
            size: "contain",
            repeat: "no-repeat",
            position: "center",
            active: "pattern",
            width: "100%",
            height: "100%",
          },
        };
      },
    },
    titleTextStyle: {
      type: Object,
      default: () => createCommonTextStyle({ fontSize: 40 }),
    },
    titleTextAlign: {
      type: Object,
      default() {
        return {
          vAlign: "middle",
          hAlign: "center",
        };
      },
    },
    //标题排列方式
    subTitleDirect: {
      type: String,
      default: "column",
    },
  },
  data() {
    return {
      oldTitleStyle: {},
      clicktimer: null,
    };
  },
  computed: {
    headerContentStyle() {
      let style = {
        ...this.dvBackgroundFormat(this.titleBackgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.getBoxShadowConfig(true),
        ...this.getCommonEnterAnimateStyle,
      };
      return style;
    },
    $pageStyle() {
      let { controlStyle } = this;
      let style = {
        height: dsf.dataview.utils.transformPx(this.height),
        ...controlStyle,
      };
      return style;
    },
    titleStyle() {
      const style = {
        "flex-direction": this.subTitleDirect,
      };
      if (this.subTitleDirect === "column") {
        style["align-items"] = this.textAlignMap[this.titleTextAlign.hAlign];
        style["justify-content"] = this.textAlignMap[this.titleTextAlign.vAlign];
      } else {
        style["align-items"] = this.textAlignMap[this.titleTextAlign.vAlign];
        style["justify-content"] = this.textAlignMap[this.titleTextAlign.hAlign];
      }
      if (dsf.dataview.utils.isCursorPointer([this.eventRelativeDeal.click])) {
        style["cursor"] = "pointer";
      }
      return style;
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
        backgrounds: [this.titleBackgroundConfig],
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
        this.updateComponentStyle("titleBackgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
    },
    clickItem() {
      clearTimeout(this.clicktimer);
      this.clicktimer = setTimeout(() => {
        this.$dispatch("clickItem");
      }, 300);
      this.loadClickEvents(this.title);
    },
    dblitemClick() {
      clearTimeout(this.clicktimer);
      if (this.$listeners["dblitemClick"]) {
        this.$dispatch("dblitemClick");
      }
    },
    beforeChangeStyle() {
      // 因为要保持之前的字号不变,存一个原来的
      this.oldTextStyle = this.titleTextStyle;
    },
    afterChangeStyle() {
      // 还原之前的fontSize
      let fontSize = this.oldTextStyle.fontSize;
      this.titleTextStyle.fontSize = fontSize;
      this.$emit("update:titleTextStyle", this.titleTextStyle);
    },
  },
  watch: {},
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/headerContent.scss";
</style>
