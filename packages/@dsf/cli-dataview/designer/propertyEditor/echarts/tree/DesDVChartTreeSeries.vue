<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">宽度<span>： </span></div>
      <DesDVPixel :options="options" :value="series.width" @change="changeValue($event, series, 'width')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">高度<span>： </span></div>
      <DesDVPixel :options="options" :value="series.height" @change="changeValue($event, series, 'height')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name flex-center">内边距<span>： </span></div>
      <DesDVMargins v-model="getPadding" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">排列<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: direction }"  :value="series.orient" @change="changeValue($event, series, 'orient')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">线条样式<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: lineOptions }" :value="series.edgeShape" @change="changeValue($event, series, 'edgeShape')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">初始层级<span>： </span></div>
      <DesDVNumber :config="{ min: -1 }" v-model="series.initialTreeDepth" @change="_updateChart"></DesDVNumber>
      <DesDVToolTipsIcon
        :data="{
          desc: '根节点从 0 开始，-1 表示展开所有',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标记展示<span>： </span></div>
      <DesDVSwitch v-model="showSymbol" @change="changeValue($event ? 'circle' : 'none', series, 'symbol')" />
    </div>
    <div class="ds-designer-property property-item" v-if="series.symbol !== 'none'">
      <div class="property-item-name property-item ml20" style="align-items: center">
        大小
        <span>： </span>
        <DesDVNumber :config="{ unit: 'px', min: 0 }" v-model="series.symbolSize" @change="_updateChart"></DesDVNumber>
      </div>
    </div>
    <div class="ds-designer-property property-item" v-if="series.symbol !== 'none'">
      <div class="property-item-name property-item ml20" style="align-items: center">
        <span style="white-space: nowrap">颜色： </span>
        <DesDVColorPicker :config="{ type: 'color' }" v-model="series.itemStyle.color" @change="_updateChart"></DesDVColorPicker>
      </div>
    </div>
    <div class="ds-designer-property property-item" v-if="series.symbol !== 'none'">
      <div class="property-item-name property-item ml20" style="align-items: center">
        <span style="white-space: nowrap">背景： </span>
        <DesDVColorPicker :config="{ type: 'color' }" v-model="series.label.backgroundColor" @change="_updateChart"></DesDVColorPicker>
      </div>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签展示<span>： </span></div>
      <DesDVSwitch v-model="series.label.show" @change="changeValue($event, series.label, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">位置<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: locations }"  :value="series.label.position" @change="changeValue($event, series.label, 'position')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">宽度模式<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: widthTypeOptions }"  v-model="widthType" @change="onLabelWidthChange" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show && widthType == 'fixed'">
      <div class="property-item-name">宽度<span>： </span></div>
      <DesDVNumber :config="{ unit: 'px', min: 0 }" v-model="labelWidth" @change="onLabelWidthChange('fixed')"></DesDVNumber>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">内容<span>： </span></div>
      <el-input size="small" v-model="series.label.formatter" @change="changeValue($event, series.label, 'formatter')" class="data-view-text"></el-input>
      <DesDVToolTipsIcon
        :data="{
          desc: '{a}=系列名; {b}=数据名; {c}=数据值; {d}=百分比',
        }"
      ></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">展示边线<span>： </span></div>
      <DesDVSwitch v-model="showLabelBorder" @change="onLabelBorderChange" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show && showLabelBorder">
      <div class="property-item-name">边线样式<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: labelBorderTypes }" v-model="labelBorder.borderType" @change="onLabelBorderChange('borderType')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show && showLabelBorder">
      <div class="property-item-name">边线宽度<span>： </span></div>
      <DesDVNumber :config="{ unit: 'px', min: 0 }" v-model="labelBorder.borderWidth" @change="onLabelBorderChange('borderWidth')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show && showLabelBorder">
      <div class="property-item-name">边线颜色<span>： </span></div>
      <DesDVColorPicker :config="{ type: 'color' }" v-model="labelBorder.borderColor" @change="onLabelBorderChange('borderColor')"></DesDVColorPicker>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin.js";
import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "DesDVChartTreeSeries",
  mixins: [mixin, commonMixin],
  components: { Direction },
  computed: {
    getPadding: {
      get() {
        let { top, right, bottom, left } = this.series;
        return [top, right, bottom, left];
      },
      set(v) {
        let [top, right, bottom, left] = v;
        this.$set(this.series, "top", top);
        this.$set(this.series, "right", right);
        this.$set(this.series, "bottom", bottom);
        this.$set(this.series, "left", left);

        this._updateChart();
      },
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
        this._updateChart();
      },
    },
    series() {
      return this.chart.series[0];
    },
  },
  data() {
    return {
      colorConfig: {
        type: "color",
      },
      options: [
        {
          value: "%",
          label: "%",
        },
      ],
      locations: [
        {
          text: "右",
          value: "right",
        },
        {
          text: "左",
          value: "left",
        },
        {
          text: "下",
          value: "bottom",
        },
        {
          text: "上",
          value: "top",
        },
        {
          text: "中",
          value: "inside",
        },
      ],
      direction: [
        {
          text: "左右",
          value: "LR",
        },
        {
          text: "右左",
          value: "RL",
        },
        {
          text: "上下",
          value: "TB",
        },
        {
          text: "下上",
          value: "BT",
        },
      ],
      lineOptions: [
        {
          text: "直线",
          value: "polyline",
        },
        {
          text: "曲线",
          value: "curve",
        },
      ],
      widthTypeOptions: [
        { text: "自适应", value: "auto" },
        { text: "固定值", value: "fixed" },
      ],
      widthType: "auto",
      labelWidth: 120,
      labelBorderTypes: [
        { text: "实线", value: "solid" },
        { text: "虚线", value: "dashed" },
      ],
      labelBorder: {
        borderWidth: 2,
        borderType: "solid",
        borderColor: "#fff",
      },
      showSymbol: true,
      showLabelBorder: true,
    };
  },
  methods: {

    changeValue(val, item, key) {
      this.$set(item, key, val);
      this._updateChart();
    },
    onLabelWidthChange(type) {
      if (type == "auto") {
        this.$delete(this.series.label, "width");
      } else {
        this.$set(this.series.label, "width", this.labelWidth);
      }
      this._updateChart();
    },
    onLabelBorderChange(type) {
      if (type === true) {
        this.$set(this.series.label, "borderWidth", this.labelBorder.borderType);
        this.$set(this.series.label, "borderType", this.labelBorder.borderWidth);
        this.$set(this.series.label, "borderColor", this.labelBorder.borderColor);
      } else if (type === false) {
        this.$delete(this.series.label, "borderWidth");
        this.$delete(this.series.label, "borderType");
        this.$delete(this.series.label, "borderColor");
      } else {
        this.$set(this.series.label, type, this.labelBorder[type]);
      }
      this._updateChart();
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
