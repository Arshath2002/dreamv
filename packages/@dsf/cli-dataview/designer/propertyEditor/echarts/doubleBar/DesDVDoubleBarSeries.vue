<!--
 * @Editor: zhanghang
 * @Description: 
 * @Date: 2024-05-07 10:47:58
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-06-05 10:18:03
-->
<template>
  <div style="width: 100%" class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">展示位置<span>： </span></div>
      <DesDVRadioGroup :data="{ dictionary: dictionary }" :value="owner.barDirection" @change="changeDirection($event)" />
    </div>
    <div class="ds-designer-property property-item">
      <DesDVRadioGroup :data="{ dictionary: options }" :config="radioConfig" v-model="selectAxis" />
    </div>
    <div v-for="(it, index) in series" :key="index">
      <template v-if="selectAxis === index">
        <SeriesItem :series="it" @updateChart="_updateChart" />
      </template>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin";

import SeriesItem from "./seriesItem.vue";
export default {
  name: "DesDVDoubleBarSeries",
  mixins: [mixin],
  components: {  SeriesItem },
  provide() {
    return {
      owner: this.owner,
    };
  },
  computed: {
    series() {
      return this.chart.series;
    },
    options() {
      return this.series.map((it, index) => {
        return {
          text: `柱体（${it.name}）`,
          value: index,
        };
      });
    },
  },
  data() {
    return {
      radioConfig: {
        autoFit: true,
        stroke: true,
      },
      selectAxis: 0,
      dictionary: [
        {
          text: "上下",
          value: "topDown",
        },
        {
          text: "左右",
          value: "leftRight",
        },
      ],
    };
  },
  methods: {
    //切换方向
    changeDirection(val) {
      this.owner.barDirection = val;
      this.owner.$children[0].changeDirection(val);
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
