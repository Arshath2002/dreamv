<template>
  <div class="des-dv-map-property">
    <div v-if="dsf.isEmptyObject(layers)" class="ds-designer-property property-item">
      <div class="property-item-name" style="text-decoration: underline;">温馨提示：请先在【数据配置】里添加图层</div>
    </div>
    <div class="des-dv-map-series__wrapper">
      <div class="des-dv-map-series__wrapper-item" @click="active = index" :class="{ active: active === index }" v-for="(it, key, index) in layers" :key="key" :label="index">
        {{ getTypeName(it) }}[{{ key }}]
      </div>
    </div>
    <div v-for="(it, key, index) in layers" :key="key">
      <template v-if="active == index && it.seriesType === 'polygon'">
        <PolygonLayer :layer="it" @updateGisLayer="_updateGisLayer" />
      </template>
      <template v-if="active == index && it.seriesType === 'point'">
        <PointLayer :layer="it" @updateGisLayer="_updateGisLayer" />
      </template>
      <template v-if="active == index && it.seriesType === 'scatter'">
        <ScatterLayer :layer="it" @updateGisLayer="_updateGisLayer" />
      </template>
      <template v-if="active == index && it.seriesType === 'heatMap'">
        <HeatMapLayer :layer="it" @updateGisLayer="_updateGisLayer" />
      </template>
      <template v-if="active == index && it.seriesType === 'flatBar'">
        <FlatBarLayer :layer="it" @updateGisLayer="_updateGisLayer" />
      </template>
      <template v-if="active == index && it.seriesType === 'pulseLink'">
        <PulseLinkLayer :layer="it" @updateGisLayer="_updateGisLayer" />
      </template>
      <template v-if="active == index && it.seriesType === 'icon'">
        <IconLayer :layer="it" @updateGisLayer="_updateGisLayer" />
      </template>
    </div>
  </div>
</template>
<script>
import PolygonLayer from "./layers/PolygonLayer.vue";
import PointLayer from "./layers/PointLayer.vue";
import ScatterLayer from "./layers/ScatterLayer.vue";
import HeatMapLayer from "./layers/HeatMapLayer.vue";
import FlatBarLayer from "./layers/FlatBarLayer.vue";
import PulseLinkLayer from "./layers/PulseLinkLayer.vue";
import IconLayer from "./layers/IconLayer.vue";
export default {
  name: "DesDVGisLayer",
  components: { PolygonLayer, PointLayer, ScatterLayer, HeatMapLayer, FlatBarLayer, PulseLinkLayer, IconLayer },
  provide() {
    return {
      owner: this.owner,
    };
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    owner: {
      type: Object,
      require: true,
    },
  },
  computed: {
    config() {
      let config = this.data.config;
      return config || {};
    },
    layers() {
      return this.owner.layerStyles;
    },
  },
  data() {
    return {
      active: 0,
    };
  },
  created() {
    this._updateGisLayer = _.debounce(this.updateGisLayer, 500);
  },
  methods: {
    getTypeName(item) {
      let name = "";
      switch (item.seriesType) {
        case "polygon":
          name = "区域";
          break;
        case "point":
          name = "点";
          break;
        case "scatter":
          name = "贴地点";
          break;
        case "heatMap":
          name = "热力图";
          break;
        case "flatBar":
          name = "柱体";
          break;
        case "pulseLink":
          name = "飞行线";
          break;
        case "icon":
          name = "图标";
          break;
      }
      return name;
    },
    updateGisLayer() {
      dsf.emit.$emit(
        "updateGisLayer",
        {
          layers: this.layers,
        },
        [this.owner.$children[0]]
      );
    },
  },
};
</script>
