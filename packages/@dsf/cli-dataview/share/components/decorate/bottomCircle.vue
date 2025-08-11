<!--
 * @Description: 
 * @Author: zhanghang
 * @Date: 2022-07-21 10:45:52
 * @LastEditors: zhanghang
 * @LastEditTime: 2024-11-28 14:39:00
-->
<template>
  <div
    class="data-view-item-wrap dsf-decorate ds-control data-view-bottom-circle data-view-no-padding"
    :style="{
      ...controlStyle,
      ...getCommonEnterAnimateStyle,
    }"
  >
    <div
      class="bottom-gauge"
      :style="{ bottom: getBottom }"
      :class="[{ rotate: isReturn }]"
    >
      <div
        class="chart chart-4"
        ref="chart-4"
      ></div>

      <div
        class="chart chart-3"
        ref="chart-3"
      ></div>

      <div
        class="chart chart-2"
        ref="chart-2"
      ></div>

      <div
        class="chart chart-1"
        ref="chart-1"
      ></div>
    </div>
    <div
      class="bottom-circle-content"
      :style="controlInnerStyle"
      slot-name="default"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script>
import {
  createChart4,
  createChart3,
  createChart2,
  createChart1,
} from "_dataview/output/chartDefault/bottomCircle.js";
import border from "_dataview/mixins/border.js";
export default dsf.component({
  name: "DsfDataViewBottomCircle",
  ctrlCaption: "底部旋转",
  mixins: [$mixins.dataView, border],
  props: {
    mainColor: {
      type: String,
      default: "#11976d",
    },
    viceColor: {
      type: String,
      default: "#124d3d",
    },
    thirdColor: {
      type: String,
      default: "#76978e",
    },
    isReturn: {
      type: Boolean,
      default: true,
    },
    isRotate: {
      type: Boolean,
      default: true,
    },
    rotateSpeed: {
      type: String,
      default: "0.1",
    },
    padding: {
      type: Array,
      default: () => [10, 10, 10, 10],
    },
    bottom: {
      type: String,
      default: "0",
    },
    slots: {
      type: Array,
      default() {
        return [
          {
            name: "default",
            controls: [],
          },
        ];
      },
    },
    comType: {
      type: String,
      default: "dsf.dataviewbottomcircle",
    },
  },
  computed: {
    getBottom() {
      let bottom = this.bottom;
      if (/.*px$/.test(bottom)) {
        return bottom;
      }
      return this.bottom + "px";
    },
    controlInnerStyle() {
      let { padding } = this;
      return { padding: dsf.dataview.utils.transformArrayPx(padding) };
    },
  },
  data() {
    return {
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      //旋转角度
      leftRotSize: 0,
      requestAnimationFrameID: null,
    };
  },
  mounted() {
    this.loadCharts(this)
      .then(() => {
        this.init();
      })
      .catch((ex) => {
        dsf.error(ex);
      });
  },
  watch: {
    isRotate(v) {
      if (v) {
        this.init();
      }
    },
  },
  methods: {
    resize() {
      setTimeout(() => {
        this.chart1 && this.chart1.resize();
        this.chart2 && this.chart2.resize();
        this.chart3 && this.chart3.resize();
        this.chart4 && this.chart4.resize();
      }, 500);
    },
    loadCharts() {
      return dsf.chart
        .loadEcharts(this)
        .then(() => {
          let echarts = window.$echarts || window.echarts;
          this.chart1 = echarts.init(this.$refs["chart-1"]);
          this.chart2 = echarts.init(this.$refs["chart-2"]);
          this.chart3 = echarts.init(this.$refs["chart-3"]);
          this.chart4 = echarts.init(this.$refs["chart-4"]);
        })
        .catch((ex) => {
          throw ex;
        });
    },
    init() {
      this.leftRotSize === 360
        ? (this.leftRotSize = 0)
        : (this.leftRotSize += Number(this.rotateSpeed));
      let leftRotSize = this.leftRotSize;
      this.chart4 &&
        this.chart4.setOption(
          createChart4(leftRotSize, this.mainColor, this.viceColor),
          true
        );
      this.chart3 &&
        this.chart3.setOption(createChart3(leftRotSize, this.mainColor), true);
      this.chart2 && this.chart2.setOption(createChart2(this.thirdColor), true);
      this.chart1 &&
        this.chart1.setOption(createChart1(leftRotSize, this.thirdColor), true);
      if (this.isRotate) {
        this.requestAnimationFrameID = requestAnimationFrame(
          this.init.bind(this)
        );
      }
    },
  },
  beforeDestroy() {
    this.requestAnimationFrameID &&
      cancelAnimationFrame(this.requestAnimationFrameID);
  },
});
</script>
<style lang="scss">
@import "_dataview/assets/styles/share/components/decorate.scss";
</style>