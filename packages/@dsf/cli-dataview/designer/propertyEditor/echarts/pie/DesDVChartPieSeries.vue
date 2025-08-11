<!--
 * @Description: 饼状图系列配置
 * @Author: shenah
 * @Date: 2024-04-26 16:01:15
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 17:02:49
-->

<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" :class="{ active: active === idx }" v-for="(it, idx) in series" :key="idx" :label="idx">饼图 : {{ it.name }}</div>
    </div>
    <div v-for="(it, index) in series" :key="index">
      <template v-if="active == index">
        <DesDVChartPieItem :series="it" @updateChart="_updateChart" :chart="chart" />
      </template>
    </div>
  </div>
</template>
<script>
import DesDVChartPieItem from "./DesDVChartPieItem.vue";
import mixin from "../mixin";
export default {
  name: "DesDVChartPieSeries",
  components: { DesDVChartPieItem },
  mixins: [mixin],
  computed: {
    series() {
      return this.chart ? this.chart.series : [];
    },
  },
  data() {
    return {
      active: 0,
    };
  },
  methods: {},
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
