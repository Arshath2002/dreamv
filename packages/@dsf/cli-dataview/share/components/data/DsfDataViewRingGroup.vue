<!--圆环组-->
<template>
  <div
    class="dsf-dataview-ringgroup data-view-item-wrap ds-control data-view-no-padding"
    :style="ringGroupStyle"
    v-loading="dataLoad"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
  >
    <dsf-empty-data v-if="!hasData"></dsf-empty-data>
    <div
      class="itembox"
      v-if="hasData"
      :style="itemBoxStyle"
    >
      <div
        class="item"
        v-for="(d, index) in data"
        :key="d.id"
        @click="clickItem(d)"
        :style="itemStyle"
      >
        <div
          class="numbox"
          :style="numBoxStyle(index)"
        >
          <div class="num">
            <DsfDataViewScrollDigital
              :isDesign="isDesign"
              :decimals="decimals"
              :padding="[0, 0, 0, 0]"
              dataType="static"
              :isCycle="isCycle"
              :cycleSpaceTime="cycleSpaceTime"
              :staticData="{
                startVal: 0,
                endVal: d.value,
              }"
            >
              <template #default="{ data }">
                <span
                  :title="data"
                  :style="getValueStyle"
                >
                  {{ transformUnit(data, unitTransform, false) }}
                </span>
              </template>
            </DsfDataViewScrollDigital>
          </div>
          <div :style="getUnitStyle">{{ d.unit }}</div>
        </div>
        <div
          class="arrow"
          :style="arrowStyle(index)"
        ></div>
        <div :style="getTitleStyle">{{ d.name }}</div>
        <div
          class="line"
          :style="lineStyle(index)"
          v-if="index < data.length - 1"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
const staticDataKeyDic = {
  value: "数量",
  unit: "单位",
  name: "名称",
};
const staticData = [
  {
    value: "1998",
    unit: "亿元",
    name: "总资产",
  },
  {
    value: "270",
    unit: "亿元",
    name: "营业收入",
  },
  {
    value: "2000",
    name: "平均从业人员",
    unit: "",
  },
];
import border from "_dataview/mixins/border.js";
import { createCommonTextStyle } from "_dataview/output/config/commonConfig";
import dataAnalysis from "_dataview/mixins/dataAnalysis.js";
export default dsf.component({
  name: "DsfDataViewRingGroup",
  ctrlCaption: "圆环组",
  mixins: [$mixins.dataView, dataAnalysis, border],
  components: {},
  props: {
    //风格对应组件key
    styleMapKey: {
      type: String,
      default: "ringGroup",
    },
    titleTextStyle: {
      type: Object,
      default: () =>
        createCommonTextStyle({
          fontSize: 16,
          color: "#FFFFFF",
        }),
    },
    valueTextStyle: {
      type: Object,
      default: () =>
        createCommonTextStyle({
          fontSize: 30,
          color: "rgb(96, 98, 102)",
        }),
    },
    isCycle: {
      type: Boolean,
      default: false
    },
    cycleSpaceTime: {
      type: Number,
      default: 3000,
    },
    unitTextStyle: {
      type: Object,
      default: () =>
        createCommonTextStyle({
          fontSize: 14,
          color: "rgb(96, 98, 102)",
        }),
    },
    unitTransform: {
      type: String,
      default: "",
    },
    staticData: {
      type: Array,
      default: () => staticData,
    },
    colors: {
      type: Array,
      default() {
        return ["#7359FB", "#0B5DFF", "#019DAB"];
      },
    },
    decimals: {
      type: Number,
      default: 0,
    },
    height: {
      type: String,
      default: "auto",
    },
    alignStyle: {
      type: Object,
      default() {
        return {
          vAlign: "middle",
          hAlign: "center",
        };
      },
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
            text: "名称",
            value: "name",
            map: "name",
            hideDigit: true,
          },
          {
            text: "数量",
            value: "value",
            map: "value",
            hideDigit: true,
          },
          {
            text: "单位",
            value: "unit",
            map: "unit",
            hideDigit: true,
          },
        ];
      },
    },
  },
  data() {
    return { data: [] };
  },
  computed: {
    getTitleStyle() {
      return dsf.dataview.utils.transformTextStyle(this.titleTextStyle);
    },
    getValueStyle() {
      return dsf.dataview.utils.transformTextStyle(this.valueTextStyle);
    },
    getUnitStyle() {
      return dsf.dataview.utils.transformTextStyle(this.unitTextStyle);
    },
    ringGroupStyle() {
      let { hAlign, vAlign } = this.alignStyle;
      let mapKey = {
        top: "baseline",
        middle: "center",
        bottom: "flex-end",
      };
      return {
        "justify-content": hAlign,
        "align-items": mapKey[vAlign],
        ...this.getCommonEnterAnimateStyle,
      };
    },
    itemBoxStyle() {
      let { padding } = this;
      return {
        padding: dsf.dataview.utils.transformArrayPx(padding),
      };
    },
    itemStyle() {
      let style = {
        ...this.eventCursorPointerStyle
      };
      return style
    },
  },
  created() {
    this.downwardCompatible();
  },
  methods: {
    //兼容以前样式设置
    downwardCompatible() {
      let mapKey = {
        baseline: "top",
        center: "middle",
        end: "bottom",
      };
      if (this.$attrs.align) {
        let style = this.alignStyle;
        style.hAlign = this.$attrs.align;
        style.vAlign = mapKey[this.$attrs.verticalAlign];
        this.$emit("update:alignStyle", style);
      }
    },
    numBoxStyle(dataIndex) {
      let length = this.colors.length;
      let index = dataIndex ? dataIndex % length : 0;
      return {
        "border-color": this.colors[index],
      };
    },
    arrowStyle(dataIndex) {
      let length = this.colors.length;
      let index = dataIndex ? dataIndex % length : 0;
      return {
        "border-top-color": this.colors[index],
      };
    },
    lineStyle(dataIndex) {
      let length = this.colors.length;
      let index = dataIndex ? dataIndex % length : 0;
      let next = index + 1 > length - 1 ? 0 : index + 1;
      return {
        background: `linear-gradient(to right, ${this.colors[index]}, ${this.colors[next]})`,
      };
    },
    dataAnalysis(data) {
      if (!data || data.length == 0) {
        this.hasData = false;
        return false;
      }
      if (eval(this.dynamicRules) || this.dataType === "excel") {
        let titlekey = this.mapRelations[0].map;
        let valuekey = this.mapRelations[1].map;
        let unitkey = this.mapRelations[2].map;
        this.data = data.map((it) => {
          let unit = it[unitkey];
          return {
            name: it[titlekey],
            value: it[valuekey],
            unit: unit !== undefined ? unit : unitkey,
          };
        });

        this.pureData = _.cloneDeep(this.data);
      } else {
        this.pureData = _.cloneDeep(this.data);
        this.data = data;
      }
    },
    clickItem(row) {
      this.loadClickEvents(row);
    },
  },
  watch: {
    staticData() {
      this.init();
    },
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/ringgroup.scss";
</style>
