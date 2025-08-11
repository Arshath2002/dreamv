<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-22 14:08:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:07:45
-->
<template>
  <div style="flex:1;">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图例<span>： </span></div>
      <DesDVSwitch v-model="legend.enabled" @change="changeValue($event, legend, 'enabled')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="legend.enabled">
      <div class="property-item-name">排列<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" v-model="legend.layout" @change="changeValue($event, legend, 'layout')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="legend.enabled">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="legend.enabled">
      <div class="property-item-name"></div>
      <Direction class="horizontal-items" style="margin-right:10px" type="horizontal" v-model="legend.align" @input="changeValue($event, legend, 'align')"></Direction>
      <Direction class="vertical-items" type="vertical" v-model="legend.verticalAlign" @input="changeValue($event, legend, 'verticalAlign')"></Direction>
    </div>
  </div>
</template>
<script>

import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "DesDVChartHighLegend",
  props: {
    owner: {
      type: Object,
      require: true,
    },
  },
  mixins:[commonMixin],
  components: {  Direction },
  computed: {
    legend() {
      return this.chart ? this.chart.legend : {};
    },
    nameTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.owner.chart.legend.itemStyle;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.legend.itemStyle, v);
        this._updateChart();
      },
    },
  },
  data() {
    return {
      chart: this.owner.chart,
      select: [
        {
          value: "",
          label: "fx",
        },
      ],

      dictionary: [
        {
          text: "横向",
          value: "horizontal",
        },
        {
          text: "纵向",
          value: "vertical",
        },
      ],
    };
  },
  created() {
    this._updateChart = _.debounce(this.updateChart, 500);
  },
  mounted() {
    dsf.emit.$on(
      "updatePropertyChart",
      () => {
        this.chart = this.owner.chart;
      },
      this.owner.$children[0]
    );
  },
  beforeDestroy() {
    dsf.emit.$remove("updatePropertyChart", this.owner.$children[0]);
  },
  methods: {
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this._updateChart();
    },
    updateChart() {
      dsf.emit.$emit(
        "updateChart",
        {
          chart: this.chart,
        },
        [this.owner.$children[0]]
      );
    },
  },
};
</script>
