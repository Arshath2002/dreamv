<!--
 * @Description: 区域颜色
 * @Author: shenah
 * @Date: 2024-07-26 15:19:58
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-13 09:47:36
-->


<template>
  <div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">地图底色<span>： </span></div>
      <DesDVColorPicker
        :config="bothConfig"
        v-model="bgColor"
        @change="changeColor($event, innerChart, 'backgroundColor')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVColorPicker
        :config="bothConfig"
        v-model="areaColor"
        @change="changeColor($event, mapOptions.itemStyle, 'areaColor')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">边线颜色<span>： </span></div>
      <DesDVColorPicker
        :config="colorConfig"
        v-model="mapOptions.itemStyle.borderColor"
        @change="changeValue($event, mapOptions.itemStyle, 'borderColor')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">边线宽度<span>： </span></div>
      <DesDVNumber
        :config="{ min: 1, unit: 'px' }"
        :value="mapOptions.itemStyle.borderWidth"
        @change="changeValue($event, mapOptions.itemStyle, 'borderWidth')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">地区名称<span>： </span></div>
      <DesDVSwitch
        :value="mapOptions.label.show"
        @change="changeValue($event, mapOptions.label, 'show')"
      />
    </div>
    <div
      class="ds-designer-property property-item ml20"
      v-if="mapOptions.label.show"
    >
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle
        class="min"
        v-model="nameTextStyle"
        :config="fontConfig"
      ></DesDVTextStyle>
    </div>

    <div
      class="ds-designer-property property-item ml20"
      v-if="mapOptions.label.show"
    >
      <div class="property-item-name">悬浮显示地区名称<span>： </span></div>
      <DesDVSwitch
        :value="mapOptions.label.emphasis.show"
        @change="changeValue($event, mapOptions.label.emphasis, 'show')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">悬浮效果<span>： </span></div>
      <DesDVSwitch
        :value="!mapOptions.emphasis.disabled"
        @change="changeValue(!$event, mapOptions.emphasis, 'disabled')"
      />
    </div>
    <div
      class="ds-designer-property property-item ml20"
      v-if="!mapOptions.emphasis.disabled"
    >
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle
        class="min"
        v-model="emphasizeTextStyle"
        :config="fontConfig"
      ></DesDVTextStyle>
    </div>

    <div
      class="ds-designer-property property-item ml20"
      v-if="!mapOptions.emphasis.disabled"
    >
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVColorPicker
        :config="bothConfig"
        v-model="emphasisAreaColor"
        @change="changeColor($event, mapOptions.itemStyle.emphasis, 'areaColor')"
      />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">选中效果<span>： </span></div>
      <DesDVSwitch
        :value="!mapOptions.select.disabled"
        @change="changeValue(!$event, mapOptions.select, 'disabled')"
      />
    </div>
    <div
      class="ds-designer-property property-item ml20"
      v-if="!mapOptions.select.disabled"
    >
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle
        v-model="selectTextStyle"
        :config="fontConfig"
      ></DesDVTextStyle>
    </div>

    <div
      class="ds-designer-property property-item ml20"
      v-if="!mapOptions.select.disabled"
    >
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVColorPicker
        :config="bothConfig"
        v-model="selectedAreaColor"
        @change="changeColor($event, mapOptions.select.itemStyle, 'areaColor')"
      />
    </div>
  </div>
</template>
<script>



import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "DesDVAreaMap",
  mixins: [commonMixin],
  components: {

    
    Direction,
    
  },
  props: {
    owner: {
      type: Object,
      require: true,
    },
  },
  filters: {
    formatCenter(center, idx) {
      if (!center) {
        return "";
      }
      return center[idx];
    },
  },
  data() {
    return {
      dictionary: [
        {
          text: "横向排布",
          value: "row",
        },
        {
          text: "纵向排布",
          value: "column",
        },
      ],
      bothConfig: {
        type: "both",
      },
      colorConfig: {
        type: "color",
      },
      chart: null,
      bgColor: "",
      //区域颜色
      areaColor: "",
      //悬浮区域颜色
      emphasisAreaColor: "",
      //选中区域颜色
      selectedAreaColor: "",
    };
  },
  computed: {
    innerChart() {
      return this.chart.baseTextureOptions;
    },
    mapOptions() {
      return this.chart.baseTextureOptions.series[0];
    },
    nameTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = 12 } = this.mapOptions.label;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.mapOptions.label, v);
        this.$emit("updateChart");
      },
    },
    emphasizeTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = 12 } = this.mapOptions.label.emphasis;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.mapOptions.label.emphasis, v);

        this.$emit("updateChart");
      },
    },
    selectTextStyle: {
      get() {
        let { color = "rgba(51, 51, 51, 1)", fontWeight = "normal", fontFamily = "Microsoft Yahei", fontSize = 12 } = this.mapOptions.select.label;
        return {
          color,
          fontWeight,
          fontFamily,
          fontSize,
        };
      },
      set(v) {
        Object.assign(this.mapOptions.select.label, v);
        this.$emit("updateChart");
      },
    },
  },
  watch: {
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.chart = this.owner.chart;
      const bgColor = this.innerChart.backgroundColor;
      const areaColor = this.mapOptions.itemStyle.areaColor;
      const emphasisAreaColor = this.mapOptions.itemStyle.emphasis.areaColor;
      const selectedAreaColor = this.mapOptions.select.itemStyle.areaColor;
      this.bgColor = dsf.dataview.utils.convertChartToCSSColor(bgColor);
      this.areaColor = dsf.dataview.utils.convertChartToCSSColor(areaColor);
      this.emphasisAreaColor = dsf.dataview.utils.convertChartToCSSColor(emphasisAreaColor);
      this.selectedAreaColor = dsf.dataview.utils.convertChartToCSSColor(selectedAreaColor);
    },
    changeColor(val, item, key) {
      const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      if (!_.isEqual(item[key], color)) {
        this.$set(item, key, color);
        this.$emit("updateChart");
      }
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this.$emit("updateChart");
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
