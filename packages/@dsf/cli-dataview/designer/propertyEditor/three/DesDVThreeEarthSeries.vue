<!--
 * @Editor: zhanghang
 * @Description: three地图系列
 * @Date: 2024-07-11 10:01:29
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 14:22:53
-->
<template>
  <div class="des-dv-map-property">
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = -1" :class="{ active: active === -1 }">世界地图</div>
      <div class="des-dv-map-series__wrapper-item" @click="active = idx" :class="{ active: active === idx }" v-for="(it, idx) in seriesNames" :key="idx" :label="idx">
        {{ getTypeName(it) }}: {{ it.name }}
      </div>
    </div>
    <DesDVThreeEarthWorld v-if="active == -1 && world" :world="world" @updateThree="_updateThree" />
    <div v-for="(it, index) in series" :key="index">
      <!-- 标记 -->
      <template v-if="active == index && it.type === 'marker'">
        <DesDVThreeEarthMarker :series="it" @updateThree="_updateThree" />
      </template>
      <!-- 动效点 -->
      <template v-else-if="active == index && it.type === 'scatter'">
        <DesDVThreeEarthScatter :series="it" @updateThree="_updateThree" />
      </template>
      <!-- 飞行线 -->
      <template v-else-if="active == index && it.type === 'flight'">
        <DesDVThreeEarthFlight :series="it" @updateThree="_updateThree" />
      </template>
      <!-- 光柱 -->
      <template v-else-if="active == index && it.type === 'lightBar'">
        <DesDVThreeEarthLightBar :series="it" @updateThree="_updateThree" />
      </template>
    </div>
  </div>
</template>
<script>
import DesDVThreeEarthMarker from "./earth/DesDVThreeEarthMarker.vue";
import DesDVThreeEarthScatter from "./earth/DesDVThreeEarthScatter.vue";
import DesDVThreeEarthFlight from "./earth/DesDVThreeEarthFlight.vue";
import DesDVThreeEarthWorld from "./earth/DesDVThreeEarthWorld.vue";
import DesDVThreeEarthLightBar from "./earth/DesDVThreeEarthLightBar.vue";
export default {
  name: "DesDVThreeEarthSeries",
  components: { DesDVThreeEarthLightBar, DesDVThreeEarthMarker, DesDVThreeEarthScatter, DesDVThreeEarthFlight, DesDVThreeEarthWorld },
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
    world() {
      return this.threeOptions.world;
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
        case "lightBar":
          name = "光柱";
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
