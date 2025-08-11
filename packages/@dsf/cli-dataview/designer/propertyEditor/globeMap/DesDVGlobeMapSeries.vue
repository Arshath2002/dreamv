<!--
 * @Description: 地球系列配置
 * @Author: shenah
 * @Date: 2024-07-24 17:21:16
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-14 10:37:42
-->

<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = -1" :class="{ active: active === -1 }" v-if="isShowHot">热力图</div>
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" v-show="it.allowActive" :class="{ active: active === idx }" v-for="(it, idx) in seriesNames" :key="idx" :label="idx">
        {{ getTypeName(it) }}: {{ it.name }}
      </div>
    </div>
    <div v-if="active === -1 && isShowHot">
      <!-- 热力图 -->
      <DesDVVisualMap :visualMap="chart.baseTextureOptions.visualMap" @updateChart="_updateChart" :key="uuid" :isShowAnnotation="false" />
    </div>
    <template v-if="active > -1">
      <div v-for="(it, index) in series" :key="index">
        <!-- 飞行线 -->
        <template v-if="active == index && it.type === 'lines3D'">
          <DesDVFlyMap :series="it" @updateChart="_updateChart" />
        </template>
        <!-- 散点配置项 -->
        <template v-if="active == index && it.type === 'scatter3D'">
          <DesDVScatter3DMap :series="it" @updateChart="_updateChart" />
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import DesDVFlyMap from "./setting/DesDVFlyMap.vue";
import DesDVScatter3DMap from "./setting/DesDVScatter3DMap.vue";
import DesDVVisualMap from "_dataview/designer/propertyEditor/map/setting/DesDVVisualMap.vue";
export default {
  name: "DesDVGlobeMapSeries",
  components: { DesDVFlyMap, DesDVScatter3DMap, DesDVVisualMap },
  props: {
    owner: {
      type: Object,
      require: true,
    },
  },
  provide() {
    return {
      owner: this.owner,
    };
  },
  computed: {
    isShowHot() {
      return this.chart.globe.baseTextureType === "default";
    },
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
        if (this.isShowHot && active !== -1 && (!series[active] || !this.seriesNames[active].allowActive)) {
          this.active = this.seriesNames.findIndex((it) => it.allowActive);
        } else if (!this.isShowHot && (!series[active] || !this.seriesNames[active].allowActive)) {
          this.active = this.seriesNames.findIndex((it) => it.allowActive);
        }
      },
      immediate: true,
    },
  },

  data() {
    return {
      uuid: dsf.uuid(8),
      chart: this.owner.chart,
      active: -1,
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
    getTypeName(item) {
      let name = "";
      switch (item.type) {
        case "lines3D":
          name = "飞行线";
          break;
        case "scatter3D":
          name = "散点";
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
