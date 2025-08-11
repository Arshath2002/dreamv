<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-07-16 11:17:47
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-08-29 17:18:11
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">大小<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0 }" v-model="series.pointSize" @change="changeValue($event, series, 'pointSize')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">中点颜色<span>： </span></div>
      <DesDVColorPicker :config="{ type: 'color' }" v-model="series.pointColor" @change="changeValue($event, series, 'pointColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">波纹大小<span>： </span></div>
      <DesDVNumber class="min" :config="{ min: 0 }" v-model="series.waveSize" @change="changeValue($event, series, 'waveSize')" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">波纹颜色<span>： </span></div>
      <DesDVColorPicker :config="{ type: 'color' }" v-model="series.waveColor" @change="changeValue($event, series, 'waveColor')" />
    </div>
  </div>
</template>
<script>


export default {
  name: "DesDVThreeEarthScatter",

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
