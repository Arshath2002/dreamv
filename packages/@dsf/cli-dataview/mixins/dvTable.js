/*
 * @Description:
 * @Author: shenah
 * @Date: 2024-04-29 09:52:24
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-23 15:26:20
 */
import dataView from "./dataView.js";
import svg from "./svg.js";
import dataAnalysis from "./dataAnalysis.js";
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import Pagination from "_dataview/share/components/data/common/pagination";
import paginationMixin from "./pagination.js";
import { createTableHeadData } from "_dataview/output/config/tableConfig.js";
import universalRuleMixin from "_dataview/mixins/universalRuleMixin";
export default {
  mixins: [dataView, svg, dataAnalysis, paginationMixin, universalRuleMixin],
  components: { Pagination },
  props: {
    // 滚动条配置项
    scrollStyleConfig: {
      type: Object,
      default: () => ({
        isShowHScroll: false, // 用于属性中的显示
        isCustomStyle: false, // 自定义滚动条样式
        "--dv-large-table-scroll-is-h-hover-show": false, // 是否悬浮显示
        "--dv-large-table-scroll-is-h-display": "block", // 是否悬浮显示
        "--dv-large-table-scroll-w-h": 10,
        "--dv-large-table-scroll-thumb-border-radius": "5px",
        "--dv-large-table-scroll-thumb-bg": "rgba(140, 140, 140, 0.14)",
        "--dv-large-table-scroll-track-border-radius": "0px",
        "--dv-large-table-scroll-track-bg": "rgba(133, 133, 133, 0.05)",
      }),
    },
    // 新型表头属性
    newHeaderConfig: {
      type: Object,
      default: () => ({
        isShowHeader: true, // 是否显示表格头部
        headerHeight: 35, // 表头高度
        fontFamily: "Microsoft Yahei", // 表头字体
        fontSize: "15px", // 表头字号
        color: "#FFFFFF", // 表头颜色
        fontWeight: "normal", // 表头胖瘦
        fontStyle: "normal", // 表头斜体
        textDecoration: "none", // 表头内容下划线
        textShadow: "",
        bgColor: "none", // 表头背景色
        isHeaderWrap: false, // 换行
        hAlign: "left",
      }),
    },
    // 新型内容属性
    newContentConfig: {
      type: Object,
      default: () => ({
        fontFamily: "Microsoft Yahei", // 内容字体
        fontSize: "16px", // 内容字号;
        color: "#DCF0FF", // 内容颜色
        fontWeight: "normal", //  内容胖瘦
        fontStyle: "normal", //  内容斜体
        textDecoration: "none", //  内容下划线
        textShadow: "",
        hAlign: "left",
      }),
    },
    propStyleFakeSelect: {
      type: String,
      default: "all",
    },
    selectTheme: {
      type: String,
      default: "lanse",
    },
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "dataviewTable",
    },
    //事件依赖
    eventRelativeDeal: {
      type: Object,
      default() {
        return {
          //组件初始化事件
          mounted: {
            relatives: [],
            fn: eventTemp,
          },
          //数据加载完成事件
          dataLoad: {
            relatives: [],
            fn: eventTemp,
          },
          load: {
            relatives: [],
            fn: eventTemp,
          },
          click: {
            relatives: [],
            fn: eventTemp,
          },
          clickCell: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移入事件
          mouseenter: {
            relatives: [],
            fn: eventTemp,
          },
          // 鼠标移出事件
          mouseleave: {
            relatives: [],
            fn: eventTemp,
          },
        };
      },
    },
    isHighlightCurrentRow: {
      type: Boolean,
      default: false,
    },
    isCancelSelect: {
      type: Boolean,
      default: false,
    },
    highlightDefaultSelect: {
      type: Number,
      default: -1,
    },
    highlightBgColor: {
      type: String,
      default: "rgba(245, 247, 250, 0.2)",
    },
    isShowWarnLine: {
      type: Boolean,
      default: false,
    },
    isShowHeaderBorder: {
      type: Boolean,
      default: false,
    },
    prop_oddRowBGC: {
      type: String,
      default: "#f9f9f9",
    },
    prop_evenRowBGC: {
      type: String,
      default: "#F5F7FA",
    },
    isShowContentBorder: {
      type: Boolean,
      default: false,
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
        ];
      },
    },
    lineSpaceInfo: {
      type: Object,
      default: () => ({
        ruleList: [],
        space: 0,
      }),
    },
    // 外边框
    outerBorderConfig: {
      type: Object,
      default: () => ({}),
    },
    // 表头边框以及下边框公用
    headerBorderBottomConfig: {
      type: Object,
      default: () => ({}),
    },
    // 普通行边框以及下边框公用
    contentBorderBottomConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    config: {
      handler() {
        if (this.isDesign) {
          this.middleWareData(this.serviceData);
        }
      },
      deep: true,
    },
    "lineSpaceInfo.space": {
      handler() {
        if (this.isDesign) {
          this.middleWareData(this.serviceData);
        }
      },
    },
    indexAttrConfig: {
      handler(v) {
        if (this.isDesign) {
          this.middleWareData(this.serviceData);
        }
      },
      deep: true,
    },
    staticData: {
      handler() {
        if (this.isDesign) {
          this.middleWareData(this.serviceData);
        }
      },
    },
    newHeaderConfig: {
      handler() {
        if (this.isDesign) {
          this.middleWareData(this.serviceData);
        }
      },
      deep: true,
    },
    newContentConfig: {
      handler() {
        if (this.isDesign) {
          this.middleWareData(this.serviceData);
        }
      },
      deep: true,
    },
    headData: {
      handler() {
        if (this.isDesign) {
          this.middleWareData(this.serviceData);
        }
      },
      deep: true,
    },
    highlightDefaultSelect: {
      handler() {
        if (this.isDesign) {
          this.handleDefaultSelect();
        }
      },
    },
  },
  computed: {
    headerBGC() {
      let color = this.newHeaderConfig.bgColor;
      return color;
    },
    headerColorStyle() {
      let color = this.newHeaderConfig.color;
      let colorStyle = dsf.dataview.utils.getTextColor(color);
      return colorStyle;
    },
    oddRowBGC() {
      let color = this.prop_oddRowBGC;
      return color;
    },
    evenRowBGC() {
      let color = this.prop_evenRowBGC;
      return color;
    },
    getHeaderWrapItem() {
      let height = parseInt(this.newHeaderConfig.headerHeight) * this.headLevel;
      let obj = {
        height: this.isShowHeaderBorder ? `${height - 1}px` : `${height}px`,
        fontSize: dsf.dataview.utils.transformPx(this.newHeaderConfig.fontSize),
        fontFamily: this.newHeaderConfig.fontFamily,
        fontWeight: this.newHeaderConfig.fontWeight,
        fontStyle: this.newHeaderConfig.fontStyle,
      };
      obj["border-bottom"] = this.headerBorderBottomConfig.borderBottom;
      return obj;
    },
  },
  data() {
    return {
      tableSlot: [],
      headLevel: 1,
      activeRowIndex: null,
      outerAutoCalcMaxObj: {}, // 用于存储当bar没有百分比字段的时候
      barAutoCalcMaxObj: {}, // 用于存储柱状自动计算的最大值,
    };
  },
  created() {
    this.handleDefaultSelect();
  },
  methods: {
    getIconFilterItemStyle(it, sortType) {
      let style = {
        color: it.sortDefaultColor,
      };
      if (it.sort === sortType) {
        style.color = it.sortColor;
      }
      return style;
    },

    getFilterItemStyle(it, sortType) {
      let style = {
        color: sortType ? it.sortColor : it.sortDefaultColor,
      };
      if (it.sort === sortType) {
        style.color = it.sortColor;
      } else if (sortType === undefined && it.sort !== "default") {
        style.color = it.sortColor;
      }
      return style;
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
      this.headData.forEach((item) => {
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
    handleRowBackGroundColor(row) {
      let obj = this.handleUniversalRule(row, this.lineSpaceInfo.list);
      if (obj.color) {
        return obj.color.color;
      }
      if (obj.image) {
        return obj.image.image;
      }
    },
    rowItemBgStyle(row) {
      const color = this.handleRowBackGroundColor(row);
      let obj = {
        transition: "all 0.3s",
      };
      if (this.isHighlightCurrentRow && row.rowIndex === this.activeRowIndex) {
        obj["background-color"] = this.highlightBgColor;
        obj["background-image"] = "none";
      } else {
        if (typeof color === "string") {
          if (color && ~color.indexOf("gradient")) {
            obj["background-image"] = color;
          } else {
            obj["background-color"] = color;
          }
        } else if (color && typeof color === "object") {
          // 证明是图片
          obj = {
            ...obj,
            ...this.dvBackgroundFormat(color),
          };
        }
      }
      return obj;
    },

    allTableWrapStyle() {
      let { borderBottomRadius, width, getCommonEnterAnimateStyle } = this;
      let controlStyle = this.controlStyle;
      let style = {
        ...controlStyle,
        width,
        ...getCommonEnterAnimateStyle,
      };
      let borderRadius = dsf.dataview.utils.transformArrayPx(borderBottomRadius);
      style.borderRadius = borderRadius;
      return style;
    },
    allTableStyle() {
      let scrollStyleConfig = {};
      if (this.scrollStyleConfig.isShowHScroll && this.scrollStyleConfig.isCustomStyle) {
        scrollStyleConfig = {
          ...this.scrollStyleConfig,
        };
        scrollStyleConfig["--dv-large-table-scroll-w-h"] = dsf.dataview.utils.transformPx(scrollStyleConfig["--dv-large-table-scroll-w-h"]);
        scrollStyleConfig["--dv-large-table-scroll-thumb-border-radius"] = dsf.dataview.utils.transformArrayPx(scrollStyleConfig["--dv-large-table-scroll-thumb-border-radius"]);
        scrollStyleConfig["--dv-large-table-scroll-track-border-radius"] = dsf.dataview.utils.transformArrayPx(scrollStyleConfig["--dv-large-table-scroll-track-border-radius"]);
        scrollStyleConfig["--dv-large-table-scroll-is-h-display"] = scrollStyleConfig["--dv-large-table-scroll-is-h-hover-show"] ? "none" : "block";
      }
      let style = {
        ...scrollStyleConfig,
        ...this.outerBorderConfig,
        ...this.getBoxShadowConfig(false),
      };
      let borderRadius = dsf.dataview.utils.transformArrayPx(this.borderBottomRadius);
      style.borderRadius = borderRadius;
      return style;
    },

    getHeaderNameStyle(it) {
      let style = {};
      let padding = dsf.dataview.utils.transformArrayPx(it.commonPadding);
      let headerColor = it.headerColor === "inherit" ? undefined : it.headerColor;
      let nowColorStyle = headerColor ? dsf.dataview.utils.getTextColor(headerColor) : this.headerColorStyle;
      if (it.sortIsHighlight && it.sort !== "default") {
        nowColorStyle = dsf.dataview.utils.getTextColor(it.sortHighlight);
      }
      style.padding = padding;
      if (this.newHeaderConfig.isHeaderWrap) {
        let alignMap = {
          left: "flex-start",
          center: "center",
          right: "flex-end",
        };
        let justifyContent = alignMap[it.headerAlign] || "center";
        style.textOverflow = "clip";
        style.overflow = "visible";
        style.whiteSpace = "normal";
        style.lineHeight = "normal";
        style.display = "flex";
        style.alignItems = "center";
        style.justifyContent = justifyContent;
      }
      return {
        ...style,
        ...nowColorStyle,
      };
    },
    getHeaderItem(it, i) {
      let height = dsf.dataview.utils.transformPx(this.newHeaderConfig.headerHeight);
      let fontSize = dsf.dataview.utils.transformPx(it.headerFontSize);
      let fontFamily = it.headerFontFamily;
      let fontStyle = it.headerFontStyle;
      let fontWeight = it.headerFontWeight;
      let textDecoration = it.headerTextDecoration || this.newHeaderConfig.textDecoration;
      let textShadow = it.headerTextShadow || this.newHeaderConfig.textShadow;

      let headerBorderBottomConfig = this.headerBorderBottomConfig;
      let border = `${headerBorderBottomConfig.commonBorderWidth}px ${headerBorderBottomConfig.commonBorderStyle} ${headerBorderBottomConfig.commonBorderColor}`;
      let style = {
        height: parseInt(this.newHeaderConfig.headerHeight) * (this.headLevel - it.level + 1) + "px",
        fontSize,
        lineHeight: height,
        textAlign: it.headerAlign ? it.headerAlign : this.newHeaderConfig.hAlign,
        fontFamily,
        fontStyle,
        textDecoration,
        fontWeight,
        textShadow,
      };
      // 最外层级高度统一
      if (!it.children || it.children.length === 0) {
        style.lineHeight = parseInt(this.newHeaderConfig.headerHeight) * (this.headLevel - it.level + 1) + "px";
      }

      if (!it.children || it.children.length === 0) {
        let index = this.header.findIndex((cItem) => {
          return cItem.id === it.id;
        });
        let width = Number(this.widths[index]);
        style.width = width + "px";
        if (it.isSort) {
          style["padding-right"] = "16px";
        }
      } else if (it.children && it.children.length > 0) {
        style.width = this.getFatherNodeWidth(it.children) + "px";
      }
      if (this.isShowHeaderBorder) {
        if (it.isFirst) {
          style["border-left"] = border;
        }
        style["border-top"] = border;
        if (it.hasRight || it.isLast) {
          style["border-right"] = border;
        }
      }
      if (!this.isDesign) {
        style["flex-shrink"] = 0;
      }
      if (this.newHeaderConfig.isHeaderWrap) {
        let alignMap = {
          left: "flex-start",
          center: "center",
          right: "flex-end",
        };
        let justifyContent = alignMap[it.headerAlign] || "center";
        style.textOverFlow = "clip";
        style.overflow = "visible";
        style.whiteSpace = "normal";
        style.lineHeight = "normal";
        style.display = "flex";
        style.alignItems = "center";
        style.justifyContent = justifyContent;
      }
      return style;
    },
    getFatherNodeWidth(it) {
      let width = 0;
      it.forEach((item) => {
        if (item.children && item.children.length > 0) {
          width += Number(this.getFatherNodeWidth(item.children));
        } else {
          let index = this.header.findIndex((cItem) => {
            return cItem.id === item.id;
          });
          if (index !== -1) width += Number(this.widths[index]);
        }
      });
      return width;
    },
    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data }) {
      const dictionary = {};
      const headerData = [];
      this.isVirtualTable = true;
      describe.forEach(({ title, field }) => {
        dictionary[field] = title;
        const cell = createTableHeadData();
        cell.label = title;
        cell.map = field;
        headerData.push(cell);
      });
      // 处理成Excel
      this.headData.length = 0
      dsf.mix(true,this.headData,headerData)
      this.$emit("update:headerData", headerData);

      const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
      this.excelData.length = 0
      dsf.mix(true,this.excelData,excelData)
      this.$emit("update:excelData", excelData);
    },
    handleMouseEnterPrivate() {
      if (this.scrollHoverPause && this.isScroll) {
        this.stopAnimation();
      }
    },
    handleMouseLeavePrivate() {
      if (this.scrollHoverPause && this.isScroll) {
        this.animation();
      }
    },
    //分析数据
    dataAnalysis(data) {
      if (!data || !data.length) {
        this.hasData = false;
        return;
      }
      this.hasData = true;
      // 分页相关
      if (typeof this.notRequestInitData === "function") {
        data = this.notRequestInitData(data);
      }
      this.handleCommonTableData(data);
    },
    notRequestAfterPageChange(list) {
      this.handleCommonTableData(list);
    },
    handleCommonTableData(data) {
      this.data = this.handleServiceData(_.cloneDeep(data));
      this.handleHeaderSlot();
      this.calcHeaderData();
      this.calcRowsDataData();
      this.$nextTick(() => {
        this.onResize();
      });
    },
    calcRowsDataData() {},

    handleHeaderSlot() {
      // 创建一个新的数组用于存放符合条件的对象
      const result = [];
      // 递归遍历数组
      function traverse(arr) {
        for (let i = 0; i < arr.length; i++) {
          const obj = arr[i];
          const children = obj.children || [];
          // 当children为空或不存在，并且headerSlotName匹配时将对象放入结果数组中
          if (obj.headerSlotName) {
            result.push(obj);
          }
          // 递归遍历children数组
          if (children.length) {
            traverse(children);
          }
        }
      }
      // 开始递归遍历
      traverse(this.headData);
      this.tableSlot = result;
    },
    //映射处理接口返回数据
    handleServiceData(data) {
      this.barAutoCalcMaxObj = {};
      this.outerAutoCalcMaxObj = {};
      if (!Array.isArray(data)) return [];
      let maxObj = {};
      let outerMaxObj = {};
      let flatData = this.flatten(this.headData);
      data.forEach((item, index) => {
        if (item.id === undefined) {
          item.id = dsf.uuid(16);
        }
        item.index = index + 1;
        item.rowIndex = index;
        flatData.forEach((h) => {
          if (h.isBar) {
            this.getCalcMaxBar(outerMaxObj, maxObj, item, h);
          }
        });
      });
      this.barAutoCalcMaxObj = maxObj;
      this.outerAutoCalcMaxObj = outerMaxObj;
      return data;
    },
    getCalcMaxBar(outerMaxObj, maxObj, it, header) {
      let id = header.id;
      let barArr = header.barInfo;
      for (let i = 0; i < barArr.length; i++) {
        let oneBar = barArr[i];
        let itVal = Number(it[oneBar.field]);
        let val = isNaN(itVal) ? 0 : itVal;
        if (!maxObj[id]) {
          maxObj[id] = new Array(barArr.length).fill(0);
          outerMaxObj[id] = new Array(barArr.length).fill(0);
        }
        let max = maxObj[id][i];
        let outerMax = outerMaxObj[id][i];
        if (val > max) {
          maxObj[id][i] = val;
        }
        if (it.name > outerMax) {
          outerMaxObj[id][i] = it.name;
        }
      }
    },
    //计算平均高度
    dealAvgHeight() {
      const { realHeight: height, config, header, newHeaderConfig } = this;
      const { rowNum, slotHeight = 0 } = config;
      const { isShowHeader, headerHeight } = newHeaderConfig;
      let allHeight = height;
      if (header.length && isShowHeader && header.length) allHeight -= parseInt(headerHeight) * this.headLevel;
      if (this.isShowPage) {
        allHeight -= this.pageConfig.height;
      }
      allHeight -= slotHeight;
      let avg = allHeight / rowNum;
      return avg;
    },
    // 停止滚动(轮播表格)
    stopAnimation() {},
    //开启轮播(轮播表格)
    animation() {},
    //计算宽高
    calWH() {
      this.calcWidths();
      this.calcHeights();
    },
    //计算表头数据
    calcHeaderData() {
      this.header = _.cloneDeep(this.headData);
      let { showContent, indexHeader, indexWidth, index } = this.indexAttrConfig;
      let { header } = this;
      if (typeof index === "boolean") {
        if (index) {
          header.unshift({
            label: indexHeader,
            isIndex: true,
            headerAlign: "center",
            align: "center",
            width: indexWidth,
          });
        }
      } else {
        if (showContent !== "no") {
          header.unshift({
            label: indexHeader,
            isIndex: true,
            headerAlign: "center",
            align: "center",
            width: indexWidth,
          });
        }
      }

      this.transformTree(header, 1);
      let flatData = this.flatten(header);
      if (this.orgHeader) this.orgHeader = header;
      this.header = flatData;
    },
    //处理表格头部数据
    transformTree(tree, n, hasRight = false) {
      this.headLevel = Math.max(this.headLevel, n);
      tree.forEach((it, index) => {
        const item = it;
        let $hasRight = hasRight;
        if (!$hasRight && index < tree.length - 1) {
          $hasRight = true;
        } else if ($hasRight && index == tree.length - 1) {
          $hasRight = false;
        }
        //第一个
        if (index == 0 && n === 1) {
          it.isFirst = true;
        }
        //最后一个
        if (index == tree.length - 1 && n === 1) {
          it.isLast = true;
        }
        item.level = n;
        item.hasRight = $hasRight;

        if (it.children) {
          this.transformTree(it.children, n + 1, $hasRight);
        } else {
          item.hide = false;
        }
      });
    },
    //计算列宽
    calcWidths() {
      const { realWidth: width, header } = this;
      const flatData = this.flatten(header);
      let widths = flatData.map((it) => {
        if (typeof it.width == "number" || /\d+$/g.test(it.width)) {
          return it.width * 1;
        } else if (/%$/g.test(it.width)) {
          return (width * parseFloat(it.width)) / 100;
        }
        if (typeof it.width === "string") {
          const regex = /^\d+px/g;
          const matches = it.width?.match(regex) || [];
          if (!it.width.includes("calc") && matches && matches.length) {
            const number = parseInt(matches[0], 10);
            return number;
          }
        }

        return "";
      });
      let columnNum = widths.filter((it) => it).length;

      const usedWidth = widths.reduce((all, w) => all + Number(w), 0);

      const avgWidth = Math.abs((width - usedWidth) / (widths.length - columnNum));

      widths = widths.map((it) => (it ? it : avgWidth));
      if (this.isDesign) {
        let lastNum = widths[widths.length - 1];
        widths[widths.length - 1] = dsf.isNumber(lastNum) ? lastNum - 1 : lastNum;
      }
      this.widths = widths;
      this.calcStyleScroll();
    },
    calcStyleScroll() {
      // 计算总共的宽度,如果超出则出现横向滚动条
      let nowTotalWidth = this.widths.reduce((a, b) => a + b, 0);
      let rowEl = this.$el.querySelector(".dsf-large-screen-table .rows");
      let headerEl = this.$el.querySelector(".dsf-large-screen-table .header");
      if (rowEl) {
        if (nowTotalWidth > this.realWidth && rowEl) {
          rowEl.style.width = `${nowTotalWidth}px`;
          headerEl && (headerEl.style.width = `${nowTotalWidth}px`);
          this.scrollStyleConfig.isShowHScroll = true;
          this.$emit("update:scrollStyleConfig", this.scrollStyleConfig);
        } else {
          rowEl.style.width = "100%";
          headerEl && (headerEl.style.width = "auto");
          this.scrollStyleConfig.isShowHScroll = false;
          this.$emit("update:scrollStyleConfig", this.scrollStyleConfig);
        }
      }
    },

    flatten(arr) {
      return arr.reduce((acc, val) => {
        if (val.children && val.children.length > 0) {
          acc = acc.concat(this.flatten(val.children));
        } else {
          acc.push(val);
        }
        return acc;
      }, []);
    },
    //事件发送
    emitEvent(type, ci, row, ceil, evt) {
      const { rowIndex } = row;
      if (this.isCancelSelect) {
        this.activeRowIndex === row.rowIndex ? (this.activeRowIndex = null) : (this.activeRowIndex = row.rowIndex);
      } else {
        this.activeRowIndex = row.rowIndex;
      }
      this.$dispatch(type, {
        row,
        ceil,
        rowIndex,
        columnIndex: ci,
      });
      if (type === "clickItem") {
        let value = row[ceil.map] || "";
        let label = ceil?.label || "";
        this.loadClickEvents(row, evt);
        let nowObjCell = {
          ...row,
          value,
          label,
        };
        this.$dispatch("loadClickCellEvents", nowObjCell);
        this.loadClickCellEvents(nowObjCell, evt);
      }
    },

    onResize() {
      this.stopAnimation();
      this.calWH();
      this.resetAnimation();
      const { animation } = this;
      animation(true);
    },
    resetAnimation() {
      this.animationIndex = 0;
      this.animationHandler = "";
      this.updater = 0;
    },

    handleRowItemMouseEnter(e, row) {
      if (this.isHighlightCurrentRow) {
        $(e.target).css("background-color", this.highlightBgColor);
      }
      // 伪代码事件处理
      this.handleMouseEnter(row, e);

      this.handleMouseEnterPrivate(row, e);
    },
    handleRowMouseLeave(e, row, ri) {
      if (this.isHighlightCurrentRow) {
        let style = this.getRowItemStyle;
        $(e.target).css("background-color", style["background-color"] || "");
      }
      // 伪代码事件处理
      this.handleMouseLeave(row, e);
      this.handleMouseLeavePrivate(row, e);
    },
    styleChangeHeaderStyle(arr, attrObj = {}) {
      arr.forEach((item) => {
        // 只改变最后一层
        if (!item.children || item.children.length === 0) {
          dsf.mix(true, item, attrObj);
        }
        item.hide = false;
        if (item.children && item.children.length > 0) {
          this.styleChangeHeaderStyle(item.children, attrObj);
        }
      });
    },
    handleDefaultSelect() {
      if (this.isHighlightCurrentRow && dsf.isNumber(this.highlightDefaultSelect) && this.highlightDefaultSelect >= 0) {
        this.activeRowIndex = this.highlightDefaultSelect;
      } else {
        this.activeRowIndex = null;
      }
    },
    styleConfigCallback(styleObj, theme) {
      if (styleObj && theme) {
        // 修改柱体颜色
        const colorList = theme.commonConfig.colorList;
        const barBgColor = colorList[0];
        this.styleChangeHeaderStyle(this.headData, {
          barInfo: [
            {
              barBgColor,
            },
          ],
        });

        Object.keys(styleObj).forEach((key) => {
          let val = styleObj[key];
          let nowVal = val;
          if (nowVal && typeof nowVal === "object") {
            nowVal = dsf.mix(true, {}, this[key], nowVal);
          }
          this.$emit(`update:${key}`, nowVal);
        });
      }
    },
  },
};
