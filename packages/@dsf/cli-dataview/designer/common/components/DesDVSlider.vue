<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2025-02-14 14:38:14
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-28 13:39:01
-->
<template>
  <el-slider v-if="config.trigger === 'input'" class="dv-des-slider" :min="config.min" :max="config.max" :step="config.step" :value="bindValue" @input="dataValueInput"></el-slider>
  <el-slider v-else class="dv-des-slider" :min="config.min" :max="config.max" :step="config.step" v-model="bindValue" @change="dataValueChange"></el-slider>
</template>
<script>
export default {
  name: "DesDVSlider",
  mixins: [$mixins.designerPropertyItem],
  methods: {
    dataValueInput(e) {
      this.bindValue = e;
      this.dataValueChange()
    },
    dataValueChange() {
      this.$emit("change", this.bindValue);
    },
  },
};
</script>
