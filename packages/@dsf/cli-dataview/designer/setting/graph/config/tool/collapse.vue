<!--
 * @Author: liuhu@dreamdt.cn
 * @Date: 2023-07-21 16:00:41
 * @LastEditors: shenah
 * @LastEditTime: 2023-10-26 10:56:35
-->
<template>
  <div class="des-dv-chart-custom-collapse-parent">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "Collapse",
  provide() {
    return {
      collapse: this,
    };
  },
  data() {
    return {
      activeNames: [].concat(this.value),
    };
  },
  watch: {
    value(value) {
      this.activeNames = [].concat(value);
    },
  },
  props: {
    value: {
      type: [Array, String, Number],
      default() {
        return [];
      },
    },
  },
  methods: {
    setActiveNames(activeNames) {
      activeNames = [].concat(activeNames);
      let value = activeNames;
      this.activeNames = activeNames;
      this.$emit("input", value);
      this.$emit("change", value);
    },
    handleItemClick(item) {
      let activeNames = this.activeNames.slice(0);
      let index = activeNames.indexOf(item);
      if (index > -1) {
        activeNames.splice(index, 1);
      } else {
        activeNames.push(item);
      }
      this.setActiveNames(activeNames);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/Collapse.scss";
</style>
