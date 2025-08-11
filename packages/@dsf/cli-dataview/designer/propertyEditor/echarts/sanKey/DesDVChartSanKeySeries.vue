<!--
 * @Description: 桑基图系列属性
 * @Author: shenah
 * @Date: 2024-05-07 10:07:04
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:46:47
-->

<template>
  <div class="des-dv-map-property">
    <div v-for="(it, index) in series" :key="index">
      <template v-if="active == index">
        <!-- 节点样式 -->
        <DsfDVChartSanKeyRect v-if="config.styleType === 'react'" :series="it" @updateChart="_updateChart"> </DsfDVChartSanKeyRect>
        <!-- 关系边样式 -->
        <DsfDVChartSanKeyLine v-if="config.styleType === 'line'" :series="it" @updateChart="_updateChart"> </DsfDVChartSanKeyLine>
      </template>
    </div>
  </div>
</template>
<script>
import DsfDVChartSanKeyRect from "./DsfDVChartSanKeyRect.vue";
import DsfDVChartSanKeyLine from "./DsfDVChartSanKeyLine.vue";
import mixin from "../mixin";
export default {
  name: "DesDVChartSanKeySeries",
  components: { DsfDVChartSanKeyRect, DsfDVChartSanKeyLine },
  mixins: [mixin,],
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
