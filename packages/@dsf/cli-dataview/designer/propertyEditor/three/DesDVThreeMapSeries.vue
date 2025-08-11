<!--
 * @Editor: zhanghang
 * @Description: three地图系列
 * @Date: 2024-07-11 10:01:29
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:23:20
-->
<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = -1" :class="{ active: active === -1 }">基础地图</div>
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" :class="{ active: active === idx }" v-for="(it, idx) in seriesNames" :key="idx" :label="idx">
        {{ getTypeName(it) }}: {{ it.name }}
      </div>
    </div>
    <DesDVThreeHeatMap v-if="active == -1" :visualMap="visualMap" @updateThree="_updateThree" />
    <div v-for="(it, index) in series" :key="index">
      <!-- 标记 -->
      <template v-if="active == index && it.type === 'marker'">
        <DesDVThreeMapMarker :series="it" @updateThree="_updateThree" />
      </template>
      <!-- 柱体 -->
      <template v-else-if="active == index && it.type === 'prism'">
        <DesDVThreeMapPrism :series="it" @updateThree="_updateThree" />
      </template>
      <!-- 动效点 -->
      <template v-else-if="active == index && it.type === 'scatter'">
        <DesDVThreeMapScatter :series="it" @updateThree="_updateThree" />
      </template>
      <!-- 飞行线 -->
      <template v-else-if="active == index && it.type === 'flight'">
        <DesDVThreeMapFlight :series="it" @updateThree="_updateThree" />
      </template>
      <!-- 3D柱体 -->
      <template v-else-if="active == index && it.type === 'cylinder'">
        <DesDVThreeMapCylinder :series="it" @updateThree="_updateThree" />
      </template>
    </div>
  </div>
</template>
<script>
import DesDVThreeHeatMap from "./setting/DesDVThreeHeatMap.vue";
import DesDVThreeMapMarker from "./setting/DesDVThreeMapMarker.vue";
import DesDVThreeMapPrism from "./setting/DesDVThreeMapPrism.vue";
import DesDVThreeMapScatter from "./setting/DesDVThreeMapScatter.vue";
import DesDVThreeMapFlight from "./setting/DesDVThreeMapFlight.vue";
import DesDVThreeMapCylinder from "./setting/DesDVThreeMapCylinder.vue";

export default {
  name: "DesDVThreeMapSeries",
  components: { DesDVThreeMapCylinder, DesDVThreeHeatMap, DesDVThreeMapMarker, DesDVThreeMapPrism, DesDVThreeMapScatter, DesDVThreeMapFlight },
  props: {
    owner: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      threeOptions: this.owner.threeOptions,
      active: -1,
    };
  },
  created() {
    dsf.emit.$on(
      "updatePropertyThree",
      () => {
        this.threeOptions = this.owner.threeOptions;
      },
      this.owner.$children[0]
    );
    this._updateThree = _.debounce(this.updateThree, 500);
  },
  beforeDestroy() {
    dsf.emit.$remove("updatePropertyThree", this.owner.$children[0]);
  },
  computed: {
    visualMap() {
      return this.threeOptions.itemStyle.range;
    },
    seriesNames() {
      let showSeries = [];
      let threeOptions = this.threeOptions;
      if (threeOptions) {
        threeOptions.series.forEach((it) => {
          showSeries.push({
            name: it.seriesName,
            type: it.type,
          });
        });
      }
      return showSeries;
    },
    series() {
      return this.threeOptions ? this.threeOptions.series : [];
    },
  },
  methods: {
    getTypeName(item) {
      let name = "";
      switch (item.type) {
        case "flight":
          name = "飞行线";
          break;
        case "scatter":
          name = "动效点";
          break;
        case "marker":
          name = "标记";
          break;
        case "prism":
          name = "柱体";
          break;
        case "cylinder":
          name = "3D柱体";
          break;
      }
      return name;
    },
    updateThree() {
      dsf.emit.$emit(
        "updateThree",
        {
          threeOptions: this.threeOptions,
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
