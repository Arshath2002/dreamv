<!--
 * @Editor: zhanghang
 * @Date: 2024-04-24 10:35:58
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-04-03 10:18:12
-->
<template>
  <div style="width: 100%" class="des-dv-map-property">
    <div class="plus-text">
      <span @click="addYAxis"><DsfIcon name="hao" class="plus-text-icon"></DsfIcon>&nbsp;新增Y轴</span>
      <span v-if="config && config.isXValue">X轴数值&nbsp;<DesDVSwitch v-model="chart.isXValue" @change="_updateChart"/></span>
      <span v-if="config && config.hasChange" @click="changeAxis"><DsfIcon class="plus-text-icon" name="zhihuan"></DsfIcon>&nbsp;XY互换</span>
    </div>
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = `x-${idx}`" :class="{ active: active === `x-${idx}` }" v-for="(it, idx) in xAxisNav" :key="`x-${idx}`" :label="idx">
        {{ `X${idx + 1}轴` }}
        <DsfIcon @click.stop="deleteAxis(xAxisNav, idx, true)" v-if="idx > 0" class="del-icon" name="close"></DsfIcon>
      </div>
      <div class="des-dv-map-series__wrapper-item" @click="active = `y-${idx}`" :class="{ active: active === `y-${idx}` }" v-for="(it, idx) in yAxisNav" :key="`y-${idx}`" :label="idx">
        {{ `Y${idx + 1}轴` }}
        <DsfIcon @click.stop="deleteAxis(yAxisNav, idx, false)" v-if="idx > 0" class="del-icon" name="close"></DsfIcon>
      </div>
    </div>

    <div v-for="(it, index) in xAxisNav" :key="`x-${index}`">
      <template v-if="active == `x-${index}`">
        <ChartAxis :chart="chart" :isX="true" :axis="it" @updateChart="_updateChart" :mapFieldList="mapFieldList"/>
      </template>
    </div>

    <div v-for="(it, index) in yAxisNav" :key="`y-${index}`">
      <template v-if="active == `y-${index}`">
        <ChartAxis :chart="chart" :isX="false" :axis="it" @updateChart="_updateChart" :mapFieldList="mapFieldList" />
      </template>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin.js";
import ChartAxis from "./chartAxis.vue";
import xAxis from "_dataview/output/chartDefault/xaxis.js";
import yAxis from "_dataview/output/chartDefault/yaxis.js";
export default {
  name: "DesDVChartMixinAxis",
  mixins: [mixin],
  components: { ChartAxis },
  computed: {
    xAxis() {
      return this.chart.xAxis;
    },
    yAxis() {
      return this.chart.yAxis;
    },
    xAxisNav() {
      return this.xAxis;
    },
    yAxisNav() {
      return this.yAxis;
    },
  },
  data() {
    return {
      active: "x-0",
    };
  },
  methods: {
    //添加Y轴
    addYAxis() {
      let { isReturn } = this.chart;
      let res = isReturn ? xAxis.xAxis[0] : yAxis.yAxis[0];
      res = _.cloneDeep(res);
      res.position = "right";
      this.yAxis.push(res);
      this._updateChart();
    },
    //XY互换
    changeAxis() {
      let { xAxis, yAxis, isReturn } = this.chart;
      let changeXAxis = _.cloneDeep(yAxis);
      changeXAxis.forEach((it) => {
        it.position = "bottom";
      });
      let changeYAxis = _.cloneDeep(xAxis);
      changeYAxis.forEach((it) => {
        it.position = "left";
      });
      this.$set(this.chart, "xAxis", changeXAxis);
      this.$set(this.chart, "yAxis", changeYAxis);
      this.$set(this.chart, "isReturn", !isReturn);
      this._updateChart();
    },
    deleteAxis(axis, index, isX) {
      this.chart.series.forEach((it) => {
        if (isX && it.xAxisIndex === index) {
          it.xAxisIndex = 0;
        } else if (!isX && it.yAxisIndex === index) {
          it.yAxisIndex = 0;
        }
      });
      axis.splice(index, 1);
      this._updateChart();
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
