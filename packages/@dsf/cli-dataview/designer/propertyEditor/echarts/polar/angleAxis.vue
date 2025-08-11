<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-23 14:10:22
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-28 14:57:02
-->
<!-- 角度轴配置 -->
<template>
  <div>
    <template v-if="type==='angleAxis'">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">起始角度<span>： </span></div>
        <DesDVNumber :config="{ min: -720, unit: 'deg' }" :value="axis.startAngle" @change="changeValue($event, axis, 'startAngle')" />
      </div>
      <div class="ds-designer-property property-item">
        <div class="property-item-name">顺时针旋转<span>： </span></div>
        <DesDVSwitch :value="axis.clockwise" @change="changeValue($event, axis, 'clockwise')" />
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">轴线<span>： </span></div>
      <DesDVSwitch :value="axis.axisLine.show" @change="changeValue($event, axis.axisLine, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.axisLine.show">
      <div class="property-item-name">颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="axis.axisLine.lineStyle.color" @change="changeValue($event, axis.axisLine.lineStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.axisLine.show">
      <div class="property-item-name">刻度<span>： </span></div>
      <DesDVSwitch :value="axis.axisTick.show" @change="changeValue($event, axis.axisTick, 'show')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">分割线<span>： </span></div>
      <DesDVSwitch :value="axis.splitLine.show" @change="changeValue($event, axis.splitLine, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.splitLine.show">
      <div class="property-item-name">颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="axis.splitLine.lineStyle.color" @change="changeValue($event, axis.splitLine.lineStyle, 'color')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.splitLine.show">
      <div class="property-item-name">强制分割<span>： </span></div>
      <DesDVSwitch :config="{ activeValue: 0, inactiveValue: 1 }" :value="axis.axisLabel.interval" @change="changeValue($event, axis.axisTick, 'show')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签<span>： </span></div>
      <DesDVSwitch :value="axis.axisLabel.show" @change="changeValue($event, axis.axisLabel, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.axisLabel.show">
      <div class="property-item-name">旋转角度<span>： </span></div>
      <DesDVNumber :config="{ min: -720, unit: 'deg' }" :value="axis.axisLabel.rotate" @change="changeValue($event, axis.axisLabel, 'rotate')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="axis.axisLabel.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="textStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
  </div>
</template>
<script>



import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "AngleAxis",

  mixins:[commonMixin],
  props: {
    axis: {
      type: Object,
      require: true,
    },
    type: {
      type: String,
      default: "angleAxis",
    },
  },
  computed: {
    textStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.axis.axisLabel;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.axis.axisLabel, v);
        this.$emit("updateChart");
      },
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
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
  },
};
</script>
