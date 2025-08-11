<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-23 14:40:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 18:11:41
-->
<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" :class="{ active: active === idx }" v-for="(it, idx) in series" :key="idx" :label="idx">
        {{ getTypeName(it) }}: {{ it.name }}
      </div>
    </div>
    <div v-for="(it, index) in series" :key="index">
      <template v-if="active == index && it.type === 'custom' && it.shape">
        <SeriesBar3d :chart="chart" :series="it" @updateChart="_updateChart" />
      </template>
      <template v-if="active == index && it.type === 'line'">
        <SeriesLine :chart="chart" :series="it" @updateChart="_updateChart" />
      </template>
    </div>
  </div>
</template>
<script>
import SeriesLine from "../common/seriesLine.vue";

import SeriesBar3d from "./seriesBar3d.vue";
import mixin from "../mixin.js";
export default {
  name: "DesDVChartBar3dSeries",
  components: { SeriesLine, SeriesBar3d },
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
  created() {},
  methods: {
    getTypeName(item) {
      let name = "";
      if (item.type === "custom" && item.shape) {
        switch (item.shape) {
          case "clinder":
            name = "圆柱";
            break;
          case "cube":
            name = "立方体";
            break;
          case "barbubble":
            name = "柱泡";
            break;
          case "rect":
            name = "矩形";
            break;
          case "cone":
            name = "圆锥";
            break;
          default:
            break;
        }
      } else {
        switch (item.type) {
          case "bar":
            name = "柱体";
            break;
          case "line":
            name = "折线";
            break;
          case "scatter":
            name = "散点";
            break;
        }
      }
      return name;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
