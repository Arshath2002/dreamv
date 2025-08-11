<!--
 * @Editor: zhanghang
 * @Description: echarts 地图基础配置
 * @Date: 2024-04-11 17:16:32
 * @LastEditors: zhanghang
 * @LastEditTime: 2025-02-17 11:15:07
-->
<template>
  <div class="des-dv-map-property">
    <div class="ds-designer-property property-item">
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" v-model="areaColor" @change="changeColor($event, mapOptions.itemStyle, 'areaColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">边线颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="mapOptions.itemStyle.borderColor" @change="changeValue($event, mapOptions.itemStyle, 'borderColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">边线宽度<span>： </span></div>
      <DesDVNumber :config="{ min: 1, unit: 'px' }" :value="mapOptions.itemStyle.borderWidth" @change="changeValue($event, mapOptions.itemStyle, 'borderWidth')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">地区标签<span>： </span></div>
      <DesDVSwitch :value="mapOptions.label.show" @change="changeValue($event, mapOptions.label, 'show')" />
    </div>
    <template v-if="mapOptions.label.show">
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">标签内容<span>： </span></div>
        <div>
          <div style="display: flex; align-items: center; margin-bottom: 5px" v-for="(formatter, index) in mapOptions.label.formatters" :key="index">
            <el-input size="small" :value="formatter" @input="changeFormatterValue($event, index)" class="data-view-text"></el-input>
            <div class="des-dv-icon-add" v-if="index == 0" @click="addFormat" style="margin: 0 5px">
              <i class="add-btn el-icon-plus"></i>
            </div>
            <div class="des-dv-icon-add" v-if="index > 0" @click="deleteItem(index)" style="margin: 0 5px">
              <i class="add-btn el-icon-minus"></i>
            </div>
          </div>
        </div>
        <DesDVToolTipsIcon
          style="margin-top: 1px"
          :data="{
            desc: '{a}=系列名; {b}=数据名; {c}=数据值;',
          }"
        ></DesDVToolTipsIcon>
      </div>
      <div class="ds-designer-property property-item ml20">
        <div class="property-item-name">样式<span>： </span></div>
        <DesDVTextStyle class="min" v-model="nameTextStyle" :config="fontConfig"></DesDVTextStyle>
      </div>

      <div class="ds-designer-property property-item float-one-row">
        <div class="property-item-name">自定义<span>： </span></div>
        <DesDVSwitch :value="mapOptions.label.isFormatter" @change="changeValue($event, mapOptions.label, 'isFormatter')" />
        <DesDVToolTipsIcon
          style="margin-top: 1px"
          :data="{
            desc: '自定义标签内容，以配置总览函数为准',
          }"
        ></DesDVToolTipsIcon>
      </div>
    </template>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">悬浮效果<span>： </span></div>
      <DesDVSwitch :value="!mapOptions.emphasis.disabled" @change="changeValue(!$event, mapOptions.emphasis, 'disabled')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="!mapOptions.emphasis.disabled">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="emphasizeTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>

    <div class="ds-designer-property property-item ml20" v-if="!mapOptions.emphasis.disabled">
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" v-model="emphasisAreaColor" @change="changeColor($event, mapOptions.itemStyle.emphasis, 'areaColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">选中效果<span>： </span></div>
      <DesDVSwitch :value="!mapOptions.select.disabled" @change="changeValue(!$event, mapOptions.select, 'disabled')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="!mapOptions.select.disabled">
      <div class="property-item-name">样式<span>： </span></div>
      <DesDVTextStyle class="min" v-model="selectTextStyle" :config="fontConfig"></DesDVTextStyle>
    </div>

    <div class="ds-designer-property property-item ml20" v-if="!mapOptions.select.disabled">
      <div class="property-item-name">区域颜色<span>： </span></div>
      <DesDVColorPicker :config="bothConfig" v-model="selectedAreaColor" @change="changeColor($event, mapOptions.select.itemStyle, 'areaColor')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">地图缩放<span>： </span></div>
      <DesDVNumber :config="{ min: 1, step: 0.1 }" :value="mapOptions.zoom" @change="changeZoom($event, mapOptions, 'zoom')" />
    </div>
    <div class="ds-designer-property property-item">
      <div class="property-item-name">阴影效果<span>： </span></div>
      <DesDVSwitch v-model="geoOptions.show" @change="changeValue($event, geoOptions, 'show')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="geoOptions.show">
      <div class="property-item-name">阴影颜色<span>： </span></div>
      <DesDVColorPicker :config="colorConfig" v-model="geoOptions.itemStyle.shadowColor" @change="changeValue($event, geoOptions.itemStyle, 'shadowColor')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="geoOptions.show">
      <div class="property-item-name">阴影大小<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="geoOptions.itemStyle.shadowBlur" @change="changeValue($event, geoOptions.itemStyle, 'shadowBlur')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="geoOptions.show">
      <div class="property-item-name">偏移X<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="geoOptions.itemStyle.shadowOffsetX" @change="changeValue($event, geoOptions.itemStyle, 'shadowOffsetX')" />
    </div>
    <div class="ds-designer-property property-item ml20" v-if="geoOptions.show">
      <div class="property-item-name">偏移Y<span>： </span></div>
      <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="geoOptions.itemStyle.shadowOffsetY" @change="changeValue($event, geoOptions.itemStyle, 'shadowOffsetY')" />
    </div>
    <!-- 按钮栏设置 -->
    <template v-if="mapButtons">
      <div class="ds-designer-property property-item">
        <div class="property-item-name">按钮栏<span>： </span></div>
        <DesDVSwitch :value="mapButtons.show" @change="changeDefaultValue($event, mapButtons, 'show')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="mapButtons.show">
        <div class="property-item-name">排列<span>： </span></div>
        <DesDVRadioGroup :data="{ dictionary: dictionary }"   :value="mapButtons.buttonsDirection" @change="changeDefaultValue($event, mapButtons, 'buttonsDirection')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="mapButtons.show">
        <div class="property-item-name">位置<span>： </span></div>
        <div class="des-dv-text-align">
          <div class="align-wrap">
            <!-- 水平位置 -->
            <Direction
              class="horizontal-items"
              type="horizontal"
              v-model="horizontal"
              :mapData="[
                { mapName: 'left', mapKey: 'left' },
                { mapName: 'right', mapKey: 'right' },
              ]"
            ></Direction>
            <!-- 垂直位置 -->
            <Direction
              class="vertical-items"
              type="vertical"
              v-model="vertical"
              :mapData="[
                { mapName: 'top', mapKey: 'top' },
                { mapName: 'bottom', mapKey: 'bottom' },
              ]"
            ></Direction>
          </div>
        </div>
      
      </div>
      <div class="ds-designer-property property-item ml20" v-if="mapButtons.show">
        <div class="property-item-name">按钮大小<span>： </span></div>
        <DesDVNumber :config="{ min: 0, unit: 'px' }" :value="mapButtons.buttonsSize" @change="changeDefaultValue($event, mapButtons, 'buttonsSize')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="mapButtons.show">
        <div class="property-item-name">按钮颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="mapButtons.buttonsColor" @change="changeDefaultValue($event, mapButtons, 'buttonsColor')" />
      </div>
      <div class="ds-designer-property property-item ml20" v-if="mapButtons.show">
        <div class="property-item-name">边框颜色<span>： </span></div>
        <DesDVColorPicker :config="colorConfig" v-model="mapButtons.borderColor" @change="changeDefaultValue($event, mapButtons, 'borderColor')" />
      </div>
    </template>
  </div>
</template>
<script>
import Direction from "_dataview/designer/setting/graph/config/tool/direction.vue";
import {createMap} from "_dataview/output/mapDefault/baseMap.js";
import commonMixin from "_dataview/designer/propertyEditor/echarts/common/commonMixin.js";
export default {
  name: "DesDVMapIndex",
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
      mapButtons: null,
      bothConfig: {
        type: "both",
      },
      colorConfig: {
        type: "color",
      },
      chart: null,
      //区域颜色
      areaColor: "",
      //悬浮区域颜色
      emphasisAreaColor: "",
      //选中区域颜色
      selectedAreaColor: "",

      horizontal: "left",
      vertical: "top",
    };
  },
  computed: {
    //基础地图配置
    mapOptions() {
      //防止丢失
      return this.chart.series[0];
    },
    //geo配置
    geoOptions() {
      return this.chart.geo;
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
        this._updateChart();
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

        this._updateChart();
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

        this._updateChart();
      },
    },
  },
  watch: {
    horizontal(v) {
      this.mapButtons.position = `${this.vertical}-${v}`;
    },
    vertical(v) {
      this.mapButtons.position = `${v}-${this.horizontal}`;
    },
  },
  created() {
    this.init();
    this.mapButtons = this.owner.mapButtonGroupAttr;

    this.vertical = this.mapButtons.position.split("-")[0];
    this.horizontal = this.mapButtons.position.split("-")[1];

    //在数据配置完成时候，接受一次最新的chart
    dsf.emit.$on(
      "updatePropertyChart",
      () => {
        this.init();
      },
      this.owner.$children[0]
    );
    this._updateChart = _.debounce(this.updateChart, 500);

    //样式风格改变
    dsf.emit.$on("updateStyleChange", this.styleChange, this.owner.$children[0]);
  },

  beforeDestroy() {
    dsf.emit.$remove("updatePropertyChart", this.owner.$children[0]);
    dsf.emit.$remove("updateStyleChange", this.owner.$children[0]);
  },
  methods: {
    addFormat() {
      this.mapOptions.label.formatters.push("");
    },
    deleteItem(index) {
      this.mapOptions.label.formatters.splice(index, 1);
      this._updateChart();
    },
    changeFormatterValue(value, index) {
      this.$set(this.mapOptions.label.formatters, index, value);
      this._updateChart();
    },
    styleChange() {
      const areaColor = this.mapOptions.itemStyle.areaColor;
      this.areaColor = dsf.dataview.utils.convertChartToCSSColor(areaColor);
    },
    init() {
      this.chart = this.owner.chart;
      let options = this.chart.series[0];
      const select = createMap().series[0].select;
      if (!options.select) {
        this.$set(options, "select", select);
      } else {
        if (options.select.disabled == undefined) {
          this.$set(options.select, "disabled", false);
        }
        if (!options.select.label) {
          this.$set(options.select, "label", select.label);
        }
        if (!options.select.itemStyle) {
          this.$set(options.select, "itemStyle", select.itemStyle);
        }
      }

      if (!options.emphasis) {
        this.$set(options, "emphasis", {
          disabled: false,
        });
      }

      if (!options.label.emphasis.disabled == undefined) {
        this.$set(options.label.emphasis, "disabled", false);
      }

      if (!Array.isArray(this.mapOptions.label.formatters)) {
        this.$set(this.mapOptions.label, "formatters", ["{b}"]);
      }
      // 是否自定义formatter
      if (Object.prototype.hasOwnProperty.call(this.mapOptions.label, "isFormatter")) {
        this.$set(this.mapOptions.label, "isFormatter", false);
      }

      const areaColor = this.mapOptions.itemStyle.areaColor;
      const emphasisAreaColor = this.mapOptions.itemStyle.emphasis.areaColor;
      const selectedAreaColor = this.mapOptions.select.itemStyle.areaColor;
      this.areaColor = dsf.dataview.utils.convertChartToCSSColor(areaColor);
      this.emphasisAreaColor = dsf.dataview.utils.convertChartToCSSColor(emphasisAreaColor);
      this.selectedAreaColor = dsf.dataview.utils.convertChartToCSSColor(selectedAreaColor);
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
    changeColor(val, item, key) {
      const color = dsf.dataview.utils.convertCSSToEChartsColor(val);
      if (!_.isEqual(item[key], color)) {
        this.$set(item, key, color);
        this._updateChart();
      }
    },
    changeValue(val, item, key) {
      this.$set(item, key, val);
      this._updateChart();
    },
    changeZoom(val, item, key) {
      if (!_.isEqual(item[key], val)) {
        this.$set(item, key, val);
        // 需要和mapOptions的值同步更改绑定input事件
        this.$set(this.chart.geo, "zoom", +val);
        this._updateChart();
      }
    },
    changeDefaultValue(val, item, key) {
      if (!_.isEqual(item[key], val)) {
        this.$set(item, key, val);
      }
    },
  },
};
</script>
<style lang="scss">
@import "_dataview/assets/styles/designer/DesDVMapProperty.scss";
</style>
