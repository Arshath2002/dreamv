<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体类型<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: radios }" v-model="series.shape" @change="changeValue($event, series, 'shape')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">柱体颜色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" ref="tag" v-model="barColor" @change="changeColor($event, series.itemStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item float-one-row" style="margin-left: 4px">
      <div class="property-item-name">柱体宽<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.barWidth" @change="changeValue($event, series, 'barWidth')" />
    </div>
    <div class="ds-designer-property property-item float-one-row ml10">
      <div class="property-item-name">间距<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="series.barGap" @change="changeValue($event, series, 'barGap')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">基准值<span>： </span></div>
      <DesDVNumber :config="{ min: 10, unit: 'px' }" :value="series.baseValue" @change="changeValue($event, series, 'baseValue')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签<span>： </span></div>
      <DesDVSwitch v-model="series.label.show" @change="changeValue($event, series.label, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name">字体<span>： </span></div>
      <DesDVNumber :config="{ min: 12, unit: 'px' }" :value="series.label.fontSize" @change="changeValue($event, series.label, 'fontSize')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="series.label.show">
      <div class="property-item-name"></div>
      <DesDVColorPicker :config="colorConfig" v-model="series.label.color" @change="changeValue($event, series.label, 'color')" />
    </div>
    <div class="ds-designer-property property-item ml30 float-one-row" v-if="series.label.show">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0, unit: 'px' }" :value="series.label.offset[0]" @change="changeArray($event, series.label, 'offset', 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row ml10" v-if="series.label.show">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0, unit: 'px' }" :value="series.label.offset[1]" @change="changeArray($event, series.label, 'offset', 1)" />
    </div>
  </div>
</template>
<script>

export default {
  name: "DesDVBarMap",
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      barColor: "",
      bothConfig: {
        type: "both",
      },
      colorConfig: {
        type: "color",
      },
      radios: [
        {
          text: "矩形",
          value: "rect",
        },
        {
          text: "立方体",
          value: "cube",
        },
        {
          text: "圆柱",
          value: "clinder",
        },
      ],
    };
  },
  created() {
    const barColor = this.series.itemStyle.color;
    this.barColor = dsf.dataview.utils.convertChartToCSSColor(barColor);
  },
  methods: {
    changeColor(val, item, key) {
      const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      if (!_.isEqual(item[key], color)) {
        this.$set(item, key, color);
        this.$emit("updateChart");
      }
    },
    changeArray(val, item, key, index) {
      let arr = item[key];
      arr[index] = val;
      this.$set(item, key, arr);
      this.$emit("updateChart");
    },

    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
  },
};
</script>
