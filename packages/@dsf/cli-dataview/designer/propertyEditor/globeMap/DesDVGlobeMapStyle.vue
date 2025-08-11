<!--
 * @Description: 球体配置
 * @Author: shenah
 * @Date: 2024-07-26 09:47:28
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 18:07:43
-->

<template>
  <div class="des-dv-map-property">
    <!-- 区域名称 -->
    <DesDVAreaMap :owner="owner" @updateChart="_updateChart" :key="uuid"></DesDVAreaMap>
  </div>
</template>
<script>
import DesDVAreaMap from "./setting/DesDVAreaMap.vue";
export default {
  name: "DesDVGlobeMapStyle",
  components: { DesDVAreaMap },
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
      uuid: dsf.uuid(8),
      chart: this.owner.chart,
    };
  },
  created() {
    //在数据配置完成时候，接受一次最新的chart
    dsf.emit.$on(
      "updatePropertyChart",
      () => {
        this.uuid = dsf.uuid(8);
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
