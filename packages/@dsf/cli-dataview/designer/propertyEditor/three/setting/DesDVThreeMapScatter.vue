<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-07-16 11:17:47
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-07-24 16:55:52
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">大小<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0 }" v-model="series.spotSize" @change="changeValue($event, series, 'spotSize')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">中点颜色<span>： </span></div>
      <DesDVColorPicker :config="{ type: 'color' }" v-model="series.spotColor" @change="changeValue($event, series, 'spotColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">涟漪扩散<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0, unit: '倍' }" v-model="series.ringRatio" @change="changeValue($event, series, 'ringRatio')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">涟漪颜色<span>： </span></div>
      <DesDVColorPicker :config="{ type: 'color' }" v-model="series.ringColor" @change="changeValue($event, series, 'ringColor')" />
    </div>

    <commonLabel :label="series.label" @updateLabel="updateLabel" />

  </div>
</template>
<script>

import commonLabel from "./commonLabel.vue";
export default {
  name: "DesDVThreeMapScatter",
  components: {
    
    commonLabel,
  },
  props: {
    series: {
      type: Object,
      require: true,
    },
  },
  methods: {
    updateLabel() {
      this.$emit("updateThree");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateThree");
    },
  },
};
</script>
