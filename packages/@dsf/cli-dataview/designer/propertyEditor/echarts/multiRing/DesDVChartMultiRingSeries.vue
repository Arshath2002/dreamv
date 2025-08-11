<!--
 * @Description: 多圆环系列配置
 * @Author: shenah
 * @Date: 2024-05-06 10:14:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:42:39
-->

<template>
  <div class="des-dv-map-property">
    <DsfDVChartMultiRingItem @updateChart="_updateChart" :settingSeries="settingSeries" :chart="chart" v-if="chart.series.length && settingSeries && settingSeries.data && settingSeries.data.length" />
  </div>
</template>
<script>
import DsfDVChartMultiRingItem from "./DsfDVChartMultiRingItem.vue";
import mixin from "../mixin";
export default {
  name: "DesDVChartMultiRingSeries",
  components: { DsfDVChartMultiRingItem },
  mixins: [mixin],
  computed: {
    settingSeries() {
      return this.chart ? this.chart.series[0] : {};
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
