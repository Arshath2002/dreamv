<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-06-06 13:54:20
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 16:38:37
-->
<template>
  <div style="margin-top: 10px">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">名称位置<span>： </span></div>
      <DesDVRadioGroup  :data="{ dictionary: nameLocation }"  v-model="parallelAxisDefault.nameLocation" @change="changeValue($event, parallelAxisDefault, 'nameLocation')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">是否反转<span>： </span></div>
      <DesDVSwitch v-model="parallelAxisDefault.inverse" @change="changeValue($event, parallelAxisDefault, 'inverse')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">名称样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <!-- 只针对类目轴有效 <div class="ds-designer-property property-item">
      <div class="property-item-name">轴标签展示<span>： </span></div>
      <DesDVSwitch v-model="parallelAxisDefault.axisLabel.show" @change="changeValue($event, parallelAxisDefault.axisLabel, 'show')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="parallelAxisDefault.axisLabel.show">
      <div class="property-item-name">自适应展示<span>： </span></div>
      <DesDVSwitch
        :config="{ activeValue: 0, inactiveValue: 1 }"
        v-model="parallelAxisDefault.axisLabel.interval"
        @change="changeValue($event, parallelAxisDefault.axisLabel, 'interval')"
      ></DesDVSwitch>
    </div> -->
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="textStyle" :config="fontConfig"></DesDVTextStyle>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">标签旋转<span>： </span></div>
      <DesDVNumber :config="{ min: -90, unit: 'deg' }" :value="parallelAxisDefault.axisLabel.rotate" @change="changeValue($event, parallelAxisDefault.axisLabel, 'rotate')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示轴线<span>： </span></div>
      <DesDVSwitch v-model="parallelAxisDefault.axisLine.show" @change="changeValue($event, parallelAxisDefault.axisLine, 'show')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="parallelAxisDefault.axisLine.show">
      <div class="property-item-name">轴线颜色<span>： </span></div>
      <DesDVColorPicker v-model="parallelAxisDefault.axisLine.lineStyle.color" :config="colorConfig" @change="changeValue($event, parallelAxisDefault.axisLine.lineStyle, 'color')"></DesDVColorPicker>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">显示刻度<span>： </span></div>
      <DesDVSwitch v-model="parallelAxisDefault.axisTick.show" @change="changeValue($event, parallelAxisDefault.axisTick, 'show')"></DesDVSwitch>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="parallelAxisDefault.axisTick.show">
      <div class="property-item-name">刻度对齐<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: algins }"  v-model="parallelAxisDefault.axisTick.alignWithLabel" @change="changeValue($event, parallelAxisDefault.axisTick, 'alignWithLabel')" />
    </div>
  </div>
</template>
<script>
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";




export default {
  name: "DsfDVParallelAxis",
  mixins: [commonMixin],

  props: {
    parallelAxisDefault: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      algins: [
        { text: "对齐", value: true },
        { text: "不对齐", value: false },
      ],
      colorConfig: {
        type: "color",
      },
      dictionary: [
        {
          text: "横向",
          value: "horizontal",
        },
        {
          text: "纵向",
          value: "vertical",
        },
      ],
      nameLocation: [
        {
          text: "开始",
          value: "start",
        },
        {
          text: "居中",
          value: "middle",
        },
        {
          text: "结束",
          value: "end",
        },
      ],
    };
  },
  computed: {
    textStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.parallelAxisDefault.axisLabel;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.parallelAxisDefault.axisLabel, v);
        this.$emit("updateChart");
      },
    },
    nameTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = "12" } = this.parallelAxisDefault.nameTextStyle;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.parallelAxisDefault.nameTextStyle, v);
        this.$emit("updateChart");
      },
    },
  },
  methods: {
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
  },
};
</script>
