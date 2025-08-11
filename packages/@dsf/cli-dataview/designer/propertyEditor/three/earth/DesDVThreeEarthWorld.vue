<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-07-11 10:54:12
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:13:17
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">世界轮廓<span>： </span></div>
      <DesDVSwitch v-model="world.show" @change="changeValue($event, world, 'show')" />
    </div>
    <template v-if="world.show">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">区域颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="itemStyle.color" @change="changeValue($event, itemStyle, 'color')" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">轮廓线<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="itemStyle.lineStyle.color" @change="changeValue($event, itemStyle.lineStyle, 'color')" />
      </div>
      <commonLabel :label="world.label" labelText="地区名称" @updateLabel="updateThree" />
      <div class="ds-designer-property property-item">
        <div class="property-item-name">悬浮效果<span>： </span></div>
        <DesDVSwitch :value="world.emphasis.show" @change="changeValue($event, world.emphasis, 'show')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="world.emphasis.show">
        <div class="property-item-name">区域颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="world.emphasis.color" @change="changeValue($event, world.emphasis, 'topColor')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="world.emphasis.show && world.label.show">
        <div class="property-item-name">标签样式<span>： </span></div>
        <DesDVTextStyle :config="textConfig" class="min" v-model="emphasisTextStyle"></DesDVTextStyle>
      </div>

      <DesDVThreeHeatMap :visualMap="visualMap" @updateThree="updateThree" />
    </template>
  </div>
</template>
<script>
import DesDVThreeHeatMap from "_dataview/designer/propertyEditor/three/setting/DesDVThreeHeatMap.vue";


import commonLabel from "_dataview/designer/propertyEditor/three/setting/commonLabel.vue";

export default {
  name: "DesDVThreeEarthWorld",
  components: {
    DesDVThreeHeatMap,
    commonLabel,
  },
  props: {
    world: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      textConfig: {
        picker: { type: "color" },
      },
      colorConfig: {
        type: "color",
      },
    };
  },
  computed: {
    itemStyle() {
      return this.world.itemStyle;
    },
    visualMap() {
      return this.world.itemStyle.range;
    },
    emphasisTextStyle: {
      get() {
        return this.world.emphasis.textStyle;
      },
      set(v) {
        Object.assign(this.world.emphasis.textStyle, v);
        this.updateThree();
      },
    },
  },
  methods: {
    updateThree() {
      this.$emit("updateThree");
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.updateThree();
    },
  },
};
</script>
