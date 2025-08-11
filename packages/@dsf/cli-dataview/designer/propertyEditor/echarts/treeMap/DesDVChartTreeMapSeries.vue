<!--
 * @Description: 矩形树图系列配置
 * @Author: shenah
 * @Date: 2024-05-06 10:14:44
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-05-23 16:41:36
-->


<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div
        class="des-dv-map-series__wrapper-item"
        @click="active = idx"
        :class="{ active: active === idx }"
        v-for="(it, idx) in series"
        :key="idx"
        :label="idx"
      >
        矩形树图
      </div>
    </div>
    <div v-for="(it, index) in series" :key="index">
      <template v-if="active == index">
        <DesDVChartTreeMapItem
          :series="it"
          @updateChart="_updateChart"
          :colorList="colorList"
        />
      </template>
    </div>
  </div>
</template>
<script>
import DesDVChartTreeMapItem from "./DesDVChartTreeMapItem.vue";
import mixin from "../mixin";
export default {
  name: "DesDVChartTreeMapSeries",
  components: { DesDVChartTreeMapItem },
  mixins: [mixin],
  computed: {
    series() {
      return this.chart ? this.chart.series : [];
    },
    colorList() {
      return this.chart ? this.chart.color : [];
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
