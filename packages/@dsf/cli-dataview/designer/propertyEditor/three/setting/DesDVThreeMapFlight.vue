<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-07-16 11:17:47
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-01-22 10:46:29
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name">长度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0 }" v-model="series.flightLen" @change="changeValue($event, series, 'flightLen')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">大小<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0 }" v-model="series.headSize" @change="changeValue($event, series, 'headSize')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">飞行速度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1 }" v-model="series.speed" @change="changeValue($event, series, 'speed')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">轨迹颜色<span>： </span></div>
      <DesDVColorPicker :config="{ type: 'color', noArrow: true }" v-model="series.flightColor[0]" @change="changeValue($event, series.flightColor, 0)" />
    </div>
  </div>
</template>
<script>

export default {
  name: "DesDVThreeMapFlight",
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  created() {
    if (this.series.speed === undefined) {
      this.$set(this.series, "speed", 10);
    }
  },
  methods: {
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateThree");
    },
  },
};
</script>
