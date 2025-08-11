<!--
 * @Description: 排名进度
 * @Author: shenah
 * @Date: 2024-09-12 19:45:59
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-07-18 09:53:55
-->

<template>
  <div
    class="dsf-dv-rank-progress data-view-item-wrap ds-control data-view-no-padding"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    :style="rankProgressStyle"
  >
    <dsf-empty-data v-if="!hasData"></dsf-empty-data>
    <el-scrollbar ref="wrapper" class="dsf-dv-rank-progress-content data-view-common-bg-effect" :style="rankProgressContentStyle" v-else>
      <div
        class="row-item"
        v-for="(item, i) in data"
        :key="item.keyId"
        :style="rowItemStyle"
        @mouseenter="(e) => handleMouseEnter(item, e)"
        @mouseleave="(e) => handleMouseLeave(item, e)"
        @click="clickItem($event, item)"
      >
        <!-- top排名 -->
        <div class="top-rank" v-if="indexAttrConfig.showContent !== 'no'" :style="topRankStyle">
          <!-- 序号插槽 -->
          <slot name="xh" :row="item" :index="i">
            <div class="common-index" :style="commonIndexStyle(item)">
              <div class="index-text" :style="indexTextStyle(item)" v-if="indexAttrConfig.showContent === 'number'">
                {{ getRowIndex(item) }}
              </div>
              <DsfIcon :name="getIconClass(item)" :style="indexTextStyle(item)" v-else-if="indexAttrConfig.showContent === 'icon'"></DsfIcon>
              <div class="image-inner data-view-common-bg-effect" v-else-if="indexAttrConfig.showContent === 'image'">
                <div class="index-text" :style="indexTextStyle(item)">
                  {{ getRowIndex(item) }}
                </div>
              </div>
            </div>
          </slot>
        </div>
        <div class="info">
          <!-- 名称等值插槽 -->
          <slot name="info-top" :row="item" :index="i">
            <div class="info-top">
              <div class="name" :title="item.name" :style="infoTextStyle(item, 'name')">{{ item.name }}</div>
              <div class="num-wrap">
                <div class="num" :style="infoTextStyle(item, 'value')">{{ item.value }}</div>
                <div class="unit" :style="infoTextStyle(item, 'unit')" v-if="unitTextStyle.flag && item.unit">
                  {{ item.unit }}
                </div>
              </div>
            </div>
          </slot>
          <ProgressDivBar
            :value="item.percent"
            :type="progressType"
            :baseProgressConfig="baseProgressConfig"
            :progressConfig="progressConfig(item)"
            :animationConfig="animationConfig"
            :effectConfig="effectConfigItem(item)"
            :borderConfig="borderConfig"
            v-if="progressType !== ''"
            :style="progressDivBarStyle"
          >
          </ProgressDivBar>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
const staticDataKeyDic = {
  rank: "排名",
  name: "名称",
  value: "数值",
  unit: "单位",
  percent: "百分比",
};
const staticData = [
  {
    name: "密西西比鳄",
    value: "13269",
    percent: "95",
    rank: "Top 1",
    unit: "只",
  },
  {
    name: "尼罗鳄",
    value: "3355",
    percent: "66",
    rank: "Top 2",
    unit: "只",
  },
  {
    name: "湾鳄",
    value: "2540",
    percent: "50",
    rank: "Top 3",
    unit: "只",
  },
  {
    name: "巨蜥",
    value: "2211",
    percent: "46",
    rank: "Top 4",
    unit: "只",
  },
  {
    name: "美国硬仆骨舌鱼",
    value: "688",
    percent: "16",
    rank: "Top 5",
    unit: "只",
  },
  {
    name: "俄罗斯鲟",
    value: "652",
    percent: "15.6",
    rank: "Top 6",
    unit: "只",
  },
  {
    name: "西比利亚鲟",
    value: "610",
    percent: "14.8",
    rank: "Top 7",
    unit: "只",
  },
  {
    name: "施氏鲟X鳇杂交鲟",
    value: "545",
    percent: "12",
    rank: "Top 8",
    unit: "只",
  },
  {
    name: "食蟹猴",
    value: "525",
    percent: "11.4",
    rank: "Top 9",
    unit: "只",
  },
  {
    name: "大青鲨",
    value: "448",
    percent: "10.2",
    rank: "Top 10",
    unit: "只",
  },
];

import ProgressDivBar from "./common/progressDivBar/index.vue";
import universalRuleMixin from "_dataview/mixins/universalRuleMixin";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
import createBackground from "_dataview/output/config/backgroundExtend.js";
import scrollMixins from "./common/scrollMixins";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
export default dsf.component({
  name: "DsfDataViewRankProgress",
  ctrlCaption: "排名组件",
  mixins: [$mixins.dataView, dataAnalysis, scrollMixins, universalRuleMixin],
  components: {
    ProgressDivBar,
  },
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "rankProgress",
    },
    padding: {
      type: Array,
      default: () => [0, 10, 0, 0],
    },
    // 序号
    indexAttrConfig: {
      type: Object,
      default: () => ({
        width: "68px",
        height: "28px",
        ...createCommonTextStyle({
          fontSize: "16px",
        }),
        showContent: "number",
        borderRadius: [14, 14, 14, 14],
        bgColors: [
          "linear-gradient(90deg, #E24A3B 0%, rgba(226,74,59,0.00) 67%)",
          "linear-gradient(90deg, #FF7700 0%, rgba(255,119,0,0.00) 67%)",
          "linear-gradient(90deg, #E3B22F 0%, rgba(227,178,47,0.00) 67%)",
          "linear-gradient(90deg, #18BE76 0%, rgba(24,190,118,0.00) 67%)",
        ],
        fontColors: ["#ffffff"],
        iconColors: ["#ffffff"],
        icons: [],
        images: [],
        map: "rank",
        indexWidth: 90,
        vAlign: "center",
      }),
    },
    progressSpace: {
      type: Number,
      default: 6,
    },
    progressType: {
      type: String,
      default: "general",
    },
    effectConfig: {
      type: Object,
      default: () => ({
        type: "line", // no,line、point
        vLine: {
          width: 2,
          colorList: ["#fff"],
        },
        point: {
          isBreathe: false,
          colorList: ["rgba(226,74,59,1)", "rgba(255,119,0,1)", "rgba(227,178,47,1)", "rgba(24,190,118,1)"],
          baseColorList: ["rgba(226,74,59,0.3)", "rgba(255,119,0,0.3)", "rgba(227,178,47,0.3)", "rgba(24,190,118,0.3)"],
        },
      }),
    },
    progressHeight: {
      type: Number,
      default: 3,
    },
    progressLineWidth: {
      type: Number,
      default: 5,
    },
    progressLineSpace: {
      type: Number,
      default: 1,
    },
    processColorList: {
      type: Array,
      default: () => [
        "linear-gradient(90deg, rgba(226,74,59,0.00) 0%, #E24A3B  100%)",
        "linear-gradient(90deg, rgba(255,119,0,0.00)  0%, #FF7700 100%)",
        "linear-gradient(90deg,  rgba(227,178,47,0.00)0%, #E3B22F 100%)",
        "linear-gradient(90deg,  rgba(24,190,112,0.00) 0%, #18BE76 100%)",
      ],
    },
    baseProgressConfig: {
      type: Object,
      default: () => ({
        flag: true,
        color: "rgba(255,255,255,0.2)",
      }),
    },
    borderConfig: {
      type: Object,
      default: () => ({
        flag: false,
        width: 1,
        type: "solid", // 1.目前支持实线与虚线
        color: "rgba(72,124,194,1)", // 不支持渐变
        radius: 0, // 支持渐变与普通
        gap: 0,
      }),
    },
    animationConfig: {
      type: Object,
      default: () => ({
        flag: true,
        duration: 3, // 时间为秒
      }),
    },
    // 名称样式
    nameTextStyle: {
      type: Object,
      default: () => ({
        flag: true,
        ...createCommonTextStyle({
          fontSize: "18px",
          fontFamily: "SourceHanSansCN-Regular",
        }),
      }),
    },
    nameRuleList: {
      type: Array,
      default: () => [],
    },
    valueTextStyle: {
      type: Object,
      default: () => ({
        flag: true,
        ...createCommonTextStyle({
          color: "#FFBC48",
          space: 0,
          fontWeight: "bold",
          fontSize: "18px",
        }),
      }),
    },
    valueRuleList: {
      type: Array,
      default: () => [],
    },
    unitTextStyle: {
      type: Object,
      default: () => ({
        flag: true,
        space: 5,
        ...createCommonTextStyle({
          fontSize: "16px",
        }),
      }),
    },
    unitRuleList: {
      type: Array,
      default: () => [],
    },
    fixEachRowType: {
      type: String,
      default: "fixHeight",
    },
    rowNum: {
      type: [String, Number],
      default: 5,
    },
    rowHeight: {
      type: [String, Number],
      default: 60,
    },
    autoCalculate: {
      type: Boolean,
      default: false,
    },
    // 整体背景
    wholeBackground: {
      type: Object,
      default: () => createBackground(),
    },
    // 静态数据
    staticData: {
      type: Array,
      default() {
        return staticData;
      },
    },
    // 表格数据
    excelData: {
      type: Array,
      default: () => {
        return dsf.dataview.utils.transformToExcelData(staticData, staticDataKeyDic);
      },
    },
    // 映射字段
    mapRelations: {
      type: Array,
      default() {
        return [
          {
            text: "名称",
            value: "name",
            map: "name",
            require: true,
          },
          {
            text: "值",
            value: "value",
            map: "value",
            require: true,
          },
          {
            text: "百分比",
            value: "percent",
            map: "percent",
          },
          {
            text: "单位",
            value: "unit",
            map: "unit",
          },
        ];
      },
    },
  },
  computed: {
    rankProgressStyle() {
      let backgroundObj =
        dsf.dataview.utils.$backgroundFormat(this.wholeBackground, "", {
          isBgInfoVar: true,
        }) || {};
      return {
        ...this.controlStyle,
        ...backgroundObj,
        ...this.getCommonEnterAnimateStyle,
        ...this.getBoxShadowConfig(true),
      };
    },
    rankProgressContentStyle() {
      return {};
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
    topRankStyle() {
      let style = {
        width: dsf.dataview.utils.transformPx(this.indexAttrConfig.indexWidth),
        justifyContent: this.indexAttrConfig.vAlign,
      };
      return style;
    },
    indexCommonStyle() {
      let indexAttrConfig = this.indexAttrConfig;
      let width = dsf.dataview.utils.transformPx(indexAttrConfig.width);
      let height = dsf.dataview.utils.transformPx(indexAttrConfig.height);
      let borderRadius = dsf.dataview.utils.transformArrayPx(indexAttrConfig.borderRadius);
      let style = {
        width,
        height,
        borderRadius,
      };
      return style;
    },
    progressDivBarStyle() {
      return {
        marginTop: dsf.dataview.utils.transformPx(this.progressSpace),
      };
    },
    progressConfig() {
      return (row) => {
        let color = this.getColorIcon(this, "processColorList", row.index);
        let config = {
          height: this.progressHeight,
          color: color,
          lineDash: [this.progressLineWidth, this.progressLineSpace],
        };
        return config;
      };
    },
  },
  watch: {
    rowNum() {
      if (this.isDesign) {
        this.calcFixEachRowType();
      }
    },
    autoCalculate() {
      const data = _.cloneDeep(this.serviceData);
      this.dataAnalysis(data);
    },
    fixEachRowType() {
      this.init();
    },
  },
  methods: {
    // 复制组件样式
    copyComponentStyle() {
      return {
        _props: this.getComponentStyle(),
        numberConfig: this.indexAttrConfig,
        // 固定为数组格式，按主、次顺序
        textStyles: [this.nameTextStyle, this.valueTextStyle],
        backgrounds: [this.wholeBackground],
        colorScheme: this.processColorList,
      };
    },
    // 粘贴组件样式
    pasteComponentStyle(config) {
      let groups = this.$designer.attributesGroup.filter((it) => !/数据|属性|插槽/.test(it.name));
      if (config._props.ctrlName !== this.ctrlName) {
        groups = groups.filter((it) => /布局|边框设置|背景|入场动画|滚动设置/.test(it.name));
        const { numberConfig, textStyles = [], backgrounds = [], colorScheme } = config;
        if (numberConfig) {
          numberConfig.map = this.indexAttrConfig.map; // 不改变映射
          this.updateComponentStyle("indexAttrConfig", numberConfig);
        }
        this.updateComponentStyle("nameTextStyle", textStyles[0]);
        this.updateComponentStyle("valueTextStyle", textStyles[1]);
        this.updateComponentStyle("unitTextStyle", textStyles[2]);
        this.updateComponentStyle("wholeBackground", backgrounds[0]);
        this.updateComponentStyle("processColorList", colorScheme);
      }
      this.setComponentStyle(groups, config._props);
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
      try {
        const item = data[0];
        if (item) {
          // 构造数据字段
          for (let i = 1; i < keys.length; i++) {
            const key = keys[i][0];
            const title = keys[i][1];

            const value = dsf.dataview.utils.matchNumberAndSuffix(item[key]);
            if (value && value.number) {
              const unit = value.unit;
              data = data.map((it) => {
                const value = dsf.dataview.utils.matchNumberAndSuffix(it[key]);
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

    dataAnalysis(data) {
      if (!data.length) {
        this.hasData = false;
        return;
      }
      if (eval(this.dynamicRules)) {
        this.handleData(data);
      } else {
        if (this.$listeners["interceptOptions"]) {
          this.$dispatch("interceptOptions", { data: data, vm: this });
        } else {
          this.handleData(data);
        }
      }
    },
    // 处理数据
    handleData(data) {
      let mapRelations = this.mapRelations;
      let nameMap = this.dataType === "static" ? "name" : mapRelations[0].map;
      let valueMap = this.dataType === "static" ? "value" : mapRelations[1].map;
      let percentMap = this.dataType === "static" ? "percent" : mapRelations[2].map || "percent";
      let unitMap = this.dataType === "static" ? "unit" : mapRelations[3].map || "unit";

      // 是否自动计算
      const dealNumber = (value) => {
        return String(value).replace(/[^\d.-]/g, "") * 1;
      };

      const value = data.map((it) => dealNumber(it[valueMap]));
      const min = Math.min(...value) || 0;
      const minAbs = Math.abs(min);
      const max = Math.max(...value) || 0;
      const total = max + minAbs;

      this.data = data
        .map((item, index) => {
          let percent = item[percentMap];
          let value = item[valueMap];
          let name = item[nameMap];
          if (this.autoCalculate || percent === void 0) {
            percent = ((dealNumber(value) + minAbs) / total) * 100;
          }
          percent = parseFloat(percent);
          return {
            ...item,
            keyId: dsf.uuid(),
            name,
            value,
            percent,
            index,
            unit: item[unitMap] || "",
          };
        })
        .sort((a, b) => b.percent - a.percent)
        .map((it, index) => {
          return {
            ...it,
            index,
          };
        });
      Promise.resolve().then(() => {
        this.$nextTick(() => {
          setTimeout(() => {
            this.calcFixEachRowType();
          }, 200);
        });
      });
    },
    // 重新滚动
    calcFixEachRowType() {
      let el = this.getScrollerEl();
      //高度按照行计算
      if (this.fixEachRowType === "rowNum") {
        this.rowHeightNum = Math.floor(el.clientHeight / this.rowNum);
      }
      setTimeout(() => {
        this.animation();
      });
    },
    clickItem(evt, item) {
      this.$dispatch("clickItem", item);
      this.loadClickEvents(item, evt);
    },
    getRowIndex(row) {
      let indexAttrConfig = this.indexAttrConfig;
      let indexField = indexAttrConfig.map;
      if (row[indexField]) {
        return row[indexField];
      }
      return `Top ${row.index + 1}`;
    },
    commonIndexStyle(row) {
      let indexAttrConfig = this.indexAttrConfig;
      let style = {};
      let commonStyle = this.indexCommonStyle;
      let bgColor = this.getColorIcon(indexAttrConfig, "bgColors", row.index);
      let bgVar = {};
      if (indexAttrConfig.showContent === "image") {
        let nowImage = this.getColorIcon(indexAttrConfig, "images", row.index);
        bgVar = this.dvBackgroundFormat(nowImage, {
          isBgInfoVar: true,
          defaultBgVarCss: {
            "--border-radius": commonStyle.borderRadius,
          },
        });
      }
      return {
        ...style,
        ...commonStyle,
        background: bgColor,
        ...bgVar,
      };
    },
    indexTextStyle(row) {
      let indexAttrConfig = this.indexAttrConfig;
      let textStyle = dsf.dataview.utils.transformTextStyle(indexAttrConfig);
      let fontColor = this.getColorIcon(indexAttrConfig, "fontColors", row.index);
      let fontColorCss = dsf.dataview.utils.getTextColor(fontColor);
      if (indexAttrConfig.showContent === "icon") {
        let iconColor = this.getColorIcon(indexAttrConfig, "iconColors", row.index);
        fontColorCss = {
          color: iconColor,
        };
      }
      let style = {
        ...textStyle,
        ...fontColorCss,
      };
      return style;
    },
    effectConfigItem(row) {
      let effectConfig = dsf.mix(true, {}, this.effectConfig);
      let vLineColor = this.getColorIcon(effectConfig.vLine, "colorList", row.index);
      let pointColor = this.getColorIcon(effectConfig.point, "colorList", row.index);
      let pointBaseColor = this.getColorIcon(effectConfig.point, "baseColorList", row.index);
      effectConfig.vLine.color = vLineColor;
      effectConfig.point.color = pointColor;
      effectConfig.point.baseColor = pointBaseColor;
      return effectConfig;
    },
    getIconClass(row) {
      let indexAttrConfig = this.indexAttrConfig;
      let icon = this.getColorIcon(indexAttrConfig, "icons", row.index);

      return icon;
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
    infoTextStyle(item, field) {
      let allTextStyle = this[`${field}TextStyle`];
      let textStyle = dsf.dataview.utils.transformTextStyle(allTextStyle);
      let ruleStyle = this.handleUniversalRule(item, this[`${field}RuleList`])?.text || {};
      let style = {
        ...textStyle,
        ...ruleStyle,
        marginLeft: dsf.dataview.utils.transformPx(allTextStyle.space),
      };
      return style;
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/rankProgress.scss";
</style>
