<!--
 * @Description: k线图系列
 * @Author: shenah
 * @Date: 2024-07-05 09:12:40
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 10:12:46
-->

<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">X轴<span>： </span></div>
      <DesDVSelect class="min"  :data="{ dictionary: xAxisList }"  :value="series.xAxisIndex" @change="changeItemValue($event, series, 'xAxisIndex')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">Y轴<span>： </span></div>
      <DesDVSelect class="min" :data="{ dictionary: yAxisList }" :value="series.yAxisIndex" @change="changeItemValue($event, series, 'yAxisIndex')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱宽度<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.barWidth" @change="changeItemValue($event, series, 'barWidth')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">阳柱颜色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" v-model="itemColor" @change="changeItemColor($event, series.itemStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">阴柱颜色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" v-model="itemColor0" @change="changeItemColor($event, series.itemStyle, 'color0')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">边框<span>： </span></div>
      <DesDVSwitch :value="series.itemStyle.isShowBorder" @change="changeItemValue($event, series.itemStyle, 'isShowBorder')" />
    </div>
    <!-- 边框 -->
    <template v-if="series.itemStyle.isShowBorder">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">线宽<span>： </span></div>
        <DesDVNumber :value="series.itemStyle.borderWidth" @change="changeItemValue($event, series.itemStyle, 'borderWidth')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">阳线<span>： </span></div>
        <DesDVColorPicker :config="bothConfig" v-model="itemBorderColor" @change="changeItemColor($event, series.itemStyle, 'borderColor')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">阴线<span>： </span></div>
        <DesDVColorPicker :config="bothConfig" v-model="itemBorderColor0" @change="changeItemColor($event, series.itemStyle, 'borderColor0')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">十字星<span>： </span></div>
        <DesDVColorPicker :config="bothConfig" v-model="itemBorderColorDoji" @change="changeItemColor($event, series.itemStyle, 'borderColorDoji')" />
      </div>
    </template>
    <!-- 标记线 -->
    <CandlestickMarkLine :markLine="series.markLine" :chart="chart" :mapFieldList="mapFieldList" @updateChart="$emit('updateChart')"></CandlestickMarkLine>
  </div>
</template>
<script>
import itemMixin from "../itemMixin";
import CandlestickMarkLine from "./candlestickMarkLine.vue";
export default {
  name: "seriesCandlestick",
  mixins: [itemMixin],
  inject: ["owner"],
  components: { CandlestickMarkLine },
  props: {
    chart: {
      type: Object,
      require: true,
    },
    series: {
      type: Object,
      require: true,
    },
    mapFieldList: {
      type: Array,
      require: true,
    },
  },
  filters: {
    valueFilter(val) {
      return (val + "").replace(/%/g, "");
    },
  },
  computed: {
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
  },
  data() {
    return {
      itemColor: "",
      itemBorderColor: "",
      itemColor0: "",
      itemBorderColor0: "",
      itemBorderColorDoji: "",
    };
  },
  created() {
    this.styleChange();
    dsf.emit.$on("updateStyleChange", this.styleChange, this.owner.$children[0]);
  },
  beforeDestroy() {
    dsf.emit.$remove("updateStyleChange", this.owner.$children[0]);
  },
  methods: {
    styleChange() {
      let arr = ["color", "borderColor", "color0", "borderColor0", "borderColorDoji"];
      arr.forEach((key) => {
        const nowColor = this.series.itemStyle[key];
        this[`item${_.upperFirst(key)}`] = dsf.dataview.utils.convertChartToCSSColor(nowColor);
      });
    },
    changeSpecialItemKey(val, item, key) {
      if (key === "isShowBorder") {
        if (val) {
          this.$set(item, "borderWidth", 1);
        } else {
          this.$set(item, "borderWidth", 0);
        }
      }
    },
  },
};
</script>
