<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-07-16 11:17:47
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-08-29 17:24:19
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">分割数<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 100 }" v-model="series.points" @change="changeValue($event, series, 'points')" />
    </div>
    <div class="ds-designer-property property-item float-one-row ml20">
      <div class="property-item-name">速度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1 }" v-model="series.speed" @change="changeValue($event, series, 'speed')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">大小<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1 }" v-model="series.size" @change="changeValue($event, series, 'size')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">线颜色<span>： </span></div>
      <DesDVColorPicker :config="{ type: 'color' }" v-model="series.lineColor" @change="changeValue($event, series, 'lineColor')" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">轨迹颜色<span>： </span></div>
      <DesDVColorPicker class="cube-color" :config="{ type: 'color', noArrow: true }" v-model="series.color" @change="changeValue($event, series, 'color')" />
    </div>
  </div>
</template>
<script>

export default {
  name: "DesDVThreeEarthFlight",

  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  methods: {
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateThree");
    },
  },
};
</script>
