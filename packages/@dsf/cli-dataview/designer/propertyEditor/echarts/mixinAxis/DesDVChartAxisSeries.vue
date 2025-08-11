<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-23 14:40:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:34:54
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
      <template v-if="active == index && it.type === 'line'">
        <SeriesLine
          :chart="chart"
          :series="it"
          @updateChart="_updateChart"
        />
      </template>
      <template v-if="active == index && it.type === 'bar'">
        <SeriesBar
          :chart="chart"
          :series="it"
          @updateChart="_updateChart"
        />
      </template>
      <template v-if="active == index && it.type === 'pictorialBar'">
        <SeriesPictorial
          :chart="chart"
          :series="it"
          @updateChart="_updateChart"
        />
      </template>
      <template v-if="active == index && it.type === 'scatter'">
        <SeriesScatter
          :chart="chart"
          :series="it"
          @updateChart="_updateChart"
        />
      </template>
    </div>
  </div>
</template>
<script>
import SeriesLine from "../common/seriesLine.vue";
import SeriesBar from "../common/seriesBar.vue";
import SeriesPictorial from "../common/seriesPictorial.vue";
import SeriesScatter from "../common/seriesScatter.vue";
import visualMap from "_dataview/output/chartDefault/defaultVisualMap.js";
import mixin from "../mixin.js";
export default {
  name: "DesDVChartAxisSeries",
  components: { SeriesLine, SeriesBar, SeriesPictorial, SeriesScatter },
  provide() {
    return {
      owner: this.owner,
    };
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
  created() {
    //添加视觉义映射
    if (!this.owner.chart.visualMap) {
      this.$set(this.owner.chart, "visualMap", visualMap);
    }
  },
  methods: {
    getTypeName(item) {
      let name = "";
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
        case "pictorialBar":
          name = "象形图";
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
