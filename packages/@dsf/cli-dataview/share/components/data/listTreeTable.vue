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
          :isShowHeader="newHeaderConfig.isShowHeader"
          :getHeaderWrapItem="getHeaderWrapItem"
          :handleSort="handleSort"
          :getHeaderNameStyle="getHeaderNameStyle"
          :getFilterItemStyle="getFilterItemStyle"
          :widths="widths"
          :headerBGC="headerBGC"
          :getHeaderItem="getHeaderItem"
          :config="config"
          :getIconFilterItemStyle="getIconFilterItemStyle"
        >
          <template v-for="slot in tableSlot" v-slot:[slot.headerSlotName]>
            <slot :name="slot.headerSlotName" :header="slot" :rows="data"></slot>
          </template>
        </tableHeaderVue>
        <div
          v-if="config"
          class="rows"
          style="overflow: auto"
          :style="`height: ${height - (newHeaderConfig.isShowHeader && header.length ? newHeaderConfig.headerHeight : 0)}px;font-family:${newContentConfig.fontFamily};`"
          @mouseout="handlerScroll(false)"
          @mouseover="handlerScroll(true)"
        >
          <template v-if="!header.length || !data.length">
            <DsfEmptyData />
          </template>
          <template v-else>
            <ListTreeItem :items="data" :__context__="rootContext"></ListTreeItem>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { createTableHeadData } from "_dataview/output/config/tableConfig.js";
import { filterConditionStrategy } from "_dataview/output/utils/filterData";
import createBackground from "_dataview/output/config/backgroundExtend.js";
import ListTreeItem from "./listTreeItem.vue";
import tableHeaderVue from "./tableHeader.vue";

import dvTable from "_dataview/mixins/dvTable.js";

const staticExcelDataDic = {
  name: "企业名称",
  value: "营收收入(亿元)",
  percent: "同比增速(%)",
  keyId: "主键（请勿修改此字段名和字段描述）",
  keyPid: "父主键（请勿修改此字段名和字段描述）",
};
const staticExcelData = [
  {
    name: "北京京东世纪贸易有限公司",
    value: "7046.2",
    percent: "4.5",
    keyPid: null,
    keyId: "1",
  },
  {
    name: "国家电网有限公司",
    value: "5150.7",
    percent: "50",
    keyPid: "1",
    keyId: "2",
  },
  {
    name: "中国投资有限责任公司",
    value: "5432.2",
    percent: "18.5",
    keyPid: null,
    keyId: "3",
  },
  {
    name: "中国限责任公司",
    value: "111.2",
    percent: "30.5",
    keyPid: "3",
    keyId: "4",
  },
  {
    name: "四川测试有限公司",
    value: "146.2",
    percent: "4.5",
    keyPid: "1",
    keyId: "5",
  },
  {
    name: "成都测试有限公司",
    value: "146.2",
    percent: "4.5",
    keyPid: "5",
    keyId: "6",
  },
];

let headerData = [];
Object.values(staticExcelDataDic).forEach((it, index) => {
  if (it.indexOf("主键") === -1) {
    let map = ["name", "value", "percent"];
    let nowData = createTableHeadData();
    nowData.map = map[index];
    nowData.label = it;
    headerData.push(nowData);
  }
});

export default dsf.component({
  name: "DsfDataViewListTreeTable",
  ctrlCaption: "树形表格",
  components: {
    tableHeaderVue,
    ListTreeItem,
  },
  mixins: [dvTable],
  props: {
    keyId: {
      type: String,
      default: "keyId",
    },
    keyPid: {
      type: String,
      default: "keyPid",
    },
    //数据是否是树结构
    dataIsTree: {
      type: Boolean,
      default: false,
    },
    accordionIconColor: {
      type: String,
      default: "#dcf0ff",
    },
    borderBottomRadius: {
      type: String,
      default: "0px",
    },
    accordionIconFont: {
      type: [String, Number],
      default: 16,
    },
    accordionIconMargin: {
      type: [String, Number],
      default: 4,
    },
    accordionIconWidth: {
      type: [String, Number],
      default: 12,
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
        return headerData;
      },
    },
    staticData: {
      type: Array,
      default: () => staticExcelData,
    },
    indexAttrConfig: {
      type: Object,
      default: () => {
        return {
          isShowChildren: true,
          index: false,
          indexHeader: "序号",
          indexWidth: 50,
          setting: [
            {
              width: "32",
              height: "32",
              fontSize: "16",
              fontWeight: "normal",
              fontStyle: "normal",
              textDecoration: "none",
              showContent: "number",
              borderRadius: [0, 0, 0, 0],
              bgColors: ["#a5c9ff"],
              fontColors: ["#ffffff"],
              icons: [],
            },
            {
              width: "24",
              height: "24",
              fontSize: "12",
              fontWeight: "normal",
              fontStyle: "normal",
              textDecoration: "none",
              showContent: "number",
              borderRadius: [0, 0, 0, 0],
              bgColors: ["#385376"],
              fontColors: ["#ffffff"],
              icons: [],
            },
          ],
        };
      },
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
    backgroundColor: {
      type: String,
      default: "rgba(3, 16, 48, 1)",
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
      orgData: [],
      activeRowId: "",
    };
  },
  watch: {
    scrollTop() {
      if (this.isHoverFlag && this.scrollHoverPause) {
        this.stopAnimation();
      } else if (this.isHoverFlag && this.mousewheelFlag && !this.scrollHoverPause) {
        this.stopAnimation();
      } else {
        this.animation();
      }
    },
    isScroll() {
      this.resetAnimation();
      this.animation();
    },
  },
  computed: {
    rootContext() {
      return this;
    },
    accordionIconStyle() {
      let style = {
        fontSize: dsf.dataview.utils.transformPx(this.accordionIconFont),
        color: this.accordionIconColor,
        width: dsf.dataview.utils.transformPx(this.accordionIconWidth),
        "margin-right": dsf.dataview.utils.transformPx(this.accordionIconMargin),
        "icon-left": Number(this.accordionIconWidth) + Number(this.accordionIconMargin),
      };
      return style;
    },
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animationHandler);
    this.getScrollerEl()?.removeEventListener("scroll", this.scrollListenerEvent);
    this.getScrollerEl()?.removeEventListener("mousewheel", this.mousewheelListenerEvent);
    dsf.emit.$remove("activeChange", window);
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
            // 裁切对齐
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
        // 固定为数组格式，按主、次顺序
        textStyles,
        backgrounds: [this.controlBackgroundConfig],
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        const { textStyles = [], backgrounds = [] } = config;
        groups = groups.filter((it) => /布局|边框设置|背景|入场动画|滚动设置/.test(it.name));
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

    compatibleIndexProp() {
      let config = this.config;
      if (config.index !== undefined) {
        this.indexAttrConfig.index = this.config.index;
        this.indexAttrConfig.indexHeader = this.config.indexHeader;
        this.indexAttrConfig.indexWidth = this.config.indexWidth;
      }
      delete config.index;
      //TODO:先这样后面再优化
      this.$emit("update:indexAttrConfig", this.indexAttrConfig);
      this.$emit("update:config", this.config);
    },
    scrollEvent(e) {
      this.scrollTop = e.target.scrollTop;
      this.$emit("scrollEvent", e);
    },
    // 重写数据处理函数
    handleServiceData(data) {
      this.barAutoCalcMaxObj = {};
      this.outerAutoCalcMaxObj = {};
      if (!Array.isArray(data)) return [];
      // 无论数据格式怎样都要进行扁平化
      let flatData = this.flatten(data);
      let flatHeaderData = this.flatten(this.headData);
      let maxObj = {};
      let outerMaxObj = {};
      let unFlatData = this.unFlatten(_.cloneDeep(flatData));
      unFlatData.forEach((item, index) => {
        if (item.id === undefined) {
          item.id = dsf.uuid(16);
        }
        item.index = index + 1;
        item.rowIndex = index;
        item.isOpen = false;
        flatHeaderData.forEach((h) => {
          if (h.isBar) {
            this.getCalcMaxBar(outerMaxObj, maxObj, item, h);
          }
        });
      });
      this.barAutoCalcMaxObj = maxObj;
      this.outerAutoCalcMaxObj = outerMaxObj;
      this.orgData = _.cloneDeep(unFlatData);
      return unFlatData;
    },
    unFlatten(arr) {
      // 定义一个空数组，用来存储结果
      let result = [];
      // 定义一个哈希表，用来存储数组中每个元素的id和索引的对应关系
      let map = {};
      // 遍历数组，构建哈希表
      for (let i = 0; i < arr.length; i++) {
        // 将当前元素的id和索引存入哈希表
        map[arr[i][this.keyId]] = i;
      }
      // 遍历数组，构建树形结构
      for (let i = 0; i < arr.length; i++) {
        // 如果当前元素的pid为null
        if (arr[i][this.keyPid] === null || arr[i][this.keyPid] == 0) {
          // 则将当前元素作为根节点添加到结果数组中
          result.push(arr[i]);
        } else {
          // 否则，找到当前元素的父节点
          // 通过哈希表，可以在O(1)的时间内找到父节点的索引
          let parentIndex = map[arr[i][this.keyPid]];
          // 通过索引，可以在O(1)的时间内找到父节点
          let parent = arr[parentIndex];
          // 将当前元素作为子节点添加到父节点的children属性中
          // 如果父节点没有children属性，则先创建一个空数组
          parent.children = parent.children ? parent.children : [];
          parent.children.push(arr[i]);
        }
      }
      // 返回结果数组
      return result;
    },
    getCeilStyle(ceil, ci) {
      let oneHeader = ceil;
      let fontSize = oneHeader.fontSize ? dsf.dataview.utils.transformPx(oneHeader.fontSize) : dsf.dataview.utils.transformPx(this.newContentConfig.fontSize);
      let color = oneHeader.color;
      let textAlign = oneHeader.align;
      let fontFamily = oneHeader.fontFamily;
      let padding = dsf.dataview.utils.transformArrayPx(oneHeader.commonPadding);
      let fontWeight = oneHeader.fontWeight;
      let fontStyle = oneHeader.fontStyle;
      let textDecoration = oneHeader.textDecoration ? oneHeader.textDecoration : this.newContentConfig.textDecoration;

      let style = {
        width: dsf.dataview.utils.transformPx(this.widths[ci], false),
        "font-size": fontSize,
        color,
        "text-align": textAlign ? textAlign : this.newContentConfig.hAlign,
        fontFamily,
        padding,
        fontWeight,
        fontStyle,
        textDecoration,
      };
      if (this.isShowContentBorder) {
        let contentBorderBottomConfig = this.contentBorderBottomConfig;
        let border = `${contentBorderBottomConfig.commonBorderWidth}px ${contentBorderBottomConfig.commonBorderStyle} ${contentBorderBottomConfig.commonBorderColor}`;
        if (ci === 0) {
          style["border-left"] = border;
        }
        style["border-right"] = border;
      }
      return style;
    },

    getRowItemStyle(row, index) {
      let obj = {
        transition: "all 0.3s",
        "background-color": this.handleRowBackGroundColor(row, index),
        height: this.config.fixEachRowHeightFlag ? `${this.fixEachRowHeight}px` : "auto",
        "line-height": this.config.fixEachRowHeightFlag ? `${this.fixEachRowHeight}px` : "auto",
        color: this.newContentConfig.color,
        fontWeight: this.newContentConfig.fontWeight,
        fontStyle: this.newContentConfig.fontStyle,
        textDecoration: this.newContentConfig.textDecoration,
        marginBottom: this.lineSpaceInfo.space + "px",
      };
      let contentBorder = this.contentBorderBottomConfig.borderBottom;
      obj["border-bottom"] = contentBorder;
      if (!this.config.fixEachRowHeightFlag) {
        obj["align-items"] = "stretch";
      }
      return obj;
    },
    getCeilWrapStyle() {
      let style = {};
      if (!this.config.fixEachRowHeightFlag) {
        style.height = "auto";
      }
      return style;
    },
    lastContentStyle(header) {
      let flexObj = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };
      let align = header.align;
      let style = {};
      if (!this.config.fixEachRowHeightFlag) {
        style = {
          display: "flex",
          "align-items": "center",
          "justify-content": flexObj[align],
        };
      }
      return style;
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
    //伪代码排序
    handleSort(type, headerCol) {
      let field = headerCol.map;
      let nowSort = "default";
      this.header.forEach((item) => {
        if (item.id === headerCol.id) {
          // 证明点的是同一个
          let flag = item.sort === type;
          if (flag) {
            item.sort = "default";
          } else {
            nowSort = type;
            item.sort = type;
          }
        } else {
          item.sort = "default";
        }
      });

      this.$emit("update:headData", this.headData);

      if (nowSort === "default") {
        this.middleWareData(this.serviceData);
      } else {
        this.addFilterRules(field, nowSort, "", false);
        if (this.isScroll) {
          this.resetAnimation();
        }
      }
    },
    sortArray(arr, order, key) {
      if (order === "asc") {
        arr.sort((a, b) => {
          return Number(a[key] - Number(b[key]));
        });
      } else if (order === "desc") {
        arr.sort((a, b) => {
          return Number(b[key] - Number(a[key]));
        });
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          this.sortArray(arr[i].children, order, key);
        }
      }
      return arr;
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
      let el = this.$el.querySelector(".rows");
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
        if (this.isScroll && el.scrollHeight > el.clientHeight) {
          cancelAnimationFrame(this.animationHandler);
          this.animationHandler = requestAnimationFrame(() => {
            let totalScrollHeight = el.scrollHeight;
            let nowScrollTop = this.scrollTop + Number(this.scrollSpeed);
            if (nowScrollTop + el.clientHeight >= totalScrollHeight + 50) {
              this.resetAnimation();
              this.animation();
            } else {
              el.scrollTop = nowScrollTop;
              this.scrollTop = nowScrollTop;
            }
          });
        }
      });
    },
    startAnimation() {
      this.animation();
    },
    judgeAnimate() {
      this.animation();
    },
    handleMouseEnterEvent() {
      if (this.scrollHoverPause) {
        this.stopAnimation();
      }
    },
    handleRowMouseLeaveEvent() {
      this.animation();
    },
    handlerScroll(flag) {
      this.isHoverFlag = flag;
      if (flag) {
        this.handleMouseEnterEvent();
      } else {
        this.handleRowMouseLeaveEvent();
      }
    },
    getDataRuleStyle(row, header) {
      let fontWeight = header.fontWeight ? header.fontWeight : this.newContentConfig.fontWeight;
      let fontStyle = header.fontStyle ? header.fontStyle : this.newContentConfig.fontStyle;
      let textDecoration = header.textDecoration ? header.textDecoration : this.newContentConfig.textDecoration;
      let textShadow = header.textShadow ? header.textShadow : this.newContentConfig.textShadow;
      let fontSize = header.fontSize ? dsf.dataview.utils.transformPx(header.fontSize) : dsf.dataview.utils.transformPx(this.newContentConfig.fontSize);
      let contentColor = header.color === "inherit" ? undefined : header.color;
      let colorStyle = contentColor ? dsf.dataview.utils.getTextColor(contentColor) : dsf.dataview.utils.getTextColor(this.newContentConfig.color);
      let style = {
        fontSize,
        fontStyle,
        textDecoration,
        ...colorStyle,
        textShadow,
      };
      let dataStyle = this.handleUniversalRule(row, header.dataRuleList);
      let colorRuleStyle = dataStyle.text ? dsf.dataview.utils.getTextColor(dataStyle.text.color) : {};
      return {
        ...style,
        fontWeight,
        ...dataStyle.text,
        ...colorRuleStyle,
      };
    },
    getGeneralVal(row, header) {
      let val = [undefined, null].indexOf(row[header.map]) === -1 ? row[header.map] : "";
      val = this.handleMapRelationNum(val, header);
      if (header.unitTransform) {
        return this.transformUnit(val, header.unitTransform, true, 2);
      }
      if (header.isThousandths === undefined || header.isThousandths) {
        return dsf.dataview.utils.toThSeparator(val);
      }
      return val;
    },
    //获取缩进行数
    getIndentRule(row, ceil) {
      let indent = 0;
      if (ceil.indentRules?.length) {
        ceil.indentRules.forEach((item) => {
          let fn = filterConditionStrategy[item.rule];
          if (typeof fn === "function") {
            let res = fn.call(this, row, item, true);
            res && (indent = Math.max(indent, item.indent));
          }
        });
      }
      return indent;
    },
    getSortWHF(row) {
      let attrObj = Array.isArray(this.indexAttrConfig) ? this.indexAttrConfig[0] : this.indexAttrConfig;
      let borderRadius = dsf.dataview.utils.transformArrayPx(attrObj.borderRadius);
      let width = dsf.dataview.utils.transformPx(attrObj.width);
      let height = dsf.dataview.utils.transformPx(attrObj.height);
      let fontWeight = attrObj.fontWeight;
      let fontStyle = attrObj.fontStyle;
      let fontFamily = attrObj.fontFamily;
      let fontSize = dsf.dataview.utils.transformPx(attrObj.fontSize);
      let textDecoration = attrObj.textDecoration;
      let textShadow = attrObj.textShadow;
      let bgColor = this.getColorIcon(attrObj, "bgColors", row.rowIndex);
      let iconColor = this.getColorIcon(attrObj, "iconColors", row.rowIndex);
      let obj = {
        width,
        height,
        background: bgColor,
        fontWeight,
        fontStyle,
        textDecoration,
        fontSize,
        textShadow,
        fontFamily,
      };
      if (["icon"].indexOf(attrObj.showContent) > -1) {
        obj.color = iconColor;
      }
      obj["border-radius"] = borderRadius;
      let icon = this.getColorIcon(attrObj, "icons", row.rowIndex);
      let image = this.getColorIcon(
        {
          images: attrObj.images || [],
        },
        "images",
        row.rowIndex
      );
      let imageUrl = "";
      if (image?.active && image?.custom?.image) {
        imageUrl = dsf.dataview.utils.compatiblePathToExtendShowImg(image);
      }
      obj.other = {
        ...attrObj,
        icon,
        imageUrl,
        imageObj: image || {},
      };
      return obj;
    },
    getRowIndex(row) {
      let attrObj = Array.isArray(this.indexAttrConfig) ? this.indexAttrConfig[0] : this.indexAttrConfig;
      let indexField = attrObj.map;
      if (indexField) {
        if (indexField === "rowIndex") {
          // 内部的特殊字段
          return row.rowIndex + 1;
        }
        return row[indexField];
      }
      return row.rowIndex + 1;
    },
    indexCellTextStyle(row) {
      let obj = {};
      let attrObj = Array.isArray(this.indexAttrConfig) ? this.indexAttrConfig[0] : this.indexAttrConfig;
      let fontColor = this.getColorIcon(attrObj, "fontColors", row.rowIndex);
      let fontColorCss = dsf.dataview.utils.getTextColor(fontColor);
      if (["number", "image"].indexOf(attrObj.showContent) > -1) {
        obj = {
          ...obj,
          ...fontColorCss,
        };
      } else {
        obj.color = iconColor;
      }
      return obj;
    },
    indexCellImage(row) {
      let obj = this.getSortWHF(row);
      let bgVar = this.dvBackgroundFormat(obj.other.imageObj, {
        isBgInfoVar: true,
        defaultBgVarCss: {
          "--border-radius": obj["border-radius"],
        },
      });
      let style = {
        width: dsf.dataview.utils.transformPx(obj.width),
        height: dsf.dataview.utils.transformPx(obj.height),
        color: obj.color,
        textShadow: obj.textShadow,
        ...bgVar,
      };
      return style;
    },
    getColorIcon(attrObj, field, index) {
      let arr = attrObj[field];
      let arrLength = arr.length - 1;
      let str = arr[index] || "";
      if (index > arrLength) {
        str = arr[arrLength] || "";
      }
      return str;
    },
    progressWrapStyle(header, barIndex) {
      let isArray = Array.isArray(header.barInfo);
      let barInfo = isArray ? header.barInfo[barIndex] : header.barInfo;
      let barWidth = barInfo.width === undefined ? "100%" : dsf.dataview.utils.transformPx(barInfo.width);
      let style = {
        width: barWidth,
        "margin-bottom": dsf.dataview.utils.transformPx(header.barSpace),
      };
      return style;
    },
    //计算bar样式
    getOuterStyle(index, barIndex) {
      let header = this.header[index];
      let isArray = Array.isArray(header.barInfo);
      let barInfo = isArray ? header.barInfo[barIndex] : header.barInfo;
      let borderRadius = dsf.dataview.utils.transformArrayPx(barInfo.borderRadius);
      let background = this.handleOldBarBaseColor(barInfo, isArray, index);
      return {
        height: dsf.dataview.utils.transformPx(barInfo.height),
        borderRadius,
        background,
      };
    },
    progressTextStyle(row, header, index, barIndex) {
      let padding = header.commonPadding;
      let rightPadding = parseInt(padding[1]);
      let leftPadding = parseInt(padding[3]);
      let totalWidth = this.widths[index];

      totalWidth = totalWidth - rightPadding - leftPadding;

      let isArray = Array.isArray(header.barInfo);
      let barInfo = isArray ? header.barInfo[barIndex] : header.barInfo;
      let percent = this.getBarInterValue(barInfo, row, barIndex, header);
      const progressDom = $(this.$el).find(`div[data-bar-number=${row.rowIndex}_${index}_${barIndex}]`);
      let textWidth = progressDom.find(".progress-text").width();

      let style = {};
      if (textWidth) {
        const barWidth = (totalWidth * percent) / 100;
        if (textWidth + barWidth > totalWidth) {
          const right = textWidth + "px";
          style.right = dsf.dataview.utils.transformPx(right);
        }
      }
      return style;
    },
    //计算bar条样式
    getInnerStyle(row, ceil, index, barIndex) {
      let header = ceil;
      let isArray = Array.isArray(header.barInfo);
      let barInfo = isArray ? header.barInfo[barIndex] : header.barInfo;
      let percent = this.getBarInterValue(barInfo, row, barIndex, header);
      let barRuleList = barInfo.bgColorRuleList;
      let barStyle = this.handleUniversalRule(row, barRuleList);
      let animationObj = barInfo.animation || {
        flag: false,
        duration: 3,
      };
      let borderRadius = dsf.dataview.utils.transformArrayPx(barInfo.borderRadius);
      let minBarPercent = barInfo.minBarPercent || 0;
    
      let background = barInfo.barBgColor;
      if (barStyle.color) {
        background = barStyle.color.color;
      }
      const style = {
        width: `${percent}%`,
        borderRadius,
        background,
        "--inner-width": `${percent}%`,
        "--animation-duration": animationObj.duration + "s",
      };
      if (percent < minBarPercent) {
        style.width = minBarPercent + "%";
        style["--inner-width"] = minBarPercent + "%";
      }
      return style;
    },
    lightPointStyle(row, ceil, index, barIndex) {
      let header = ceil;
      let isArray = Array.isArray(header.barInfo);
      let barInfo = isArray ? header.barInfo[barIndex] : header.barInfo;
      let minBarPercent = barInfo.minBarPercent || 0;
      let percent = this.getBarInterValue(barInfo, row, barIndex, header);
      let animationObj = barInfo.animation || {
        flag: false,
        duration: 3,
      };
      let diffWidth = 6;
      let lineWidth = 2;
      let left = `calc(${percent}% - ${dsf.dataview.utils.transformPx(lineWidth / 2)})`;
      let style = {
        backgroundColor: barInfo.pointColor,
        width: dsf.dataview.utils.transformPx(lineWidth),
        height: dsf.dataview.utils.transformPx(parseInt(barInfo.height) + diffWidth),
        left,
        "--shu-left": left,
        "--animation-duration": animationObj.duration + "s",
        marginTop: dsf.dataview.utils.transformPx(-diffWidth / 2),
      };
      if (percent < minBarPercent) {
        style.left = minBarPercent + "%";
        style["--shu-left"] = minBarPercent + "%";
      } else if (percent === 100) {
        style.left = `calc(${percent}% - ${dsf.dataview.utils.transformPx(lineWidth)})`;
        style["--shu-left"] = `calc(${percent}% - ${dsf.dataview.utils.transformPx(lineWidth)})`;
      }
      return style;
    },
    // 处理旧的底色柱体颜色
    handleOldBarBaseColor(barInfo, isArray, index) {
      let oldColors = barInfo.baseBgColors;
      let color = "";
      if (oldColors) {
        color = isArray ? oldColors[0] : oldColors[index % oldColors.length];
      } else {
        color = barInfo.barBaseColor;
      }
      return color;
    },

    // 获取bar背景颜色的值
    getBarInterValue(barObj, row, barIndex, header) {
      let percent = row[header.map] || 0;
      let staticValue = barObj.staticValue * 1;
      let field = barObj.field;
      if (this.dataType === "static") {
        if (barObj.staticValue !== "" && barObj.staticValue !== undefined && !isNaN(staticValue)) {
          percent = staticValue;
        }
      } else {
        let minBarPercent = barObj.minBarPercent;
        if (barObj.isAutoCalc) {
          if (field) {
            let max = this.barAutoCalcMaxObj[header.id][barIndex];
            let val = row[field] * 1;
            percent = this.getAutoCalcPercent(max, val, minBarPercent);
          } else {
            // 没有开启自动计算
            if (dsf.isNumber(minBarPercent)) {
              percent = row[field] < minBarPercent ? minBarPercent : row[field];
            } else {
              percent = row[field];
            }
          }
        } else {
          // 没有开启自动计算
          if (dsf.isNumber(minBarPercent)) {
            percent = row[field] < minBarPercent ? minBarPercent : row[field];
          } else {
            percent = row[field];
          }
        }
      }
      if (percent > 100) {
        percent = 100;
      }
      return percent;
    },
    getAutoCalcPercent(max, val, minP) {
      let percent = 0;
      if (max && max !== 0 && !isNaN(val)) {
        let nowPercent = _.round((val / max) * 100, 2);
        if (dsf.isNumber(minP)) {
          percent = nowPercent > minP ? nowPercent : minP;
        } else {
          percent = nowPercent;
        }
      } else {
        percent = 0;
      }
      return percent;
    },
    //获取bar 显示值
    getBarValue(barObj, ceil, row) {
      if (!barObj.showValue) {
        return "";
      }
      let percent = row[ceil.map];
      let staticValue = barObj.staticValue || "";
      let val = `${staticValue ? staticValue : percent}${barObj.fieldSuffix}`;
      let isThousandths = ceil.isThousandths;
      if (isThousandths) {
        val = dsf.dataview.utils.toThSeparator(val);
      }
      if (this.dataType === "static") {
        return val;
      } else {
        let fieldSuffix = row[barObj.fieldSuffix] !== undefined ? row[barObj.fieldSuffix] : barObj.fieldSuffix;
        let unitField = row[barObj.unitField] ? row[barObj.unitField] : barObj.unitField;
        if (isThousandths) {
          fieldSuffix = dsf.dataview.utils.toThSeparator(fieldSuffix);
        }
        if (unitField) {
          return `${fieldSuffix}${unitField}`;
        }
        return fieldSuffix;
      }
    },
    //获取bar 后缀样式
    getBarSuffixStyle(barObj, row) {
      let defaultConfig = barObj.suffixRuleConfig.defaultConfig.text;
      let ruleList = barObj.suffixRuleConfig.ruleList;
      let style = {
        ...defaultConfig,
        fontSize: dsf.dataview.utils.transformPx(defaultConfig.fontSize),
      };
      let ruleStyle = this.handleUniversalRule(row, ruleList);
      if (ruleStyle.text) {
        style = {
          ...ruleStyle.text,
        };
      }
      return style;
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/listTreeTable.scss";
</style>
