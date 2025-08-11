<!--
 * @Description: k线图与折线图的混合
 * @Author: shenah
 * @Date: 2024-07-05 09:06:11
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:51:21
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
        {{ getTypeName(it) }}: {{ it.name }}
      </div>
    </div>
    <div
      v-for="(it, index) in series"
      :key="index"
    >
      <template v-if="active == index && it.type === 'candlestick'">
        <SeriesCandlestick
          :chart="chart"
          :series="it"
          :mapFieldList="mapFieldList"
          @updateChart="_updateChart"
        />
      </template>
      <template v-if="active == index && it.type === 'line'">
        <SeriesLine
          :chart="chart"
          :series="it"
          @updateChart="_updateChart"
        />
      </template>
    </div>
  </div>
</template>
<script>
import SeriesCandlestick from "./seriesCandlestick.vue";
import SeriesLine from "../common/seriesLine.vue";
import mixin from "../mixin.js";
export default {
  name: "DesDVCandlestickSeries",
  components: { SeriesCandlestick, SeriesLine },
  provide() {
    return {
      owner: this.owner,
    };
  },
  props: {
    mapFieldList: {
      type: Array,
      default: () => [],
    },
  },
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
  methods: {
    getTypeName(item) {
      let name = "";
      switch (item.type) {
        case "candlestick":
          name = "k线";
          break;
        case "line":
          name = "折线";
          break;
      }
      return name;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
