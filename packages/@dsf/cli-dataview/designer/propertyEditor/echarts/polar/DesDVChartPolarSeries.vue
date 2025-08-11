<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-04-23 14:40:41
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-04-26 10:26:15
-->
<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" :class="{ active: active === idx }" v-for="(it, idx) in series" :key="idx" :label="idx">
        {{ getTypeName(it) }}: {{ it.name }}
      </div>
    </div>
    <div v-for="(it, index) in series" :key="index">
      <template v-if="active == index">
        <DesDVChartPolarItem :series="it" :type="it.type" @updateChart="_updateChart" />
      </template>
    </div>
  </div>
</template>
<script>
import DesDVChartPolarItem from "./DesDVChartPolarItem.vue";
import mixin from "../mixin";
export default {
  name: "DsfDVChartPolarSeries",
  components: { DesDVChartPolarItem },
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
      return name;
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
