<!--
 * @Description: 多颜色圆环
 * @Author: shenah
 * @Date: 2024-01-17 14:30:37
 * @LastEditors: shenah
 * @LastEditTime: 2024-09-09 19:58:45
-->
<template>
  <div
    class="data-view-item-wrap ds-control data-view-more-ring-color data-view-no-padding"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle
    }"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <dsf-empty-data v-if="!hasData"></dsf-empty-data>
    <div class="more-ring-color-items" :style="moreRingColorItemsStyle" ref="moreRingColorItemsRef">
      <div class="more-ring-color-item" v-for="(item, index) in data" :style="moreRingColorItemStyle" :key="item.keyId" @click="clickItem(item)">
        <svgRingColor :ringSize="calcSize" :row="item" :valueTextStyle="valueTextStyle" :config="config" :rowIndex="index" :gradientDirection="gradientDirection"></svgRingColor>
        <div class="name" :style="nameStyle">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import svgRingColor from "./svgRing.vue";
import { createDefaultRingConfig } from "./config";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
const staticDataKeyDic = {
  name: "名称",
  value: "百分比",
};
const staticData = [
  {
    name: "故障1",
    value: "85",
  },
  {
    name: "故障2",
    value: "55",
  },
  {
    name: "故障3",
    value: "35",
  },
  {
    name: "故障4",
    value: "15",
  },
];
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewMoreRingColor",
  ctrlCaption: "多彩圆环占比组",
  mixins: [$mixins.dataView, dataAnalysis],
  components: { svgRingColor },
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "moreRingColor",
    },
    //圆环渐变方向
    gradientDirection: {
      type: String,
      default: "vec",
    },
    flex: {
      type: String,
      default: "center",
    },
    config: {
      type: Object,
      default: () => createDefaultRingConfig(),
    },
    //圆环大小模式 px 固定大小，一行个数
    sizeMode: {
      type: String,
      default: "px",
    },
    size: {
      type: Number,
      default: 160,
    },
    //一行数量
    rowNum: {
      type: Number,
      default: 3,
    },
    barPadding: {
      type: Array,
      default: () => [4, 4, 4, 4],
    },
    titleTextStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          fontSize: "20",
          color: "rgba(51,51,51,1)",
        });
      },
    },
    valueTextStyle: {
      type: Object,
      default() {
        return createCommonTextStyle({
          fontSize: "20",
          color: "rgba(51,51,51,1)",
        });
      },
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    height: {
      type: String,
      default: "auto",
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
            hideDigit: true,
          },
          {
            text: "百分比",
            value: "value",
            map: "value",
            hideDigit: true,
          },
        ];
      },
    },
  },
  computed: {
    moreRingColorItemsStyle() {
      return {
        "justify-content": this.flex,
      };
    },
    moreRingColorItemStyle() {
      let barPadding = this.barPadding;
      let padding = "";
      for (let i = 0; i < barPadding.length; i++) {
        let it = barPadding[i];
        if (dsf.isNumber(it)) {
          padding += this.pxToRem(it) + " ";
        } else {
          padding += it + " ";
        }
      }
      let style = {
        padding,
        ...this.eventCursorPointerStyle
      };
      return style;
    },
    calcSize() {
      if (this.sizeMode === "px") {
        return this.size;
      }
      return this.realSize;
    },
    nameStyle() {
      return dsf.dataview.utils.transformTextStyle(this.titleTextStyle);
    },
  },
  watch: {
    sizeMode() {
      if (this.isDesign) {
        this.$nextTick(() => {
          this.resize && this.resize();
        });
      }
    },
    rowNum() {
      if (this.isDesign) {
        this.$nextTick(() => {
          this.resize && this.resize();
        });
      }
    },
    size() {
      if (this.isDesign) {
        this.$nextTick(() => {
          this.resize && this.resize();
        });
      }
    },
    barPadding() {
      if (this.isDesign) {
        this.$nextTick(() => {
          this.resize && this.resize();
        });
      }
    },
    staticData() {
      if (this.isDesign) {
        this.init();
      }
    },
  },
  data() {
    return {
      realSize: 0,
    };
  },
  created() {
    // 为了兼容以后新增属性
    this.$emit("update:config", {
      ...createDefaultRingConfig(),
      ...this.config,
    });
    this.compatibleTextStyleProp()
  },
  methods: {
    compatibleTextStyleProp() {
      if (this.$attrs.titleFontSize) {
        const titleTextStyle = createCommonTextStyle({
          color: this.$attrs.titleColor,
          fontFamily: this.$attrs.titleFontFamily,
          fontSize: this.$attrs.titleFontSize,
          fontWeight: this.$attrs.titleIsBold ? "bold" : "normal",
        });
        this.$emit("update:titleTextStyle", titleTextStyle);
      }
    },
    clickItem(item) {
      this.$dispatch("clickItem", item);
      this.loadClickEvents(item);
    },
    dataAnalysis(data) {
      //暂无数据
      if (!data.length) {
        this.hasData = false;
        return false;
      }
      let nowData = data;
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        let mapRelations = this.mapRelations;
        let name = mapRelations[0].map;
        let value = mapRelations[1].map;
        nowData = data.map((it) => {
          let nowValue = this.handleMapRelationNum(it[value], mapRelations[1]);
          return {
            ...it,
            name: it[name],
            value: nowValue,
          };
        });
      } else {
        nowData = data;
      }
      this.data = nowData.map((item) => ({
        ...item,
        keyId: dsf.uuid(0),
      }));
    },
    modifySize() {
      let barPadding = this.barPadding;
      let max = Math.max(...barPadding);
      let { offsetWidth } = this.$refs.moreRingColorItemsRef;
      //TODO:减去哪里有问题8
      this.realSize = Math.floor(offsetWidth / this.rowNum) - max - 8;
    },
    resize() {
      if (this.sizeMode === "num") {
        this.modifySize();
      }
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/moreRingColor.scss";
</style>
