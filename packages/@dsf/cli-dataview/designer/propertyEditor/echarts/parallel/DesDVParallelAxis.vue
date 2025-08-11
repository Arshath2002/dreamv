<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-06-06 13:54:20
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:49:54
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">坐标方向<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }"  v-model="parallel.layout" @change="changeValue($event, parallel, 'layout')" />
    </div>
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = it.dim" :class="{ active: active === it.dim }" v-for="it in parallelAxis" :key="it.dim">
        {{ it.name }}
      </div>
    </div>
    <div v-for="(it, index) in parallelAxis" :key="index">
      <template v-if="active == it.dim">
        <Axis :parallelAxisDefault="it" @updateChart="_updateChart" />
      </template>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin.js";
import Axis from "./axis.vue";

export default {
  name: "DesDVParallelAxis",
  mixins: [mixin],
  components: { Axis },
  computed: {
    parallelAxis() {
      return this.chart.parallelAxis;
    },
    parallel() {
      return this.chart.parallel;
    },
  },
  data() {
    return {
      active: 0,
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
    };
  },
  methods: {
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this._updateChart();
    },
  },
};
</script>
