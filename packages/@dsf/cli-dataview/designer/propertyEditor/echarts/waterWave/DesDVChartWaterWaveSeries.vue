<!--
 * @Description: 饼状图系列配置
 * @Author: shenah
 * @Date: 2024-04-26 16:01:15
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-05-08 14:54:28
-->

<template>
  <div class="des-dv-map-property">
    <div v-for="(it, index) in series" :key="index">
      <template v-if="active == index">
        <DsfDVChartWaterWaveItem :series="it" @updateChart="_updateChart" :chart="chart" />
      </template>
    </div>
  </div>
</template>
<script>
import DsfDVChartWaterWaveItem from "./DsfDVChartWaterWaveItem.vue";
import mixin from "../mixin";
export default {
  name: "DesDVChartWaterWaveSeries",
  components: { DsfDVChartWaterWaveItem },
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
