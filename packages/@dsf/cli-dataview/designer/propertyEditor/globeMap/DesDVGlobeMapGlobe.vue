<!--
 * @Description: 球体配置
 * @Author: shenah
 * @Date: 2024-07-26 09:47:28
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 18:08:01
-->

<template>
  <div class="des-dv-map-property">
    <!-- 球体配置 -->
    <DesDVGlobeConfig :globe="globe" @updateChart="_updateChart" :owner="owner"></DesDVGlobeConfig>
  </div>
</template>
<script>
import DesDVGlobeConfig from "./setting/DesDVGlobeConfig.vue";
export default {
  name: "DesDVGlobeMapGlobe",
  components: { DesDVGlobeConfig },
  props: {
    owner: {
      type: Object,
      require: true,
    },
  },
  computed: {
    globe() {
      return this.chart ? this.chart.globe : {};
    },
  },
  watch: {},

  data() {
    return {
      chart: this.owner.chart,
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
  },
  beforeDestroy() {
    dsf.emit.$remove("updatePropertyChart", this.owner.$children[0]);
  },
  methods: {
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
