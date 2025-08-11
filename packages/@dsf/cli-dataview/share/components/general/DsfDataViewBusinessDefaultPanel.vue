<!--
 * @Description:自定义面板 
 * @Author: zhanghang
 * @Date: 2022-07-27 11:24:52
 * @LastEditors: shenah
 * @LastEditTime: 2025-01-21 15:50:07
-->
<template>
  <div
    class="dsf-dataview-default-panel ds-control data-view-item-wrap data-view-no-padding data-view-parent-slot-wrap"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
      ...getBoxShadowConfig(true),
    }"
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
      :style="slotTopRightStyle"
      slot-name="top-right"
      :class="{
        'slot-common-block-wrap': isDesign,
      }"
    >
      <slot name="top-right"></slot>
    </div>
    <div class="dsf-dataview-default-panel-box data-view-common-bg-effect">
      <div
        v-if="isHasHeader"
        class="default-panel-header"
        :style="$headWrapStyle"
      >
        <div class="default-panel-header-content data-view-common-bg-effect">
          <div
            class="default-panel-header-content-inner"
            :style="$headStyleInner"
          >
            <div
              class="default-panel-header-content__text"
              :style="titleStyle"
            >
              <slot name="left"></slot>
              <span
                @click="clickItem($event, analysisTitle)"
                :style="mainTitleStyle"
                @mouseenter="(e) => handleMouseEnter(analysisTitle, e)"
                @mouseleave="(e) => handleMouseLeave(analysisTitle, e)"
                :title="analysisTitle"
                class="text-span"
              >
                {{ analysisTitle }}
              </span>
              <span
                class="subHeading"
                v-if="showSubTitle"
                :style="subTitleStyle"
              >
                {{ analysisSubTitle }}
              </span>
            </div>
            <DsfIcon
              @click="clickMore(analysisTitle)"
              class="icon"
              :style="moreIconStyle"
              v-if="moreShow"
              :name="moreIcon"
            />
          </div>
        </div>
      </div>
      <div
        class="default_panel_content"
        :style="$slotStyle"
      >
        <div
          class="default_panel_content_inner data-view-common-bg-effect"
          slot-name="default"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import defaultBackgroundConfig from "_dataview/share/components/common/backgroundDefault.js";
import slotPageManage from "_dataview/mixins/slotPageManage.js";
import textEvent from "_dataview/mixins/textEvent.js";
import { eventTemp } from "_dataview/output/utils/relativeEvent";
export default dsf.component({
  name: "DsfDataViewBusinessDefaultPanel",
  ctrlCaption: "面板组件",
  mixins: [$mixins.dataView, textEvent, slotPageManage],
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewPanel",
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          click: {
            relatives: [],
            fn: eventTemp,
          },
          more: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移入事件
          mouseenter: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移除事件
          mouseleave: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
    //整体背景
    totalBackgroundConfig: {
      type: Object,
      default() {
        return { ...defaultBackgroundConfig };
      },
    },
    // 内容背景
    contentBackground: {
      type: Object,
      default() {
        return { ...defaultBackgroundConfig };
      },
    },
    // 内容外边距
    contentMargin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    contentPadding:{
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    titleHeight: {
      type: String,
      default: "40px",
    },
    titleBackgroundConfig: {
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
    margin: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    padding: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
    isHasHeader: {
      type: Boolean,
      default: true,
    },
    // 显示“更多”按钮
    moreShow: {
      type: Boolean,
      default: false,
    },
    // 更多按钮图标 icon名称
    moreIcon: {
      type: String,
      default: "gengduo",
    },
    iconSize: {
      type: [String, Number],
      default: 16,
    },
    iconColor: {
      type: String,
      default: "#606266",
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
    titlePadding: {
      type: Array,
      default: () => [0, 0, 0, 0],
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
    /* ---- 边框设置 ---- */
    borderConfig: {
      type: Object,
      default: () => ({}),
    },
    // 边框圆角
    borderRadius: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },
  },
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    this.compatibleProp();
  },
  computed: {
    transformIconSize() {
      return dsf.dataview.utils.transformPx(this.iconSize);
    },
    $slotStyle() {
      let background = this.dvBackgroundFormat(this.contentBackground, {
        isBgInfoVar: true,
      });
      return {
        margin: dsf.dataview.utils.transformArrayPx(this.contentMargin),
        padding: dsf.dataview.utils.transformArrayPx(this.contentPadding),
        ...background,
      };
    },
    controlStyle() {
      let { width, height, borderRadius, marginAndPadding, borderConfig } = this;
      let { margin, padding } = marginAndPadding;
      if (this.isDesign) {
        height = "100%";
      }
      let style = {
        margin,
        padding,
        height,
        width,
        ...borderConfig,
        ...this.dvBackgroundFormat(this.totalBackgroundConfig, {
          isBgInfoVar: true,
        }),
      };
      style["border-radius"] = dsf.dataview.utils.transformArrayPx(borderRadius);
      return style;
    },
    $headWrapStyle() {
      let { titleBackgroundConfig } = this;
      return {
        ...this.dvBackgroundFormat(titleBackgroundConfig, {
          isBgInfoVar: true,
        }),
      };
    },
    $headStyleInner() {
      return {
        height: dsf.dataview.utils.transformPx(this.titleHeight),
      };
    },
    titleStyle() {
      return {
        height: "100%",
        "align-items": this.textAlignMap[this.titleTextAlign.vAlign],
        "justify-content": this.textAlignMap[this.titleTextAlign.hAlign],
      };
    },
    moreIconStyle() {
      let style = { color: this.iconColor, 'font-size': this.transformIconSize };
      if (dsf.dataview.utils.isCursorPointer([this.eventRelativeDeal.more])) {
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
        backgrounds: [this.titleBackgroundConfig, this.contentBackground, this.totalBackgroundConfig],
      }
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name))
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|背景|边框设置|入场动画/.test(it.name));
        const { textStyles = [], textAligns = [], backgrounds = [] } = config;
        this.updateComponentStyle("titleTextStyle", textStyles[0]);
        this.updateComponentStyle("subTitleTextStyle", textStyles[1]);
        this.updateComponentStyle("titleTextAlign", textAligns[0]);
        this.updateComponentStyle("titleBackgroundConfig", backgrounds[0]);
        this.updateComponentStyle("contentBackground", backgrounds[1]);
        this.updateComponentStyle("totalBackgroundConfig", backgrounds[2]);
      }
      this.setComponentStyle(groups, config._props);
    },
    compatibleProp() {
      let slotArr = [];
      this.slots.forEach((item) => {
        slotArr.push(item);
      });
      let index = slotArr.findIndex((item) => item.name === "top-left");
      if (index === -1) {
        slotArr.push({
          name: "top-left",
          controls: [],
        });
      }
      this.$emit("update:slots", slotArr);
      this.compatibleBorderProp();
      this.compatibleEventRelativeDeal();
    },
    compatibleBorderProp() {
      this.commonBorderManageCompatible({
        isShowField: "isShowBorder",
        borderWidthField: "borderWidth",
        isBorderSolidField: "isBorderSolid",
        borderColorField: "borderColor",
        updateField: "borderConfig",
        updateCssField: "border",
      });
    },
    compatibleEventRelativeDeal() {
      let eventKeys = ["click", "more", "mouseenter", "mouseleave"];
      let events = {};
      eventKeys.forEach((key) => {
        if (this.eventRelativeDeal[key]) {
          events[key] = this.eventRelativeDeal[key];
        } else {
          events[key] = {
            relatives: [],
            fn: "",
          };
        }
      });
      this.$emit("update:eventRelativeDeal", events);
    },
    //更多的点击事件
    clickMore(text) {
      this.$dispatch("clickMore", text);
      this.loadMoreEvents(text);
    },
    //依赖组件关联方法
    loadMoreEvents(data) {
      let { fn } = this.eventRelativeDeal.more;
      this.handleCommonEmit(fn, data);
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/defaultPanel.scss";
</style>
