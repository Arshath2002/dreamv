<!--
 * @Description: 词云系列属性
 * @Author: shenah
 * @Date: 2024-05-09 09:32:03
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:47:51
-->

<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" :class="{ active: active === idx }" v-for="(it, idx) in series" :key="idx" :label="idx">词云</div>
    </div>
    <div v-for="(it, index) in series" :key="index">
      <template v-if="active == index">
        <DsfDVChartWordCloudItem :series="it" :chart="chart" @updateChart="_updateChart"> </DsfDVChartWordCloudItem>
      </template>
    </div>
  </div>
</template>
<script>
import DsfDVChartWordCloudItem from "./DsfDVChartWordCloudItem.vue";
import mixin from "../mixin";
export default {
  name: "DesDVChartWordCloudSeries",
  components: { DsfDVChartWordCloudItem },
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
