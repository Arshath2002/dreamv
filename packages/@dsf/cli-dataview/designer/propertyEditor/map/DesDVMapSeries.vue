<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-12 18:24:31
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:06:38
-->
<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" v-show="it.allowActive" :class="{ active: active === idx }" v-for="(it, idx) in seriesNames" :key="idx" :label="idx">
        {{ getTypeName(it) }}: {{ it.name }}
      </div>
    </div>
    <div v-for="(it, index) in series" :key="index">
      <!-- 基础地图 -->
      <template v-if="active == index && it.type === 'map'">
        <DesDVVisualMap :visualMap="chart.visualMap" @updateChart="_updateChart" />
      </template>
      <!-- 撒点 -->
      <template v-else-if="active == index && ((it.type === 'scatter' && !it.shape) || it.type === 'effectScatter')">
        <DesDVScatterMap :series="it" @updateChart="_updateChart" />
      </template>
      <!-- 柱体 -->
      <template v-else-if="active == index && it.type === 'scatter' && !!it.shape">
        <DesDVBarMap :series="it" @updateChart="_updateChart" />
      </template>
      <!-- 飞行线 -->
      <template v-else-if="active == index && it.type === 'lines'">
        <DesDVFlyMap :series="it" @updateChart="_updateChart" />
      </template>
    </div>
  </div>
</template>
<script>
import DesDVVisualMap from "./setting/DesDVVisualMap.vue";
import DesDVScatterMap from "./setting/DesDVScatterMap.vue";
import DesDVBarMap from "./setting/DesDVBarMap.vue";
import DesDVFlyMap from "./setting/DesDVFlyMap.vue";

export default {
  name: "DesDVMapSeries",
  components: { DesDVVisualMap, DesDVScatterMap, DesDVBarMap, DesDVFlyMap },
  provide() {
    return {
      owner: this.owner,
    };
  },
  props: {
    owner: {
      type: Object,
      require: true,
    },
  },
  computed: {
    seriesNames() {
      let showSeries = [];
      let chart = this.chart;
      if (chart) {
        let len = chart.series.length;
        chart.series.forEach((it) => {
          if (it.type === "map") {
            if (len == 1) {
              showSeries.push({
                name: it.name,
                type: it.type,
                allowActive: true,
              });
            } else {
              showSeries.push({
                name: it.name,
                type: it.type,
                allowActive: chart.visualMap.seriesIndex == 0 ? true : false,
              });
            }
          } else {
            showSeries.push({
              name: it.name,
              type: it.type,
              allowActive: !!it.data.length,
            });
          }
        });
      }
      return showSeries;
    },
    series() {
      return this.chart ? this.chart.series : [];
    },
  },
  watch: {
    seriesNames: {
      handler() {
        let active = this.active;
        let series = this.series;
        //如果没有激活选项，激活选项不存在，激活选项不允许激活
        if (active == -1 || !series[active] || !this.seriesNames[active].allowActive) {
          this.active = this.seriesNames.findIndex((it) => it.allowActive);
        }
      },
      immediate: true,
    },
  },

  data() {
    return {
      chart: this.owner.chart,
      active: -1,
      visualMap: {
        orient: "vertical",
      },
    };
  },
  created() {
    //在数据配置完成时候，接受一次最新的chart
    dsf.emit.$on(
      "updatePropertyChart",
      () => {
        this.chart = this.owner.chart;
      },
      this.owner.$children[0]
    );
    this._updateChart = _.debounce(this.updateChart, 500);
    this.chart.visualMap = dsf.mix(true, this.chart.visualMap, this.visualMap);
  },
  beforeDestroy() {
    dsf.emit.$remove("updatePropertyChart", this.owner.$children[0]);
  },
  methods: {
    getTypeName(item) {
      let name = "";
      switch (item.type) {
        case "map":
          name = "热力图";
          break;
        case "lines":
          name = "飞行线";
          break;
        case "effectScatter":
          name = "撒点";
          break;
        case "scatter":
          if (item.shape) {
            name = "柱体";
          } else {
            name = "撒点";
          }
          break;
      }
      return name;
    },
    updateChart() {
      dsf.emit.$emit(
        "updateChart",
        {
          chart: this.chart,
        },
        [this.owner.$children[0]]
      );
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
