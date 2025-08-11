<!--
 * @Description: 热词系列配置
 * @Author: shenah
 * @Date: 2024-04-29 14:06:57
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:40:14
-->

<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" :class="{ active: active === idx }" v-for="(it, idx) in series" :key="idx" :label="idx">热词</div>
    </div>
    <div v-for="(it, index) in series" :key="index">
      <template v-if="active == index">
        <DesDVChartHotWordItem :series="it" @updateChart="_updateChart" :chart="chart" />
      </template>
    </div>
  </div>
</template>
<script>
import DesDVChartHotWordItem from "./DesDVChartHotWordItem.vue";
import mixin from "../mixin";
export default {
  name: "DesDVChartHotWordSeries",
  components: { DesDVChartHotWordItem },
  mixins: [mixin],
  provide() {
    return {
      owner: this.owner,
    };
  },
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
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
