<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-06-13 10:57:38
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-13 14:21:57
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">图例方向<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" v-model="value.direction" @change="updateValue" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name flex-center">图例位置<span>： </span></div>
      <DesDVMargins :data="{ config: { type: 'text' } }" v-model="value.position" @change="updateValue"></DesDVMargins>
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="value.textStyle" @change="updateValue"></DesDVTextStyle>
    </div>
  </div>
</template>
<script>
export default {
  name: "DesDVGisLegend",
  props: {
    value: {
      type: Object,
      require: true,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    config() {
      let config = this.data.config;
      return config || {};
    },
  },
  data() {
    return {
      dictionary: [
        { text: "横向", value: "horizontal" },
        { text: "纵向", value: "vertical" },
      ],
    };
  },
  methods: {
    updateValue() {
      this.$emit("update:value", this.value);
      this.$emit("update:change", this.value);
    },
  },
};
</script>
