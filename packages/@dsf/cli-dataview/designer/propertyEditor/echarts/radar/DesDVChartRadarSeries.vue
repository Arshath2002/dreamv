<!--
 * @Description: 雷达右侧系列配置
 * @Author: shenah
 * @Date: 2024-05-09 13:42:14
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:48:27
-->

<template>
  <div class="des-dv-map-property">
    <!-- 系列 -->
    <template v-if="config.styleType === 'series'">
      <div class="des-dv-map-series__wrapper">
        <div class="des-dv-map-series__wrapper-item" @click="active = idx" :class="{ active: active === idx }" v-for="(it, idx) in series[0].data" :key="idx" :label="idx">
          雷达图
          <span v-if="it.nameRelation"> : {{ getFieldName(it.nameRelation) }} </span>
        </div>
      </div>
      <div v-for="(it, index) in series[0].data" :key="index">
        <template v-if="active == index">
          <DsfDVChartRadarItem :series="it" @updateChart="_updateChart" />
        </template>
      </div>
    </template>
    <!-- 雷达盘 -->
    <template v-else-if="config.styleType === 'dish'">
      <div v-for="(it, index) in radar" :key="index">
        <template v-if="active == index">
          <DsfDVChartRadarDish :series="it" @updateChart="_updateChart" />
        </template>
      </div>
    </template>
    <!-- 雷达盘位移 -->
    <template v-else-if="config.styleType === 'position'">
      <div v-for="(it, index) in radar" :key="index">
        <template v-if="active == index">
          <DsfDVChartRadarPosition :series="it" @updateChart="_updateChart" />
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import DsfDVChartRadarItem from "./DsfDVChartRadarItem.vue";
import DsfDVChartRadarDish from "./DsfDVChartRadarDish.vue";
import DsfDVChartRadarPosition from "./DsfDVChartRadarPosition.vue";
import mixin from "../mixin";
export default {
  name: "DesDVChartRadarSeries",
  components: { DsfDVChartRadarItem, DsfDVChartRadarDish, DsfDVChartRadarPosition },
  mixins: [mixin],
  computed: {
    series() {
      return this.chart ? this.chart.series : [];
    },
    radar() {
      return this.chart ? this.chart.radar : [];
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
