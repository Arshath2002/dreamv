<!--
 * @Description: 
 * @Author: shenah
 * @Date: 2024-03-25 09:19:12
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-23 16:46:43
-->
<template>
  <div
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    :style="allTableWrapStyle()"
    class="dsf-large-screen-table-wrap data-view-item-wrap ds-control data-view-no-padding"
  >
    <div class="dsf-large-screen-table" :ref="ref" :style="allTableStyle()" :class="{ 'large-h-scroll-custom': scrollStyleConfig.isCustomStyle }">
      <div class="title-slot" ref="title-slot" :style="`height: ${config.slotHeight}px;`">
        <slot name="title"></slot>
      </div>
      <dsf-empty-data v-if="!hasData"></dsf-empty-data>
      <template v-else>
        <!-- 头部 -->
        <tableHeaderVue
          ref="tableHeaderVue"
          :header="orgHeader"
          :themeStyleName="themeStyleName"
          :isShowHeader="newHeaderConfig.isShowHeader"
          :getHeaderWrapItem="getHeaderWrapItem"
          :handleSort="handleSort"
          :getHeaderNameStyle="getHeaderNameStyle"
          :getFilterItemStyle="getFilterItemStyle"
          :getIconFilterItemStyle="getIconFilterItemStyle"
          :widths="widths"
          :headerBGC="headerBGC"
          :getHeaderItem="getHeaderItem"
          :config="config"
        >
          <template v-for="slot in tableSlot" v-slot:[slot.headerSlotName]>
            <slot :name="slot.headerSlotName" :header="slot" :rows="data"></slot>
          </template>
        </tableHeaderVue>
        <div v-if="config" class="rows" :style="`height: ${height - (newHeaderConfig.isShowHeader && header.length ? newHeaderConfig.headerHeight : 0)}px;font-family:${newContentConfig.fontFamily};`">
          <template v-if="!dataLoad && !data.length">
            <DsfEmptyData />
          </template>
          <template v-else-if="isLoopScroll">
            <loopScroller class="dsf-dv-table-scroller scroller" v-bind="loopScrollOptions">
              <largeTableRowItem
                v-for="row in data"
                :class="{
                  'active-row-item': activeRowIndex === row.rowIndex,
                }"
                class="row-item"
                :style="getRowItemStyle"
                :row="row"
                :header="header"
                :widths="widths"
                :contentConfig="newContentConfig"
                :sequenceConfig="indexAttrConfig"
                :hasBorder="isShowContentBorder"
                :borderConfig="contentBorderBottomConfig"
                :isFixedHeight="config.fixEachRowHeightFlag"
                :rowItemBgStyle="rowItemBgStyle"
                :key="row.id"
                :barAutoCalcMax="barAutoCalcMaxObj"
                @clickItem="clickItem"
                @handleRowItemMouseEnter="({ e, row }) => handleRowItemMouseEnter(e, row)"
                @handleRowMouseLeave="({ e, row, ri }) => handleRowMouseLeave(e, row, ri)"
              >
                <template v-for="slotName in tableCeilSlot" #[slotName]="scopedData">
                  <slot :name="slotName" v-bind="scopedData"></slot>
                </template>
              </largeTableRowItem>
            </loopScroller>
          </template>
          <template v-else-if="isVirtualTable">
            <RecycleScroller :items="data" :item-size="fixEachRowHeight" v-slot="{ item: row }" class="dsf-dv-table-scroller scroller">
              <largeTableRowItem
                :class="{
                  'active-row-item': activeRowIndex === row.rowIndex,
                }"
                class="row-item"
                :style="getRowItemStyle"
                :row="row"
                :header="header"
                :widths="widths"
                :contentConfig="newContentConfig"
                :sequenceConfig="indexAttrConfig"
                :hasBorder="isShowContentBorder"
                :borderConfig="contentBorderBottomConfig"
                :isFixedHeight="config.fixEachRowHeightFlag"
                :rowItemBgStyle="rowItemBgStyle"
                :barAutoCalcMax="barAutoCalcMaxObj"
                @clickItem="clickItem"
                @handleRowItemMouseEnter="({ e, row }) => handleRowItemMouseEnter(e, row)"
                @handleRowMouseLeave="({ e, row, ri }) => handleRowMouseLeave(e, row, ri)"
              >
                <template v-for="slotName in tableCeilSlot" #[slotName]="scopedData">
                  <slot :name="slotName" v-bind="scopedData"></slot>
                </template>
              </largeTableRowItem>
            </RecycleScroller>
          </template>
          <template v-else>
            <div class="dsf-dv-table-scroller scroller">
              <largeTableRowItem
                v-for="row in data"
                :class="{
                  'active-row-item': activeRowIndex === row.rowIndex,
                }"
                class="row-item"
                :style="getRowItemStyle"
                :row="row"
                :header="header"
                :widths="widths"
                :contentConfig="newContentConfig"
                :sequenceConfig="indexAttrConfig"
                :hasBorder="isShowContentBorder"
                :borderConfig="contentBorderBottomConfig"
                :isFixedHeight="config.fixEachRowHeightFlag"
                :rowItemBgStyle="rowItemBgStyle"
                :key="row.id"
                :barAutoCalcMax="barAutoCalcMaxObj"
                @clickItem="clickItem"
                @handleRowItemMouseEnter="({ e, row }) => handleRowItemMouseEnter(e, row)"
                @handleRowMouseLeave="({ e, row, ri }) => handleRowMouseLeave(e, row, ri)"
              >
                <template v-for="slotName in tableCeilSlot" #[slotName]="scopedData">
                  <slot :name="slotName" v-bind="scopedData"></slot>
                </template>
              </largeTableRowItem>
            </div>
          </template>
        </div>
      </template>
      <Pagination v-if="isShowPage" :config="pageConfig" :selectTheme="selectTheme" :total="pageTotal" :allowPageDataType="allowPageDataType" height="auto" @pageChange="pageChange"></Pagination>
    </div>
  </div>
</template>
<script>
import { createTableHeadData } from "_dataview/output/config/tableConfig.js";
import createBackground from "_dataview/output/config/backgroundExtend.js";
import tableHeaderVue from "./tableHeader.vue";
import dvTable from "_dataview/mixins/dvTable.js";
import themeMixin from "_dataview/mixins/moreThemeMixin.js";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import largeTableRowItem from "./largeTableRowItem.vue";
import loopScroller from "../common/loopScroller.vue";
const staticExcelDataDic = {
  name: "企业名称",
  value: "营收收入(亿元)",
  percent: "同比增速(%)",
};
const staticExcelData = [
  {
    name: "北京京东世纪贸易有限公司",
    value: "7046.2",
    percent: "4.5",
  },
  {
    name: "国家电网有限公司",
    value: "5150.7",
    percent: "50",
  },
  {
    name: "中国投资有限责任公司",
    value: "5432.2",
    percent: "18.5",
  },
  {
    name: "中国限责任公司",
    value: "111.2",
    percent: "30.5",
  },
];

const headData = Object.values(staticExcelDataDic).map((it, index) => {
  let map = ["name", "value", "percent"];
  let nowData = createTableHeadData();
  nowData.map = map[index];
  nowData.label = it;
  return nowData;
});

export default dsf.component({
  name: "DsfDataViewLargeTable",
  ctrlCaption: "表格",
  provide() {
    return {
      Table: this,
    };
  },
  components: {
    tableHeaderVue,
    largeTableRowItem,
    RecycleScroller,
    loopScroller,
  },
  mixins: [dvTable, themeMixin],
  props: {
    isLoopScroll: {
      type: Boolean,
      default: false,
    },
    loopScrollOptions: {
      type: Object,
      default() {
        return {};
      },
    },
    isVirtualTable: {
      type: Boolean,
      default: false,
    },
    isScroll: {
      type: Boolean,
      default: false,
    },
    scrollSpeed: {
      type: [Number, String],
      default: 0.4,
    },
    scrollHoverPause: {
      type: Boolean,
      default: true,
    },
    scrollTime: {
      type: Number,
      default: 2000,
    },
    //表头数据
    headData: {
      type: Array,
      default() {
        return headData;
      },
    },
    staticData: {
      type: Array,
      default: () => staticExcelData,
    },
    indexAttrConfig: {
      type: Object,
      default: () => ({
        width: "28px",
        height: "28px",
        fontSize: "16px",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        showContent: "number",
        borderRadius: [0, 0, 0, 0],
        bgColors: ["#F28E48", "#FFC32B", "#358FF8", "#385376"],
        fontColors: ["#ffffff"],
        iconColors: ["#ffffff"],
        icons: [],
        images: [],
        indexHeader: "序号",
        map: "rowIndex",
        indexWidth: 50,
        vAlign: "center",
      }),
    },
    config: {
      type: Object,
      default() {
        return {
          rowNum: 5,
          fixEachRowHeight: 35,
          waitTime: 2000,
          slotHeight: 0,
          fixEachRowType: "fixHeight",
          carousel: "single",
          hoverPause: true,
          fixEachRowHeightFlag: true,
        };
      },
    },
    borderBottomRadius: {
      type: String,
      default: "0px",
    },
    // 整体背景
    controlBackgroundConfig: {
      type: Object,
      default: () => createBackground(),
    },
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticExcelData, staticExcelDataDic);
      },
    },
  },
  data() {
    return {
      scrollTop: 0,
      ref: "dsf-large-screen-table",
      componentRef: "dsf-large-screen-table",
      data: [],
      barWidth: "100%",
      excelNameHeader: [],
      header: [],
      orgHeader: [],
      otherEvents: ["刷新", "还原数据", "追加数据", "删除数据", "显示", "隐藏", "显示列", "隐藏列", "获取列", "获取行"],
      fixEachRowHeight: 30,
      widths: [],
      heights: [],
      avgHeight: 0,
      aligns: [],
      updater: 0,
      isInit: true,
      needCalc: false,
      scrollerTimer: null,
    };
  },
  watch: {
    isScroll(val) {
      this.resetAnimation();
      if (val) {
        this.animation();
      }
    },
    isVirtualTable(v) {
      // 如果是虚拟列表，则高度固定
      if (v) {
        this.config.fixEachRowHeightFlag = true;
      }
    },
  },
  computed: {
    getRowItemStyle() {
      let obj = {
        height: this.config.fixEachRowHeightFlag ? `${this.fixEachRowHeight}px` : "auto",
        "line-height": this.config.fixEachRowHeightFlag ? `${this.fixEachRowHeight}px` : "auto",
        fontWeight: this.newContentConfig.fontWeight,
        fontStyle: this.newContentConfig.fontStyle,
        marginBottom: this.lineSpaceInfo.space + "px",
      };
      let contentBorder = this.contentBorderBottomConfig.borderBottom;
      obj["border-bottom"] = contentBorder;
      if (!this.config.fixEachRowHeightFlag) {
        obj["align-items"] = "stretch";
      }
      if (dsf.dataview.utils.isCursorPointer([this.eventRelativeDeal.click, this.eventRelativeDeal.clickCell]) || this.isHighlightCurrentRow) {
        obj["cursor"] = "pointer";
      }
      return obj;
    },
    tableCeilSlot() {
      return this.header.map((h) => h.slotName).filter((it) => it);
    },
  },
  mounted() {
    // 检查是否存在没有的话就更新
    if (!this.config.fixEachRowType) {
      this.$set(this.config, "fixEachRowType", "rowNum");
      this.$set(this.config, "fixEachRowHeight", 35);
    }
  },

  beforeDestroy() {
    cancelAnimationFrame(this.animationHandler);
    clearTimeout(this.scrollerTimer);
    this.getScrollerEl()?.removeEventListener("scroll", this.scrollListenerEvent);
    this.getScrollerEl()?.removeEventListener("mousewheel", this.mousewheelListenerEvent);
  },
  methods: {
    textStyleProxy(target, values = null, isHead = false) {
      if (values) {
        if (isHead) {
          if (values.fontWeight) target.headerFontWeight = values.fontWeight;
          if (values.fontStyle) target.headerFontStyle = values.fontStyle;
          if (values.textDecoration) target.headerTextDecoration = values.textDecoration;
          if (values.textShadow) target.headerTextShadow = values.textShadow;
          if (values.fontSize) target.headerFontSize = values.fontSize;
          if (values.color) target.headerColor = values.color;
        } else {
          if (values.fontWeight) target.fontWeight = values.fontWeight;
          if (values.fontStyle) target.fontStyle = values.fontStyle;
          if (values.textDecoration) target.textDecoration = values.textDecoration;
          if (values.textShadow) target.textShadow = values.textShadow;
          if (values.fontSize) target.fontSize = values.fontSize;
          if (values.color) target.color = values.color;
        }
      } else {
        if (isHead) {
          return {
            fontWeight: target.headerFontWeight || this.newHeaderConfig.fontWeight,
            fontStyle: target.headerFontStyle || this.newHeaderConfig.fontStyle,
            textDecoration: target.headerTextDecoration || this.newHeaderConfig.textDecoration,
            textShadow: target.headerTextShadow || this.newHeaderConfig.textShadow,
            fontSize: parseInt(target.fontSize || this.newHeaderConfig.fontSize),
            color: target.headerColor || this.newHeaderConfig.color,
          };
        } else {
          return {
            fontWeight: target.fontWeight || this.newContentConfig.fontWeight,
            fontStyle: target.fontStyle || this.newContentConfig.fontStyle,
            textDecoration: target.textDecoration || this.newContentConfig.textDecoration,
            textShadow: target.textShadow || this.newContentConfig.textShadow,
            fontSize: parseInt(target.fontSize || this.newContentConfig.fontSize),
            color: target.color === "inherit" ? this.newContentConfig.color : target.color,
          };
        }
      }
    },
    // 设置组件样式
    setComponentStyle(groups, props) {
      groups.forEach((group) => {
        group.attributes.forEach((attr) => {
          // headData 含有映射信息，需要特殊处理
          if (attr.bindControlAttr === "headData") {
            const min = Math.min(this.headData.length, props.headData.length);
            for (let i = 0; i < min; i++) {
              props.headData[i].map = this.headData[i].map;
              props.headData[i].label = this.headData[i].label;
            }
            if (this.headData.length < props.headData.length) {
              props.headData = props.headData.slice(0, min);
            } else {
              props.headData = [...props.headData, ...this.headData.slice(min)];
            }
            this.updateComponentStyle(attr.bindControlAttr, null, props);
          } else if (attr.bindControlAttr && !attr.noCopy) {
            this.updateComponentStyle(attr.bindControlAttr, null, props);
          } else if (attr.showType === "dv_margins_group") {
            attr.config.options.forEach((it) => {
              this.updateComponentStyle(it.bindControlAttr, null, props);
            });
          }
        });
      });
    },
    // 复制组件样式
    copyComponentStyle() {
      const textStyles = [this.textStyleProxy(this.newHeaderConfig), this.textStyleProxy(this.newContentConfig)];
      for (let i = 0; i < this.headData.length; i++) {
        const it = this.headData[i];
        textStyles.push(this.textStyleProxy(it, null, true), this.textStyleProxy(it));
      }
      return {
        _props: this.getComponentStyle(),
        numberConfig: this.indexAttrConfig,
        // 固定为数组格式，按主、次顺序
        textStyles,
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        const { numberConfig, textStyles = [], backgrounds = [] } = config;
        groups = groups.filter((it) => /布局|边框设置|背景|入场动画|滚动设置/.test(it.name));
        if (numberConfig) {
          numberConfig.map = this.indexAttrConfig.map; // 不改变映射
          this.updateComponentStyle("indexAttrConfig", numberConfig);
        }
        this.updateComponentStyle("controlBackgroundConfig", backgrounds[0]);
        const [headerConfig, contentConfig, ...restTextStyles] = textStyles;
        this.updateComponentStyle("newHeaderConfig", headerConfig);
        this.updateComponentStyle("newContentConfig", contentConfig);
        for (let i = 0; i < restTextStyles.length && i < this.headData.length * 2; i++) {
          this.textStyleProxy(this.headData[Math.floor(i / 2)], restTextStyles[i], i % 2 == 0);
        }
      }
      this.setComponentStyle(groups, config._props);
    },
    scrollEvent(e) {
      this.scrollTop = e.target.scrollTop;
      this.$emit("scrollEvent", e);
    },

    //计算行高
    calcHeights() {
      const avgHeight = this.dealAvgHeight();
      let fixEachRowHeightFlag = this.config.fixEachRowHeightFlag;
      let height = this.config.fixEachRowHeight;
      this.fixEachRowHeight = null;
      if (fixEachRowHeightFlag) {
        if (this.config.fixEachRowType === "fixHeight") {
          this.fixEachRowHeight = height || 35;
        } else {
          if (fixEachRowHeightFlag && avgHeight > 0) {
            this.fixEachRowHeight = _.round(avgHeight, 1);
          }
        }
      }
    },

    clickItem({ ci, row, ceil, evt }) {
      this.emitEvent("clickItem", ci, row, ceil, evt);
    },
    stopAnimation() {
      cancelAnimationFrame(this.animationHandler);
    },
    // 重置动画
    resetAnimation() {
      let el = this.getScrollerEl();
      if (el) {
        el.scrollTop = 0;
        this.scrollTop = 0;
      }
      this.stopAnimation();
    },
    getScrollerEl() {
      let el = this.$el.querySelector(".dsf-dv-table-scroller.scroller");
      return el;
    },
    // 添加滚动相关的事件
    addScrollEvent() {
      if (!this.scrollHandler && this.isScroll) {
        this.scrollListenerEvent = (e) => {
          this.scrollEvent(e);
        };
        this.getScrollerEl()?.addEventListener("scroll", this.scrollListenerEvent);
        this.mousewheelListenerEvent = (e) => {
          this.mousewheelFlag = true;
          clearTimeout(this.mousewheelTimer);
          this.stopAnimation();
          this.mousewheelTimer = setTimeout(() => {
            this.mousewheelFlag = false;
            if (this.isScroll) {
              this.animation();
            }
          }, 1000);
        };
        this.getScrollerEl()?.addEventListener("mousewheel", this.mousewheelListenerEvent);
        this.scrollHandler = 1;
      }
    },
    animation() {
      this.$nextTick(() => {
        this.addScrollEvent();
        let el = this.getScrollerEl();
        if (!el) {
          return;
        }
        let totalScrollHeight = el.scrollHeight;
        let clientHeight = el.clientHeight;

        if (this.isScroll && totalScrollHeight > clientHeight) {
          cancelAnimationFrame(this.animationHandler);
          this.animationHandler = requestAnimationFrame(() => {
            let scrollTop = this.scrollTop + _.round(this.scrollSpeed, 1);
            //20为了底部停留下
            if (scrollTop + clientHeight >= totalScrollHeight + 20) {
              clearTimeout(this.scrollerTimer);
              // 1 s 之后才开启滚动
              this.scrollerTimer = setTimeout(() => {
                this.resetAnimation();
                this.animation();
              }, 1000);
            } else {
              el.scrollTop = scrollTop;
              this.scrollTop = scrollTop;
              this.animation();
            }
          });
        }
      });
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/largeTable.scss";
</style>
