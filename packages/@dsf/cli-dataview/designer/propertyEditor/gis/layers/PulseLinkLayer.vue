<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-06-13 10:09:24
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 10:24:13
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">脉冲长度<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="pulseLink.itemStyle.flowLength" @change="changeValue($event, pulseLink.itemStyle, 'flowLength')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">脉冲速度<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="pulseLink.itemStyle.speed" @change="changeValue($event, pulseLink.itemStyle, 'speed')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">轨迹颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="pulseLink.itemStyle.lineColors[0]" @change="changeValue($event, pulseLink.itemStyle.lineColors, 0)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">头部颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="pulseLink.itemStyle.headColor" @change="changeValue($event, pulseLink.itemStyle, 'headColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">尾部颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="pulseLink.itemStyle.trailColor" @change="changeValue($event, pulseLink.itemStyle.lineColors, 'trailColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示层级<span>： </span></div>
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="pulseLink.zooms[0]" @change="changeValue($event, pulseLink.zooms, 0)" />&nbsp;~&nbsp;
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="pulseLink.zooms[1]" @change="changeValue($event, pulseLink.zooms, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图例显示<span>： </span></div>
      <DesDVSwitch :value="legend.show" @change="changeValue($event, legend, 'show')" />
    </div>
  </div>
</template>
<script>
export default {
  name: "PulseLinkLayer",
  props: {
    layer: {
      type: Object,
      require: true,
    },
  },
  computed: {
    pulseLink() {
      return this.layer.pulseLink;
    },

    legend() {
      return this.layer.legend;
    },
  },
  data() {
    return {
      colorConfig: {
        type: "color",
      },
    };
  },
  methods: {
    updateGisLayer() {
      this.$emit("updateGisLayer");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.updateGisLayer();
    },
  },
};
</script>
