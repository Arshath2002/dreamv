<!--
 * @Description: word文字颜色
 * @Author: shenah
 * @Date: 2024-02-26 10:37:24
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-27 15:18:25
-->
<template>
  <div class="ds-word-color">
    <ColorPicker
      v-model="colorVal"
      :style="wrapperStyle"
      :config="{
        noArrow: true,
        noInput: true,
        ...$attrs,
      }"
    />
  </div>
</template>
<script>
import ColorPicker from "./colorPicker/index.vue";
import { handleColor } from "_dataview/output/config/commonConfig";

export default {
  name: "DsfWordColor",
  components: { ColorPicker },
  props: {
    value: {
      type: [Object, String],
    },
    wrapperStyle: {
      type: Object,
      default() {
        return { width: "64px", height: "24px" };
      },
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  computed: {
    colorVal: {
      get() {
        return handleColor(this.value);
      },
      set(color) {
        this.$emit("change", color);
      },
    },
  },
};
</script>
