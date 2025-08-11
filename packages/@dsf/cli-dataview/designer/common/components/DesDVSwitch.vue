<!--
 * @Description: 属性switch组件提取公用
 * @Author: shenah
 * @Date: 2024-04-03 09:46:09
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 09:56:20
-->

<template>
  <el-switch
    class="des-dv-switch"
    :disabled="disabled"
    :value="value"
    @change="changeValue"
    :active-color="$themeConfig.currentTheme.normal"
    :active-value="currentConfig.activeValue"
    :inactive-value="currentConfig.inactiveValue"
    :inactive-color="currentConfig.inactiveColor"
    :active-text="currentConfig.active || ''"
    :inactive-text="currentConfig.inactive || ''"
  >
  </el-switch>
</template>
<script>
import propertyMixin from "./propertyMixin.js";
export default {
  name: "DesDVSwitch",
  components: {},
  mixins: [propertyMixin],
  props: {
    value: {
      type: [Object, Boolean, String,Number],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultConfig: {
        inactiveColor: "#D3D6D9",
        activeValue: true,
        inactiveValue: false,
      },
      borderOptions: [],
    };
  },
  computed: {
    $themeConfig() {
      return dsf.themeConfig;
    },
  },

  methods: {
    changeValue(val) {
      this.$emit("change", val);
      this.$emit("input", val);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/common/commonProperty/dsfSwitch.scss";
</style>
