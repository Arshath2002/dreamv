/*
 * @Description:
 * @Author: zhanghang
 * @Date: 2022-07-29 15:46:35
 * @LastEditors: shenah
 * @LastEditTime: 2025-04-25 17:39:01
 */
import { eventTemp } from "_dataview/output/utils/relativeEvent";
import dataAnalysisEvent from "./dataAnalysisEvent/index";
import dataAndGraphRelationMixin from "./dataAndGraphRelationMixin.js";
import { dataEvent } from "_dataview/output/utils/commonEvent.js";
import mouseEvents from "./mouseEvents";
export default {
  mixins: [dataAnalysisEvent, dataAndGraphRelationMixin, mouseEvents],
  computed: {
    includeEvents() {
      let commonEvents = Object.keys(dataEvent);
      return [...commonEvents, ...this.otherEvents];
    },
    eventCursorPointerStyle() {
      let style = {};
      if (this.isEventCursorPointer) {
        style["cursor"] = "pointer";
        style["--data-view-click-cursor"] = "pointer";
      }
      return style;
    },
  },
  props: {
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
          //数据处理完成事件
          load: {
            relatives: [],
            fn: eventTemp,
          },
          //数据点击事件
          click: {
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
  },
  data() {
    return {
      isShowComponent: true,
      pureHeader: [], // 最纯洁的头部
      pureData: [], // 最纯洁的数据
      componentType: "dataAnalysis",
      otherEvents: ["刷新", "还原数据", "追加数据", "删除数据", "获取当前值"],
    };
  },

  methods: {
    //点击单元格依赖组件关联方法
    loadClickCellEvents(data, e) {
      let { fn } = this.eventRelativeDeal.clickCell;
      //给组件设置当前数据
      this.currentComponentData = data;
      this.handleCommonEmit(fn, data, e);
    },
    //双击依赖组件关联方法
    loaddbClickEvents(data) {
      let { fn } = this.eventRelativeDeal.dbclick;
      //给组件设置当前数据
      this.currentComponentData = data;
      this.handleCommonEmit(fn, data);
    },
    //点击搜索按钮
    loadSearchEvents(data) {
      let { fn } = this.eventRelativeDeal.search;
      //给组件设置当前数据
      this.currentComponentData = data;
      this.handleCommonEmit(fn, data);
    },
    // change的依赖事件
    loadChangeEvents(data) {
      try {
        let { fn } = this.eventRelativeDeal.change;
        //给组件设置当前数据
        this.currentComponentData = data;
        this.handleCommonEmit(fn, data);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
