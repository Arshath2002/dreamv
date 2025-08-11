<!--
 * @Description:排名轮播表 
 * @Author: zhanghang
 * @Date: 2022-07-27 11:24:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-15 20:36:56
-->
<template>
  <div
    class="data-view-item-wrap ds-control dsf-dv-scroll-ranking-board data-view-no-padding"
    :style="scrollRankingBoardStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <dsf-empty-data v-if="!hasData"></dsf-empty-data>
    <el-scrollbar ref="wrapper" class="dsf-dv-scroll-ranking-board-wrapper data-view-common-bg-effect" v-else>
      <div
        class="row-item"
        v-for="(item, i) in rows"
        :key="i"
        :style="rowItemStyle"
        @mouseenter="(e) => handleMouseEnter(item, e)"
        @mouseleave="(e) => handleMouseLeave(item, e)"
        @click="clickItem($event, item)"
      >
        <slot name="rank" :item="item" :index="i">
          <div class="ranking-info">
            <div class="info-name" v-html="item.name" :style="infoNameStyle" v-if="titleFlag" />
            <div class="ranking-value" v-html="getValueFormatter(valueFormatter, item)" :style="rankingValueStyle" v-if="valueFlag"></div>
          </div>
          <div class="ranking-column-bar" :style="barStyle">
            <div class="inside-column" ref="barItem" :style="`background: ${colors[i % colors.length]}; transition:width ${durTime};`"></div>
          </div>
        </slot>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
const staticDataKeyDic = {
  name: "名称",
  value: "数量",
  percent: "百分比",
};
const staticData = [
  {
    name: "锦江区",
    value: "167",
    percent: "130",
  },
  {
    name: "成华区",
    value: "67",
    percent: "40",
  },
  {
    name: "武侯区",
    value: "123",
    percent: "40",
  },
  {
    name: "高新区",
    value: "55",
    percent: "60",
  },
  {
    name: "青羊区",
    value: "98",
    percent: "70",
  },
  {
    name: "双流区",
    value: "55",
    percent: "90",
  },
  {
    name: "郫都区",
    value: "98",
    percent: "100",
  },
];
import scrollMixins from "./common/scrollMixins";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewScrollRankingBoard",
  ctrlCaption: "滚动胶囊",
  mixins: [$mixins.dataView, scrollMixins, dataAnalysis],
  props: {
    padding: {
      type: Array,
      default: () => [15, 15, 15, 15],
    },
    background: {
      type: Object,
      default: () => ({}),
    },
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "scrollRankingBoard",
    },
    titleFlag: {
      type: Boolean,
      default: true,
    },
    titleTextStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          color: "#606266",
        });
      },
    },
    valueFlag: {
      typo: Boolean,
      default: true,
    },
    valueTextStyle: {
      type: Object,
      default: () =>
        createCommonTextStyle({
          color: "#606266",
        }),
    },
    //每行高度
    rowHeight: {
      type: String,
      default: "80",
    },
    //自动计算
    autoCalculate: {
      type: Boolean,
      default: true,
    },
    barBackground: {
      type: String,
      default: "rgba(71, 71, 71, 0.3)",
    },
    barHeight: {
      type: String,
      default: "10",
    },
    borderRadius: {
      type: String,
      default: "5px",
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    fixEachRowType: {
      type: String,
      default: "rowNum",
    },
    rowNum: {
      type: [String, Number],
      default: 5,
    },
    sortInfo: {
      type: String,
      default: "default",
    },

    colors: {
      type: Array,
      default() {
        return [
          "linear-gradient(90deg, rgba(53, 143, 248, 0.6) 0%, rgb(53, 143, 248) 100%)",
          "linear-gradient(90deg, rgba(62, 215, 230, 0.6) 0%, rgb(62, 215, 230) 100%)",
          "linear-gradient(90deg, rgba(91, 214, 149, 0.6) 0%, rgb(91, 214, 149) 100%)",
          "linear-gradient(90deg, rgba(125, 133, 229, 0.6) 0%, rgb(125, 133, 229) 100%)",
          "linear-gradient(90deg, rgba(242, 142, 72, 0.6) 0%, rgb(242, 142, 72) 100%)",
          "linear-gradient(90deg, rgba(255, 195, 43, 0.6) 0%, rgb(255, 195, 43) 100%)",
        ];
      },
    },
    valueFormatter: {
      type: String,
      default: "@[value]",
    },
    // 条形动效
    animateConfig: {
      type: Object,
      default: () => ({
        flag: true,
        dur: 3000,
      }),
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
            require: true,
            hideDigit: true,
          },
          {
            text: "值字段",
            value: "value",
            require: true,
            map: "value",
          },
          {
            text: "百分比",
            value: "percent",
            map: "percent",
          },
        ];
      },
    },
  },
  data() {
    return {
      rows: [],
      data: [],
    };
  },
  watch: {
    rowNum() {
      if (this.isDesign) {
        let el = this.getScrollerEl();
        //高度按照行计算
        if (this.fixEachRowType === "rowNum") {
          this.rowHeightNum = Math.floor(el.clientHeight / this.rowNum);
        }
        //保证组件元素出来
        setTimeout(() => {
          this.animation();
          this.barAnimation();
        });
      }
    },
    staticData: {
      handler(val) {
        if (this.dataType === "static") {
          this.dataAnalysis(val);
        }
      },
    },
    fixEachRowType() {
      const data = _.cloneDeep(this.serviceData);
      this.dataAnalysis(data);
    },
    sortInfo(v, o) {
      const data = _.cloneDeep(this.serviceData);
      this.dataAnalysis(data);
    },
    padding() {
      if (this.isDesign) {
        this.onResize();
      }
    },
    autoCalculate() {
      const data = _.cloneDeep(this.serviceData);
      this.dataAnalysis(data);
    },
  },
  computed: {
    durTime() {
      if (this.animateConfig.flag && Number(this.animateConfig.dur) > 0) {
        return `${this.animateConfig.dur}ms`;
      } else {
        return "0ms";
      }
    },
    scrollRankingBoardStyle() {
      let backgroundObj =
        dsf.dataview.utils.$backgroundFormat(this.background, "", {
          isBgInfoVar: true,
        }) || {};
      return {
        ...this.controlStyle,
        ...backgroundObj,
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
    },
    rowItemStyle() {
      let { rowHeight, fixEachRowType, rowHeightNum } = this;
      rowHeight = fixEachRowType === "rowNum" ? rowHeightNum : rowHeight;
      const height = dsf.dataview.utils.transformPx(rowHeight);
      return {
        "min-height": height,
        ...this.eventCursorPointerStyle,
      };
    },
    barStyle() {
      let { barBackground, barHeight, borderRadius } = this;
      const background = dsf.dataview.utils.transformPx(barBackground);
      const height = dsf.dataview.utils.transformPx(barHeight);
      let radius = borderRadius;
      if (typeof borderRadius === "string" && borderRadius.split(" ").length === 1) {
        radius = dsf.dataview.utils.transformPx(borderRadius);
      }
      return {
        background,
        height,
        "border-radius": radius,
      };
    },
    infoNameStyle() {
      return dsf.dataview.utils.transformTextStyle(this.titleTextStyle);
    },
    rankingValueStyle() {
      return dsf.dataview.utils.transformTextStyle(this.valueTextStyle);
    },
  },

  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        // 固定为数组格式，按主、次顺序
        textStyles: [this.nameTextStyle, this.valueTextStyle],
        backgrounds: [this.background],
        colorScheme: this.colors,
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter((it) => /布局|边框设置|滚动设置|背景|入场动画/.test(it.name));
        const { textStyles = [], backgrounds = [], colorScheme } = config;
        this.updateComponentStyle("nameTextStyle", textStyles[0]);
        this.updateComponentStyle("valueTextStyle", textStyles[1]);
        this.updateComponentStyle("background", backgrounds[0]);
        this.updateComponentStyle("colors", colorScheme);
      }
      this.setComponentStyle(groups, config._props);
    },
    barAnimation() {
      let domBarItem = this.$refs.barItem;
      _.each(domBarItem, (item, index) => {
        item.style.width = this.rows[index].percent + "%";
      });
    },
    handleSort(val, data) {
      let res = [];
      if (val === "default") {
        res = data;
      } else {
        res = _.orderBy(data, "value", val);
      }
      return res;
    },
    getValueFormatter(str, data) {
      return this.$replace(str, data);
    },
    clickItem(evt, item) {
      this.$dispatch("clickItem", item);
      this.loadClickEvents(item, evt);
    },

    /**
     * ai 大模型输出数据处理
     * @param {Array} describe 字段描述信息
     * @param {Array} data 数据
     */
    dataModelAnalysis({ describe, data }) {
      const dictionary = {};
      const keys = [];
      const mapRelations = this.mapRelations;
      describe.forEach(({ title, field }, index) => {
        dictionary[field] = title;
        // 使用第一个字段作位名称key
        if (index === 0) {
          mapRelations[0].map = field;
        }
        keys.push([field, title]);
      });
      this.$emit("update:mapRelations", mapRelations);
      try {
        const item = data[0];
        if (item) {
          // 构造数据字段
          for (let i = 1; i < keys.length; i++) {
            const key = keys[i][0];
            const title = keys[i][1];
            const value = dsf.dataview.utils.matchNumberAndSuffix(item[key]);
            if (value && value.number) {
              data = data.map((it) => {
                const value = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
                const unit = value.unit;
                return {
                  ...it,
                  value: value.number,
                  unit: unit,
                };
              });
              this.$emit("changeTitle", title);
              break;
            }
          }
          dictionary.value = "值";
          dictionary.unit = "单位";
        }
      } catch (error) {
        console.warn(`error${error}`);
      }
      // 处理成Excel
      const excelData = dsf.dataview.utils.transformToExcelData(data, dictionary);
      this.excelData.length = 0;
      dsf.mix(true, this.excelData, excelData);
      this.$emit("update:excelData", excelData);
    },

    //计算行数据
    dataAnalysis(data = []) {
      if (!data.length) {
        this.hasData = false;
        return;
      }
      this.hasData = true;
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        let mapRelations = this.mapRelations;
        let nameMap = mapRelations[0].map;
        let valueMap = mapRelations[1].map;
        this.data = data.map((it) => {
          const value = this.handleMapRelationNum(it[valueMap], mapRelations[1]);

          return {
            ...it,
            name: it[nameMap],
            value,
          };
        });
      } else {
        this.data = data;
      }
      data = _.cloneDeep(this.data);

      const dealNumber = (value) => {
        return String(value).replace(/[^\d.-]/g, "") * 1;
      };

      const value = data.map(({ value }) => dealNumber(value));

      const min = Math.min(...value) || 0;
      const minAbs = Math.abs(min);
      const max = Math.max(...value) || 0;
      const total = max + minAbs;

      let percentMap = this.mapRelations[2]?.map || "percent";
      data.forEach((it) => {
        let percent = it[percentMap];
        if (this.autoCalculate || percent === void 0) {
          const value = it.value;
          percent = ((dealNumber(value) + minAbs) / total) * 100;
        }
        it.percent = percent;
      });

      const _data = _.cloneDeep(data);
      this.rows = this.handleSort(this.sortInfo, _data);

      Promise.resolve().then(() => {
        this.$nextTick(() => {
          let el = this.$refs.wrapper.$el;
          //高度按照行计算
          if (this.fixEachRowType === "rowNum") {
            this.rowHeightNum = Math.floor(el.clientHeight / this.rowNum);
          }
          this.animation();
          this.barAnimation();
        });
      });
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/DsfDataViewScrollRankingBoard.scss";
</style>
