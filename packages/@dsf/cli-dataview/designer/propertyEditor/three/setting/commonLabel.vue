<!--
 * @Editor: zhanghang
 * @Description: 公共标签组件
 * @Date: 2024-07-24 14:51:09
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 10:26:03
-->
<template>
  <div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">{{ labelText }}<span>： </span></div>
      <DesDVSwitch :value="label.show" @change="changeValue($event, label, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="label.show">
      <div class="property-item-name">内容<span>： </span></div>
      <el-input style="width: 200px" class="min" v-model="label.name" @change="changeValue($event, label, 'name')"></el-input>
      <DesDVToolTipsIcon :data="{ desc: '{a} 系列名 {b} 数据名称 {c} 数据值' }" :descStriking="false"></DesDVToolTipsIcon>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="label.show">
      <div class="property-item-name flex-center">内边距<span>： </span></div>
      <DesDVMargins :value="label.itemStyle.padding" @change="changeValue($event, label.itemStyle, 'padding')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="label.show">
      <div class="property-item-name flex-center">背景色<span>： </span></div>
      <DesDVColorPicker v-model="label.itemStyle.backgroundColor" :config="{ type: 'color' }" @change="changeValue($event, label.itemStyle, 'backgroundColor')"></DesDVColorPicker>
    </div>
    <div class="ds-designer-property property-item ml20" v-if="label.show">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle :config="textConfig" class="min" v-model="textStyle"></DesDVTextStyle>
    </div>
  </div>
</template>
<script>
export default {
  name: "commonLabel",
  props: {
    label: {
      type: Object,
      require: true,
    },
    labelText: {
      type: String,
      default: "标签展示",
    },
  },
  data() {
    return {
      textConfig: {
        picker: { type: "color" },
      },
    };
  },
  computed: {
    textStyle: {
      get() {
        return this.label.itemStyle.textStyle;
      },
      set(v) {
        Object.assign(this.label.itemStyle.textStyle, v);
        this.$emit("updateLabel");
      },
    },
  },
  methods: {
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateLabel");
    },
  },
};
</script>
