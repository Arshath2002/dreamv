<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">边线显示<span>： </span></div>
      <DesDVSwitch :value="line.show" @change="changeValue($event, line, 'show')" />
    </div>
    <template v-if="line.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">边线颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="line.itemStyle.color" @change="changeValue($event, line.itemStyle, 'color')" />
      </div>

      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">边线宽度<span>： </span></div>
        <DesDVNumber :config="{ min: 1 }" v-model="line.itemStyle.lineWidth" @change="changeValue($event, line.itemStyle, 'lineWidth')" />
      </div>

      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">悬浮颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="line.emphasis.itemStyle.color" @change="changeValue($event, line.emphasis.itemStyle, 'color')" />
      </div>

      <div class="ds-designer-property property-item ml20" v-if="mainLayer">
        <div class="property-item-name">显示层级<span>： </span></div>
        <DesDVNumber :config="{ min: 1, max: 28 }" v-model="zooms.zooms[0]" @change="changeValue($event, zooms.zooms, 0)" />&nbsp;~&nbsp;
        <DesDVNumber :config="{ min: 1, max: 28 }" v-model="zooms.zooms[1]" @change="changeValue($event, zooms.zooms, 1)" />
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "LineConfig",
  props: {
    line: {
      type: Object,
      require: true,
    },
    mainLayer: {
      type: Boolean,
      default: false,
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
