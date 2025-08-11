<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-06-12 09:58:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-12 16:03:02
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="polygon.itemStyle.topColor" @change="changeValue($event, polygon.itemStyle, 'topColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">侧边顶部<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="polygon.itemStyle.sideTopColor" @change="changeValue($event, polygon.itemStyle, 'sideTopColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">侧边底部<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="polygon.itemStyle.sideBottomColor" @change="changeValue($event, polygon.itemStyle, 'sideBottomColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启悬浮<span>： </span></div>
      <DesDVSwitch :value="polygon.emphasis.show" @change="changeValue($event, polygon.emphasis, 'show')" />
    </div>
    <template v-if="polygon.emphasis.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">区域颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="polygon.emphasis.itemStyle.topColor" @change="changeValue($event, polygon.emphasis.itemStyle, 'topColor')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">侧边顶部<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="polygon.emphasis.itemStyle.sideTopColor" @change="changeValue($event, polygon.emphasis.itemStyle, 'sideTopColor')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">侧边底部<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="polygon.emphasis.itemStyle.sideBottomColor" @change="changeValue($event, polygon.emphasis.itemStyle, 'sideBottomColor')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启色阶<span>： </span></div>
      <DesDVSwitch :value="polygon.itemStyle.range.show" @change="changeValue($event, polygon.itemStyle.range, 'show')" />
    </div>
    <template v-if="polygon.itemStyle.range.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">色阶模式<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="polygon.itemStyle.range.mode" @change="changeValue($event, polygon.itemStyle.range, 'mode')" />
      </div>
      <template v-if="polygon.itemStyle.range.mode == 'range'">
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">渐变颜色<span>： </span></div>
          <DesDVMoreModeColor :config="{ limit: 2, allowDelete: false }" v-model="polygon.itemStyle.range.color" @change="changeValue($event, polygon.itemStyle.range, 'color')" />
        </div>
        <div class="ds-designer-property property-item ml20">
          <div class="property-item-name">范围值<span>： </span></div>
          <DesDVNumber :config="{ min: 0, }" v-model="polygon.itemStyle.range.min" @change="changeValue($event, polygon.itemStyle.range,'min')" />&nbsp;~&nbsp;
          <DesDVNumber :config="{ min: 0 }" v-model="polygon.itemStyle.range.max" @change="changeValue($event, polygon.itemStyle.range, 'max')" />
        </div>
      </template>

      <div class="ds-designer-property property-item ml20" v-else>
        <DesDVThreePiecewise :pieces="polygon.itemStyle.range.rules" @change="changeValue($event, polygon.itemStyle.range, 'rules')" />
      </div>
    </template>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">开启遮罩<span>： </span></div>
      <DesDVSwitch :value="polygon.itemStyle.mask.show" @change="changeValue($event, polygon.itemStyle.mask, 'show')" />
    </div>
    <template v-if="polygon.itemStyle.mask.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">遮罩颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="polygon.itemStyle.mask.color" @change="changeValue($event, polygon.itemStyle.mask, 'color')" />
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">遮罩透明度<span>： </span></div>
        <DesDVNumber :config="{ min: 0.1, max: 1, step: 0.1 }" v-model="polygon.itemStyle.mask.opacity" @change="changeValue($event, polygon.itemStyle.mask, 'opacity')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示层级<span>： </span></div>
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="polygon.zooms[0]" @change="changeValue($event, polygon.zooms, 0)" />&nbsp;~&nbsp;
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="polygon.zooms[1]" @change="changeValue($event, polygon.zooms, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图例显示<span>： </span></div>
      <DesDVSwitch :value="legend.show" @change="changeValue($event, legend, 'show')" />
    </div>
    <!-- 边线设置 -->
    <LineConfig :line="line" @updateGisLayer="updateGisLayer" />
    <!-- 标签设置 -->
    <LabelConfig :label="label" @updateGisLayer="updateGisLayer" />
    <!-- 提示框设置 -->
    <TooltipConfig :tooltip="tooltip" @updateGisLayer="updateGisLayer" />
  </div>
</template>
<script>
import DesDVThreePiecewise from "../../three/setting/piecewise.vue";
import LineConfig from "./LineConfig.vue";
import LabelConfig from "./LabelConfig.vue";
import TooltipConfig from "./TooltipConfig.vue";
export default {
  name: "PolygonLayer",
  props: {
    layer: {
      type: Object,
      require: true,
    },
  },
  components: { DesDVThreePiecewise, LineConfig, LabelConfig, TooltipConfig },
  computed: {
    polygon() {
      return this.layer.polygon;
    },
    label() {
      return this.layer.label;
    },
    tooltip() {
      return this.layer.tooltip;
    },
    line() {
      return this.layer.line;
    },
    legend() {
      return this.layer.legend;
    },
  },
  data() {
    return {
      dictionary: [
        { text: "渐变", value: "range" },
        { text: "分段", value: "separate" },
      ],
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
