<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-24 16:57:11
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-03-27 09:55:15
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">X轴<span>： </span></div>
      <DesDVSelect class="min" :data="{ dictionary: xAxisList }" :value="series.xAxisIndex" @change="changeValue($event, series, 'xAxisIndex')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">Y轴<span>： </span></div>
      <DesDVSelect class="min" :data="{ dictionary: yAxisList }" :value="series.yAxisIndex" @change="changeValue($event, series, 'yAxisIndex')" />
    </div>
    <div class="ds-designer-property property-item" v-show="!series.itemStyle.isCanvas">
      <div class="property-item-name">柱体颜色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" v-model="itemColor" @change="changeColor($event, series.itemStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item" v-show="!series.itemStyle.isCanvas" :key="series.itemStyle.isCanvas">
      <div class="property-item-name">单个颜色<span>： </span></div>
      <DesDVMoreModeColor :config="modeColor" v-model="singleData" />
    </div>
    <div class="ds-designer-property property-item" v-show="!series.itemStyle.isCanvas">
      <div class="property-item-name" style="opacity: 0">单个颜色<span>： </span></div>
      <dsfButtonDialog
        @click="settingSingleRule"
        :hasValue="isSingleRule"
        :config="{
          buttonText: '颜色规则',
        }"
      >
      </dsfButtonDialog>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体圆角<span>： </span></div>
      <DesDVBorderRadius :value="series.itemStyle.barBorderRadius" @change="changeValue($event, series.itemStyle, 'barBorderRadius')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">柱体宽度<span>： </span></div>
      <DesDVPixel
        class="min"
        :value="series.barWidth | barWidthFilter"
        @change="changeValue($event, series, 'barWidth')"
        :options="[
          {
            value: '%',
            label: '%',
          },
          {
            value: '',
            label: 'fx',
          },
        ]"
      />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">柱体间隙<span>： </span></div>
      <DesDVNumber class="min" :config="{ unit: '%' }" :value="series.barGap | valueFilter" @change="changeValue($event + '%', series, 'barGap')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体背景<span>： </span></div>
      <DesDVSwitch v-model="series.showBackground" @change="changeValue($event, series, 'showBackground')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">条纹样式<span>： </span></div>
      <DesDVSwitch v-model="series.itemStyle.isCanvas" @change="changeValue($event, series.itemStyle, 'isCanvas')" />
    </div>
    <template v-if="series.itemStyle.isCanvas && series.itemStyle.canvasConfig">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">条纹高度<span>： </span></div>
        <DesDVNumber :config="{ min: 1 }" v-model="series.itemStyle.canvasConfig.lineWidth" @change="changeValue($event, series.itemStyle.canvasConfig, 'lineWidth')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">条纹间距<span>： </span></div>
        <DesDVNumber :config="{ min: 1 }" v-model="series.itemStyle.canvasConfig.distance" @change="changeValue($event, series.itemStyle.canvasConfig, 'distance')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">条纹颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" :value="series.itemStyle.barColor" @change="changeColor($event, series.itemStyle, 'barColor')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签展示<span>： </span></div>
      <DesDVSwitch v-model="series.label.show" @change="changeValue($event, series.label, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">位置<span>： </span></div>
      <Direction class="vertical-items" :type="seriesLabelPositionType" v-model="series.label.position" :mapData="seriesLabelPositionMapping" @input="changeValue($event, series.label, 'position')">
      </Direction>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <!-- 标记线 -->
    <MarkLine :markLine="markLine" :chart="chart" @updateChart="$emit('updateChart')"></MarkLine>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">是否堆叠<span>： </span></div>
      <DesDVSwitch v-model="series.isStack" @change="changeValue($event, series, 'isStack')" />
    </div>
    <template v-if="series.isStack">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">数据堆叠<span>： </span></div>
        <el-input class="data-view-text" v-model="series.stack" @change="changeValue($event, series, 'stack')" />
        <DesDVToolTipsIcon
          :data="{
            desc: '同个类目轴上系列配置相同的 stack 值可以堆叠放置。',
          }"
        ></DesDVToolTipsIcon>
      </div>
    </template>
  </div>
</template>
<script>
import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";
import dsfButtonDialog from "_dataview/designer/common/components/dsfButton.vue";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
import MarkLine from "./markLine.vue";
export default {
  name: "seriesBar",
  mixins: [commonMixin],
  inject: ["owner"],
  components: {
    Direction,
    MarkLine,
    dsfButtonDialog,
  },
  props: {
    chart: {
      type: Object,
      require: true,
    },
    series: {
      type: Object,
      require: true,
    },
  },
  filters: {
    valueFilter(val) {
      return (val + "").replace(/%/g, "");
    },
    barWidthFilter(val) {
      const isPercent = String(val).includes("%");
      var numVal = parseInt(val);
      const nowVal = isNaN(numVal) ? "" : Math.abs(numVal).toString() + (isPercent ? "%" : "");
      return nowVal;
    },
  },
  computed: {
    markLine() {
      if (!this.series.markLine) {
        this.$set(this.series, "markLine", {
          symbol: ["circle", "arrow"],
          symbolSize: 10,
          data: [],
          cacheData: [], // 为了配合show 和 data 的联动
        });
      }
      return this.series.markLine;
    },
    isSingleRule() {
      return !!this.series.singleDataRuleList?.length;
    },
    nameTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.series.label;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.series.label, v);
        this.$emit("updateChart");
      },
    },
    singleData: {
      get() {
        if (this.series.itemStyle.isCanvas) {
          return [];
        }
        let res = [];
        let defaultColor = this.series.itemStyle.color || "red";
        this.series.singleData.forEach((it) => {
          let color = it.itemStyle ? it.itemStyle.color : defaultColor;
          res.push(dsf.dataview.utils.convertChartToCSSColor(color));
        });
        return res;
      },
      set(v) {
        if (this.series.itemStyle.isCanvas) {
          return [];
        }
        let singleData = [];
        v.forEach((it) => {
          const color = dsf.dataview.utils.convertCSSToEChartsColor(it);
          singleData.push({
            itemStyle: {
              color,
            },
          });
        });
        this.series.data.forEach((it, index) => {
          if (singleData[index]) {
            if (dsf.isObject(it)) {
              it.itemStyle = singleData[index].itemStyle;
            } else {
              this.series.data[index] = {
                value: it,
                itemStyle: singleData[index].itemStyle,
              };
            }
          } else {
            if (dsf.isObject(it)) {
              Reflect.deleteProperty(it, "itemStyle");
            }
          }
        });
        this.series.singleData = singleData;
        this.$emit("updateChart");
      },
    },
    xAxisList() {
      return this.chart.xAxis.map((it, index) => {
        return {
          text: `X${index + 1}轴`,
          value: index,
        };
      });
    },
    yAxisList() {
      return this.chart.yAxis.map((it, index) => {
        return {
          text: `Y${index + 1}轴`,
          value: index,
        };
      });
    },
    seriesLabelPositionType() {
      return this.chart.isReturn ? "horizontal" : "vertical";
    },
    seriesLabelPositionMapping() {
      let arr = this.chart.isReturn
        ? [
            { mapName: "left", mapKey: "left" },
            { mapName: "inside", mapKey: "center" },
            { mapName: "right", mapKey: "right" },
          ]
        : [
            { mapName: "top", mapKey: "top" },
            { mapName: "inside", mapKey: "middle" },
            { mapName: "bottom", mapKey: "bottom" },
          ];
      return arr;
    },
  },
  data() {
    const colors = this.chart.color;
    return {
      selectOptions: [
        {
          value: "%",
          label: "%",
        },
      ],
      itemColor: "",
      modeColor: {
        colors: colors,
        lastOneDel: true,
        type: "both",
      },
      colorConfig: {
        type: "color",
      },
      bothConfig: {
        type: "both",
      },
    };
  },
  created() {
    if (this.series.stack) {
      this.series.isStack = true;
    }
    this.judgeIsCanvas(this.series.itemStyle.isCanvas);
    //样式风格改变
    dsf.emit.$on("updateStyleChange", this.styleChange, this.owner.$children[0]);
  },
  beforeDestroy() {
    dsf.emit.$remove("updateStyleChange", this.owner.$children[0]);
  },
  methods: {
    styleChange() {
      const itemColor = this.series.itemStyle.color;
      this.itemColor = dsf.dataview.utils.convertChartToCSSColor(itemColor);
    },
    judgeIsCanvas(flag) {
      if (!flag) {
        if (this.series.itemStyle.color && this.series.itemStyle.color.image) {
          let nowColor = this.series.itemStyle.barColor;
          this.itemColor = dsf.dataview.utils.convertChartToCSSColor(nowColor);
          this.series.singleData = [];
          this.$set(this.series.itemStyle, "color", nowColor);
        } else {
          const itemColor = this.series.itemStyle.color;
          this.itemColor = dsf.dataview.utils.convertChartToCSSColor(itemColor);
        }
      }
    },
    changeColor(val, item, key) {
      const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      if (!_.isEqual(item[key], color)) {
        this.$set(item, key, color);
        this.$emit("updateChart");
      }
    },
    changeValue(val, item, key) {
      if (key === "isCanvas") {
        this.judgeIsCanvas(val);
      } else if (key === "isStack") {
        if (val) {
          item.stack = "all";
        } else {
          item.stack = "";
        }
      }
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
    settingSingleRule() {
      let self = this;
      let list = this.series.singleDataRuleList || [];
      this.$openDialog({
        title: "颜色规则",
        content: "DesDVUniversalRuleConfig",
        params: {
          currentData: list,
          owner: this.owner,
          config: {
            typeOptions: [
              {
                label: "色值",
                value: "color",
              },
            ],
          },
        },
        width: "1100px",
        height: "60vh",
        btns: [
          {
            text: "确定",
            handler(res) {
              if (res && res.yes) {
                let result = res.yes();
                self.$set(self.series, "singleDataRuleList", result);
                self.$emit("updateChart");
              }
            },
          },
          {
            text: "取消",
          },
        ],
      });
    },
  },
};
</script>
