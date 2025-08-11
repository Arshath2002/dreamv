<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-09-06 15:14:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-12 18:41:09
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">大小<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 5 }" v-model="series.size" @change="changeValue($event, series, 'size')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">最大高度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1 }" v-model="series.maxHeight" @change="changeValue($event, series, 'maxHeight')" />
    </div>
    <div class="ds-designer-property property-item float-one-row">
      <div class="property-item-name">最小高度<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 1 }" v-model="series.minHeight" @change="changeValue($event, series, 'minHeight')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">光柱颜色<span>： </span></div>
      <DesDVColorPicker :config="{ type: 'color' }" v-model="series.color" @change="changeValue($event, series, 'towerColor')" />
    </div>

    <commonLabel :label="series.label" @updateLabel="updateLabel" />
  </div>
</template>
<script>


import commonLabel from "_dataview/designer/propertyEditor/three/setting/commonLabel.vue";

export default {
  name: "DesDVThreeMapPrism",
  components: {  commonLabel },
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
