<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-06-12 19:13:18
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-12 20:08:56
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">热力色阶<span>： </span></div>
    </div>
    <div class="des-dv-map-piecewise ml20">
      <div class="piecewise-item" v-for="(item, key, index) in gradient" :key="index">
        <span style="white-space: nowrap">分段值：</span>
        <span style="white-space: nowrap; width: 30px">{{ key }}</span>

        <DesDVColorPicker v-model="item.color" :config="{ type: 'color' }" @change="changeSingleColor($event, gradient, key)">
          <template v-slot="{ openPopover }">
            <div class="color-icon-item" :style="moreModeColorItemStyle(item)" @click="openPopover"></div>
          </template>
        </DesDVColorPicker>
      </div>
    </div>

    <div class="ds-designer-property property-item" style="margin-top: 10px">
      <div class="property-item-name">大小模式<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="heatMap.itemStyle.isCalcSize" @change="changeValue($event, heatMap.itemStyle, 'isCalcSize')" />
    </div>
    <template v-if="heatMap.itemStyle.isCalcSize">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">基础值<span>： </span></div>
        <DesDVNumber :config="{ min: 0 }" v-model="heatMap.itemStyle.basicSize" @change="changeValue($event, heatMap.itemStyle, 'basicSize')" />
        <DesDVToolTipsIcon
          style="margin-top: 2px"
          :data="{
            desc: '计算公式：大小范围的最大值 *值/基准值',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">大小范围<span>： </span></div>
        <DesDVNumber :config="{ min: 0 }" v-model="heatMap.itemStyle.sizeMin" @change="changeValue($event, heatMap.itemStyle, 'sizeMin')" />&nbsp;~&nbsp;
        <DesDVNumber :config="{ min: 0 }" v-model="heatMap.itemStyle.sizeMax" @change="changeValue($event, heatMap.itemStyle, 'sizeMax')" />
      </div>
    </template>
    <div class="ds-designer-property property-item ml20" v-else>
      <div class="property-item-name">圆点大小<span>： </span></div>
      <DesDVNumber :config="{ min: 0 }" v-model="heatMap.itemStyle.size" @change="changeValue($event, heatMap.itemStyle, 'size')" />
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">视觉映射<span>： </span></div>
      <DesDVSwitch :value="heatMap.itemStyle.visualMap.show" @change="changeValue($event, heatMap.itemStyle.visualMap, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="heatMap.itemStyle.visualMap.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle :config="textConfig" class="min" v-model="textStyle"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="heatMap.itemStyle.visualMap.show">
      <div class="property-item-name flex-center">位置<span>： </span></div>
      <DesDVMargins :data="{ config: { type: 'text' } }" :value="heatMap.itemStyle.visualMap.postion" @change="changeValue($event, heatMap.itemStyle.visualMap, 'postion')"></DesDVMargins>
    </div>

    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示层级<span>： </span></div>
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="heatMap.zooms[0]" @change="changeValue($event, heatMap.zooms, 0)" />&nbsp;~&nbsp;
      <DesDVNumber :config="{ min: 1, max: 28 }" v-model="heatMap.zooms[1]" @change="changeValue($event, heatMap.zooms, 1)" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图例显示<span>： </span></div>
      <DesDVSwitch :value="legend.show" @change="changeValue($event, legend, 'show')" />
    </div>
  </div>
</template>
<script>
export default {
  name: "HeatMapLayer",
  props: {
    layer: {
      type: Object,
      require: true,
    },
  },
  computed: {
    heatMap() {
      return this.layer.heatMap;
    },
    gradient() {
      return this.heatMap.itemStyle.gradient;
    },
    legend() {
      return this.layer.legend;
    },
    textStyle: {
      get() {
        const { color, fontSize, fontFamily = "Microsoft Yahei" } = this.heatMap.itemStyle.visualMap;
        return {
          color,
          fontSize,
          fontFamily,
        };
      },
      set(v) {
        Object.assign(this.heatMap.itemStyle.visualMap, v);
        this.$emit("updateGisLayer");
      },
    },
  },
  data() {
    return {
      textConfig: {
        picker: { type: "color" },
        isShowFontWeight: false,
        isShowItalics: false,
        isShowUnderline: false,
        isShowShadow: false,
      },
      dictionary: [
        { text: "固定大小", value: false },
        { text: "自定计算", value: true },
      ],
    };
  },
  methods: {
    moreModeColorItemStyle(item) {
      let style = {};
      style.background = item;
      return style;
    },
    changeSingleColor(val, item, key) {
      this.$set(item, key, val);
      this.updateGisLayer();
    },
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
