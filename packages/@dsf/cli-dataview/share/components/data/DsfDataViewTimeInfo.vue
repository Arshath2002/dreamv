<!--
 * @Description: 时间轴详细
 * @Author: shenah
 * @Date: 2024-12-23 10:27:31
 * @LastEditors: shenah
 * @LastEditTime: 2025-01-20 14:26:17
-->

<template>
  <div
    class="dsf-dv-time-info data-view-item-wrap ds-control data-view-no-padding"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    :style="dsfDvTimeInfoStyle"
  >
    <dsf-empty-data v-if="!hasData"></dsf-empty-data>
    <div class="time-info-inner data-view-common-bg-effect">
      <!-- 竖向时间轴 -->
      <div
        class="time-info-vertical"
        v-if="direction === 'vertical' && (isShowTextContent || isShowTime)"
        :style="scrollStyleConfigStyle"
      >
        <div v-for="item in data" :key="item.uuid" class="time-info-item">
          <!-- 线 -->
          <div class="line" :style="lineStyle"></div>
          <div class="time-point-wrap">
            <div class="point" :style="pointStyle"></div>
            <div
              class="time"
              v-if="isShowTime"
              :style="timeStyle"
              @mouseenter="(e) => handleMouseEnter(item, e)"
              @mouseleave="(e) => handleMouseLeave(item, e)"
              @click="itemClick($event, item, 'time')"
            >
              {{ item.time }}
            </div>
          </div>
          <div class="time-content-wrap" v-if="isShowTextContent">
            <div
              class="content"
              :style="textContentStyle"
              @mouseenter="(e) => handleMouseEnter(item, e)"
              @mouseleave="(e) => handleMouseLeave(item, e)"
              @click="itemClick($event, item, 'content')"
            >
              <DsfDataViewTextBox
                dataType="static"
                :staticData="[item]"
                :contentTextStyle="contentTextStyle"
                :textContent="textContent"
                :fieldsStyleRules="fieldsStyleRules"
                :contentTextAlign="contentTextAlign"
                :longStrategy="longStrategy"
                :isShowPopover="isShowPopover"
                :isDesign="isDesign"
                :padding="[0, 0, 0, 0]"
                :margin="[0, 0, 0, 0]"
              ></DsfDataViewTextBox>
            </div>
          </div>
        </div>
      </div>
      <!-- 横向时间轴 -->
      <div
        class="time-info-horizontal"
        v-else-if="
          direction === 'horizontal' && (isShowTextContent || isShowTime)
        "
        :style="scrollStyleConfigStyle"
      >
        <div class="time-info-item" v-for="item in data" :key="item.uuid">
          <div
            class="content"
            :style="textContentStyle"
            v-if="isShowTextContent"
            @mouseenter="(e) => handleMouseEnter(item, e)"
            @mouseleave="(e) => handleMouseLeave(item, e)"
            @click="itemClick($event, item, 'content')"
          >
            <DsfDataViewTextBox
              dataType="static"
              :staticData="[item]"
              :contentTextStyle="contentTextStyle"
              :textContent="textContent"
              :fieldsStyleRules="fieldsStyleRules"
              :contentTextAlign="contentTextAlign"
              :longStrategy="longStrategy"
              :isShowPopover="isShowPopover"
              :isDesign="isDesign"
              :padding="[0, 0, 0, 0]"
              :margin="[0, 0, 0, 0]"
            ></DsfDataViewTextBox>
          </div>
          <div class="point-wrap">
            <div class="point" :style="pointStyle"></div>
            <div class="line" :style="lineStyle"></div>
          </div>
          <div
            class="time"
            :style="timeStyle"
            v-if="isShowTime"
            @mouseenter="(e) => handleMouseEnter(item, e)"
            @mouseleave="(e) => handleMouseLeave(item, e)"
            @click="itemClick($event, item, 'time')"
          >
            {{ item.time }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const staticDataKeyDic = {
  time: "时间",
  title: "标题",
  des: "描述",
};
const staticData = [
  {
    time: "2024-12-30",
    title: "标题名称标题名称标题名称标题名称标题名称",
    des: "沈老师 提交于 2024-12-30 06:08",
  },
  {
    time: "2024-12-26",
    title: "标题名称标题名称标题名称标题名称标题名称",
    des: "张老师 提交于 2024-12-26 14:20",
  },
  {
    time: "2024-12-11",
    title: "标题名称标题名称标题名称标题名称标题名称",
    des: "孔老师 提交于 2024-12-11 20:00",
  },
  {
    time: "2024-12-04",
    title: "标题名称标题名称标题名称标题名称标题名称",
    des: "贺老师 提交于 2024-12-04 17:51",
  },
];
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import {
  createCommonTextStyle,
  createFieldFontStyleRules,
} from "_dataview/output/config/commonConfig.js";
import createBackground from "_dataview/output/config/backgroundExtend.js";
import scrollMixins from "./common/scrollMixins";
export default dsf.component({
  name: "DsfDataViewTimeInfo",
  ctrlCaption: "时间轴",
  mixins: [$mixins.dataView, dataAnalysis, scrollMixins],
  components: {},
  props: {
    relationStyle: {
      type: Boolean,
      default: true,
    },
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewTimeInfo",
    },
    padding: {
      type: Array,
      default: () => [30, 20, 30, 20],
    },
    // 滚动条配置项
    scrollStyleConfig: {
      type: Object,
      default: () => ({
        isShowHScroll: false, // 用于属性中的显示
        isCustomStyle: false, // 自定义滚动条样式
        "--dv-time-info-scroll-is-h-hover-show": false, // 是否悬浮显示
        "--dv-time-info-scroll-is-h-display": "block", // 是否悬浮显示
        "--dv-time-info-scroll-w-h": 10,
        "--dv-time-info-scroll-thumb-border-radius": "5px",
        "--dv-time-info-scroll-thumb-bg": "rgba(140, 140, 140, 0.14)",
        "--dv-time-info-scroll-track-border-radius": "0px",
        "--dv-time-info-scroll-track-bg": "rgba(133, 133, 133, 0.05)",
      }),
    },
    direction: {
      type: String,
      default: "vertical", // vertical 竖向 horizontal 横向
    },
    pointConfig: {
      // 点的配置
      type: Object,
      default: () => ({
        color: "#FFD37E",
        size: 10,
        borderConfig: {
          commonBorderWidth: 1,
          commonBorderColor: "#077abd",
          commonBorderStyle: "solid",
        },
      }),
    },
    lineConfig: {
      // 线的配置
      type: Object,
      default: () => ({
        color: "#FFD37E",
        width: 1,
      }),
    },
    isShowTime: {
      type: Boolean,
      default: true,
    },
    timeConfigStyle: {
      // 时间样式
      type: Object,
      default: () => createCommonTextStyle({ fontSize: 14, color: "#FFD37E" }),
    },
    timeSpace: {
      type: Number,
      default: 28,
    },
    isShowTextContent: {
      type: Boolean,
      default: true,
    },
    textContent: {
      // 富文本内容
      type: String,
      default:
        '<label contenteditable="false" class="tag" real-value="title">title</label><br/><label contenteditable="false" class="tag" real-value="des">des</label>',
    },
    fieldsStyleRules: {
      type: Array,
      default() {
        return [
          createFieldFontStyleRules({
            valueName: "title",
            style: {
              color: "rgba(255,255,255,1)",
            },
          }),
        ];
      },
    },
    contentTextStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          fontSize: "12",
          color: "#D1C59F",
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
    textContentWidth: {
      type: String,
      default: "100%",
    },
    textContentHeight: {
      type: String,
      default: "auto",
    },
    textContentBackground: {
      type: Object,
      default: () => createBackground(),
    },
    textContentPadding: {
      type: Array,
      default: () => [16, 16, 16, 16],
    },
    textContentMargin: {
      type: Array,
      default: () => [10, 10, 20, 38],
    },
    textContentBorderConfig: {
      type: Object,
      default: () => ({
        border: "1px solid #FFD37E",
        commonBorderWidth: 1,
        commonBorderColor: "#FFD37E",
        commonBorderStyle: "solid",
      }),
    },
    textContentBorderRadius: {
      type: Array,
      default() {
        return [10, 10, 10, 10];
      },
    },
    // 内容超长策略
    longStrategy: {
      type: String,
      default: "",
    },
    // 鼠标移入显示全部文字
    isShowPopover: {
      type: Boolean,
      default: false,
    },
    backgroundConfig: {
      type: Object,
      default: () => createBackground(),
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(
          staticData,
          staticDataKeyDic
        );
      },
    },
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "时间",
            value: "time",
            map: "time",
          },
          {
            text: "标题",
            value: "title",
            map: "title",
          },
          {
            text: "描述",
            value: "des",
            map: "des",
          },
        ];
      },
    },
  },
  computed: {
    dsfDvTimeInfoStyle() {
      return {
        ...this.controlStyle,
        ...this.dvBackgroundFormat(this.backgroundConfig, {
          isBgInfoVar: true,
        }),
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
    },
    pointStyle() {
      let size = dsf.dataview.utils.transformPx(this.pointConfig.size);
      let color = this.pointConfig.color;
      let borderConfig = this.pointConfig.borderConfig;
      return {
        width: size,
        height: size,
        backgroundColor: color,
        ...borderConfig,
      };
    },
    lineStyle() {
      let width = this.lineConfig.width;
      let left = (this.pointConfig.size - width) / 2;
      let color = this.lineConfig.color;
      let top = this.timeElHeight / (this.isDesign ? 2 : 4);
      let style = {
        backgroundColor: color,
      };
      if (this.direction === "vertical") {
        style.top = dsf.dataview.utils.transformPx(top);
        style.left = dsf.dataview.utils.transformPx(left);
        style.width = dsf.dataview.utils.transformPx(width);
      } else {
        style.height = dsf.dataview.utils.transformPx(width);
      }
      return style;
    },
    timeStyle() {
      let textStyle = dsf.dataview.utils.transformTextStyle(
        this.timeConfigStyle
      );
      let style = {
        ...textStyle,
        ...this.eventCursorPointerStyle,
      };
      let space = dsf.dataview.utils.transformPx(this.timeSpace);
      if (this.direction === "vertical") {
        style.marginLeft = space;
      } else {
        style.marginTop = space;
      }
      return style;
    },
    textContentStyle() {
      let padding = dsf.dataview.utils.transformArrayPx(
        this.textContentPadding
      );
      let margin = dsf.dataview.utils.transformArrayPx(this.textContentMargin);
      let borderRadius = dsf.dataview.utils.transformArrayPx(
        this.textContentBorderRadius
      );
      let background = this.dvBackgroundFormat(this.textContentBackground);
      let width = dsf.dataview.utils.transformPx(this.textContentWidth);
      let height = dsf.dataview.utils.transformPx(this.textContentHeight);
      if (this.direction === "horizontal" && height === "auto") {
        height = "100%";
      }
      return {
        width,
        height,
        padding,
        margin,
        ...this.textContentBorderConfig,
        borderRadius,
        ...background,
        ...this.eventCursorPointerStyle,
      };
    },
    scrollStyleConfigStyle() {
      let scrollStyleConfig = {
      };
      if (this.scrollStyleConfig.isCustomStyle) {
        scrollStyleConfig = {
          ...this.scrollStyleConfig,
        };
        scrollStyleConfig[
          "--dv-time-info-scroll-w-h"
        ] = dsf.dataview.utils.transformPx(
          scrollStyleConfig["--dv-time-info-scroll-w-h"]
        );
        scrollStyleConfig[
          "--dv-time-info-scroll-thumb-border-radius"
        ] = dsf.dataview.utils.transformArrayPx(
          scrollStyleConfig["--dv-time-info-scroll-thumb-border-radius"]
        );
        scrollStyleConfig[
          "--dv-time-info-scroll-track-border-radius"
        ] = dsf.dataview.utils.transformArrayPx(
          scrollStyleConfig["--dv-time-info-scroll-track-border-radius"]
        );
        scrollStyleConfig[
          "--dv-time-info-scroll-is-h-display"
        ] = scrollStyleConfig["--dv-time-info-scroll-is-h-hover-show"]
          ? "none"
          : "block";
      }
      return scrollStyleConfig;
    },
  },
  watch: {
    "timeConfigStyle.fontSize": {
      handler() {
        this.getRelWidth();
      },
    },
    direction(newVal) {
      this.judgeScrollType(newVal);
      if (newVal === "horizontal") {
        this.$emit("update:timeSpace", 4);
        this.$emit("update:textContentMargin", [0, 10, 10, 0]);
        this.$emit("update:textContentPadding", [12, 16, 12, 16]);
        this.$emit("update:textContentWidth", "210");
        this.$emit("update:textContentHeight", "100");
      } else {
        this.$emit("update:timeSpace", 28);
        this.$emit("update:textContentMargin", [10, 10, 20, 38]);
        this.$emit("update:textContentPadding", [16, 16, 16, 16]);
        this.$emit("update:textContentWidth", "100%");
        this.$emit("update:textContentHeight", "auto");
      }
    },
  },
  data() {
    return {
      timeElHeight: 0,
    };
  },
  created() {
    this.judgeScrollType(this.direction);
  },
  beforeDestroy() {},
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.timeConfigStyle, this.contentTextStyle],
        textAligns: [this.contentTextAlign],
        backgrounds: [this.backgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter(it => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter(it => /布局|边框设置|背景|入场动画|滚动设置/.test(it.name));
        const { textStyles = [], textAligns = [], backgrounds = [] } = config;
        this.updateComponentStyle("timeConfigStyle", textStyles[0]);
        this.updateComponentStyle("contentTextStyle", textStyles[1]);
        this.updateComponentStyle("contentTextAlign", textAligns[0]);
        this.updateComponentStyle("backgroundConfig", backgrounds[0]);
      }
      this.setComponentStyle(groups, config._props);
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
    judgeScrollType(direction) {
      if (direction === "horizontal") {
        this.$emit("update:isHorizontalScroll", true);
      } else {
        this.$emit("update:isHorizontalScroll", false);
      }
    },
    handleData(data) {
      let timeField = this.mapRelations[0].map;
      let titleField = this.mapRelations[1].map;
      let desField = this.mapRelations[2].map;
      if (this.dataType === "static") {
        timeField = "time";
        titleField = "title";
        desField = "des";
      }
      this.data = data.map((item) => {
        let newObj = {
          ...item,
          uuid: dsf.uuid(),
          time: item[timeField],
          title: item[titleField],
          des: item[desField],
        };
        return newObj;
      });
      this.getRelWidth();
      if (this.isScroll) {
        this.animation(true);
      }
    },
    getRelWidth() {
      this.$nextTick(() => {
        let el = this.$el.querySelector(".time-point-wrap");
        if (el) {
          this.timeElHeight = el.offsetHeight;
        }
      });
    },
    getScrollerEl() {
      let el = this.$el.querySelector(".time-info-vertical");
      if (this.direction === "horizontal") {
        el = this.$el.querySelector(".time-info-horizontal");
      }
      return el;
    },
    itemClick(event, item, type) {
      const obj = {
        ...item,
        clickType: type,
      };
      this.$dispatch("clickItem", obj);
      this.loadClickEvents(obj, event);
    },
    //主题切换
    styleConfigCallback(styleObj, theme) {
      if (styleObj && theme) {
        Object.keys(styleObj).forEach((key) => {
          let val = styleObj[key];
          if (key === "textContentBorderConfig") {
            // 内容边框
            let textContentBorderConfig = this.textContentBorderConfig;
            textContentBorderConfig.commonBorderColor = val.commonBorderColor;
            if (textContentBorderConfig.border) {
              textContentBorderConfig.border = `${textContentBorderConfig.commonBorderWidth}px ${textContentBorderConfig.commonBorderStyle} ${textContentBorderConfig.commonBorderColor}`;
            }
            this.$emit(`update:${key}`, textContentBorderConfig);
          } else if (key === "fieldsStyleRules") {
            let fieldsStyleRules = this.fieldsStyleRules;
            let titleField = this.mapRelations[1].map;
            let one = fieldsStyleRules.find(
              (item) => item.valueName === titleField
            );
            if (one) {
              one.style.color = val.color;
              this.$emit(`update:${key}`, []);
              this.$nextTick(() => {
                this.$emit(`update:${key}`, fieldsStyleRules);
              });
            }
          } else {
            let nowVal = val;
            if (nowVal && typeof nowVal === "object") {
              nowVal = dsf.mix(true, {}, this[key], nowVal);
            }
            this.$emit(`update:${key}`, nowVal);
          }
        });
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/timeInfo.scss";
</style>
