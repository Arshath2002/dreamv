<!--
 * @Editor: zhanghang
 * @Description: 极坐标系样式配置
 * @Date: 2024-04-22 17:15:19
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:30:28
-->
<template>
  <div style="width: 100%">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">坐标颠倒<span>： </span></div>
      <DesDVSwitch :value="angleAxis.type === 'category'" @change="changeAxis" />
    </div>
    <div class="ds-designer-property property-item ml10 float-one-row">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }"  class="min" :value="polar.center[0]|valueFilter" @change="changeValue($event + '%', polar.center, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: '%' }"  class="min" :value="polar.center[1]|valueFilter" @change="changeValue($event + '%', polar.center, 1)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">内环大小<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0, unit: '%' }" :value="polar.radius[0] | valueFilter" @change="changeValue($event + '%', polar.radius, 0)" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">外环<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0, unit: '%' }" :value="polar.radius[1] | valueFilter" @change="changeValue($event + '%', polar.radius, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <DesDVRadioGroup :data="{ dictionary: dictionary }"  :config="radioConfig" v-model="selectAxis" />
    </div>
    <!-- 角度/径向轴配置 -->
    <AngleAxis :type="selectAxis" @updateChart="_updateChart" :axis="propAxis"></AngleAxis>
  </div>
</template>
<script>

import AngleAxis from "./angleAxis.vue";
import mixin from "../mixin";
export default {
  name: "DesDVChartPolarAxis",
  components: {  AngleAxis },
  mixins: [mixin],
  computed: {
    polar() {
      return this.chart ? this.chart.polar : {};
    },
    angleAxis() {
      return this.chart ? this.chart.angleAxis : {};
    },
    radiusAxis() {
      return this.chart ? this.chart.radiusAxis : {};
    },
    propAxis() {
      return this.selectAxis === "angleAxis" ? this.angleAxis : this.radiusAxis;
    },
  },
  data() {
    return {
      radioConfig: {
        autoFit: true,
        stroke: true,
      },
      selectAxis: "angleAxis",
      dictionary: [
        {
          text: "角度轴",
          value: "angleAxis",
        },
        {
          text: "径向轴",
          value: "radiusAxis",
        },
      ],
    };
  },
  filters: {
    valueFilter(val) {
      return (val + "").replace(/%/g, "");
    },
  },
  methods: {
    changeAxis() {
      let angleAxis = _.cloneDeep(this.chart.angleAxis);
      let radiusAxis = _.cloneDeep(this.chart.radiusAxis);
      if (angleAxis.type && angleAxis.type === "category" && !radiusAxis.type) {
        let data = _.cloneDeep(angleAxis.data);
        radiusAxis.data = data;
        radiusAxis.type = "category";
        Reflect.deleteProperty(angleAxis, "type");
        Reflect.deleteProperty(angleAxis, "data");
      } else if (radiusAxis.type && radiusAxis.type === "category" && !angleAxis.type) {
        let data = _.cloneDeep(radiusAxis.data);
        angleAxis.data = data;
        angleAxis.type = "category";
        Reflect.deleteProperty(radiusAxis, "type");
        Reflect.deleteProperty(radiusAxis, "data");
      }
      this.chart.angleAxis = angleAxis;
      this.chart.radiusAxis = radiusAxis;

      this._updateChart();
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this._updateChart();
    },
  },
};
</script>
