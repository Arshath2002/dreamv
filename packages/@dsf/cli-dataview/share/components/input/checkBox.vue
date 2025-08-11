<template>
  <div class="dsf-dv-checkbox" :style="boxStyle" @click.stop="change">
    <DsfIcon :style="{fontSize}" name="duigoux" v-if="value" />
    <DsfIcon :style="{fontSize}" class="indeterminate" name="fengexian1" v-if="indeterminate" />
  </div>
</template>
<script>
export default {
  name: "DataViewCheckBox",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    //border 颜色
    border: {
      type: String,
      default: "#00DFFF",
    },
    //激活border 颜色
    activeBorder: {
      type: String,
      default: "#00DFFF",
    },
    //背景色
    background: {
      type: String,
      default: "transparent",
    },
    //激活背景色
    activtBackground: {
      type: String,
      default: "transparent",
    },
    iconColor: {
      type: String,
      default: "#00DFFF",
    },
    width: {
      type: String,
      default: "14px",
    },
    height: {
      type: String,
      default: "14px",
    },
    fontSize: {
      type: String,
      default: "12px",
    },
  },
  computed: {
    boxStyle() {
      let { width, height, border, background, iconColor } = this;
      return {
        width,
        height,
        background,
        color: iconColor,
        border: `1px solid ${border}`,
      };
    },
    activeStyle() {
      let { width, height, activeBorder, activtBackground, iconColor } = this;
      return {
        width,
        height,
        background: activtBackground,
        color: iconColor,
        border: `1px solid ${activeBorder}`,
      };
    },
  },
  methods: {
    change() {
      this.$emit("input", !this.value);
      this.$emit("change", !this.value);
    },
  },
};
</script>