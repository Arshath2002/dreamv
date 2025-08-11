<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-07-29 09:44:00
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 09:53:45
-->
<template>
  <el-radio-group
    class="ds-dv-radio-group"
    :class="{
      'ds-auto-fit': currentConfig.autoFit,
      'ds-stroke': currentConfig.stroke,
      'ds-nano': currentConfig.nano,
    }"
    size="mini"
    v-model="radioValue"
    v-if="dictionary.length"
    v-bind="$attrs"
  >
    <el-radio-button border v-for="(it, idx) in dictionary" :key="idx" :label="it[fieldMap.value]">
      <slot :data="it">{{ it[fieldMap.text] }}</slot>
    </el-radio-button>
  </el-radio-group>
</template>

<script>
import propertyMixin from "./propertyMixin";
export default {
  name: "DesDVRadioGroup",
  mixins: [propertyMixin],
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    fieldMap: {
      type: Object,
      default: () => ({
        value: "value",
        text: "text",
      }),
    },
  },

  computed: {
    radioValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      },
    },

    dictionary() {
      return this.data.dictionary;
    },
  },
  data() {
    return {
      defaultConfig: {
        autoFit: false,
        stroke: false,
        nano: false,
      },
    };
  },
  created() {
    console.log();
  },
};
</script>

<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVRadioGroup.scss";
</style>
